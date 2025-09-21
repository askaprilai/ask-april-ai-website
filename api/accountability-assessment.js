// Accountability Assessment API - Saves assessment results with company analytics
import { supabaseAdmin } from '../lib/supabase.js'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    return handleAssessmentSubmission(req, res)
  } else if (req.method === 'GET') {
    return handleCompanyAnalytics(req, res)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

// Handle new assessment submission
async function handleAssessmentSubmission(req, res) {
  try {
    const {
      firstName,
      email,
      companyCode,
      assessmentAnswers,
      totalScore,
      percentageScore,
      completedAt,
      source = 'web_assessment'
    } = req.body

    // Validate required fields
    if (!firstName || !email || !assessmentAnswers || totalScore === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['firstName', 'email', 'assessmentAnswers', 'totalScore']
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Extract individual step scores from assessmentAnswers
    const stepScores = extractStepScores(assessmentAnswers)
    
    // Calculate priority step (lowest scoring step)
    const priorityStep = findPriorityStep(stepScores)

    console.log('Processing assessment submission:', { 
      firstName, 
      email, 
      companyCode, 
      totalScore,
      percentageScore,
      priorityStep: priorityStep.name
    })

    // Insert assessment into database
    const { data: assessmentData, error: insertError } = await supabaseAdmin
      .from('accountability_assessments')
      .insert({
        first_name: firstName.trim(),
        email: email.toLowerCase().trim(),
        company_code: companyCode?.trim() || null,
        total_score: totalScore,
        percentage_score: percentageScore,
        step_1_score: stepScores.step1,
        step_2_score: stepScores.step2,
        step_3_score: stepScores.step3,
        step_4_score: stepScores.step4,
        step_5_score: stepScores.step5,
        step_6_score: stepScores.step6,
        step_7_score: stepScores.step7,
        step_8_score: stepScores.step8,
        step_9_score: stepScores.step9,
        assessment_answers: assessmentAnswers,
        priority_step_name: priorityStep.name,
        priority_step_score: priorityStep.score,
        score_description: generateScoreDescription(percentageScore),
        completed_at: completedAt || new Date().toISOString(),
        source: source
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting assessment:', insertError)
      return res.status(500).json({ 
        error: 'Failed to save assessment',
        details: insertError.message 
      })
    }

    console.log('✅ Assessment saved successfully:', assessmentData.id)

    // Get company analytics if company code provided
    let companyAnalytics = null
    if (companyCode) {
      try {
        const { data: analytics } = await supabaseAdmin
          .from('company_analytics')
          .select('*')
          .eq('company_code', companyCode.trim())
          .single()
        
        companyAnalytics = analytics
        console.log('📊 Company analytics retrieved for:', companyCode)
      } catch (analyticsError) {
        console.log('📊 Company analytics not yet available for:', companyCode)
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Assessment saved successfully',
      data: {
        id: assessmentData.id,
        firstName: assessmentData.first_name,
        email: assessmentData.email,
        companyCode: assessmentData.company_code,
        totalScore: assessmentData.total_score,
        percentageScore: assessmentData.percentage_score,
        priorityStep: {
          name: assessmentData.priority_step_name,
          score: assessmentData.priority_step_score
        },
        scoreDescription: assessmentData.score_description,
        completedAt: assessmentData.completed_at,
        companyAnalytics: companyAnalytics
      }
    })

  } catch (error) {
    console.error('❌ Assessment API Error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    })
  }
}

// Handle company analytics requests
async function handleCompanyAnalytics(req, res) {
  try {
    const { companyCode } = req.query

    if (!companyCode) {
      return res.status(400).json({ error: 'Company code required' })
    }

    // Get company analytics
    const { data: analytics, error } = await supabaseAdmin
      .from('company_analytics')
      .select('*')
      .eq('company_code', companyCode)
      .single()

    if (error) {
      return res.status(404).json({ 
        error: 'Company analytics not found',
        message: 'No assessments yet for this company code'
      })
    }

    // Get recent individual assessments for this company (last 10)
    const { data: recentAssessments } = await supabaseAdmin
      .from('accountability_assessments')
      .select('id, first_name, percentage_score, priority_step_name, completed_at')
      .eq('company_code', companyCode)
      .order('completed_at', { ascending: false })
      .limit(10)

    return res.status(200).json({
      success: true,
      companyCode: companyCode,
      analytics: analytics,
      recentAssessments: recentAssessments || []
    })

  } catch (error) {
    console.error('❌ Company Analytics API Error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    })
  }
}

// Helper function to extract individual step scores
function extractStepScores(assessmentAnswers) {
  return {
    step1: assessmentAnswers.q1 || 0,
    step2: assessmentAnswers.q2 || 0,
    step3: assessmentAnswers.q3 || 0,
    step4: assessmentAnswers.q4 || 0,
    step5: assessmentAnswers.q5 || 0,
    step6: assessmentAnswers.q6 || 0,
    step7: assessmentAnswers.q7 || 0,
    step8: assessmentAnswers.q8 || 0,
    step9: assessmentAnswers.q9 || 0
  }
}

// Helper function to find priority step (lowest score)
function findPriorityStep(stepScores) {
  const steps = [
    { name: 'Right Person, Right Role', score: stepScores.step1 },
    { name: 'Expectations Are Clear & Confirmed', score: stepScores.step2 },
    { name: 'Agreed Consequences for Missed Expectations', score: stepScores.step3 },
    { name: 'Follow-Up Plan Locked In', score: stepScores.step4 },
    { name: 'Course-Correct Quickly', score: stepScores.step5 },
    { name: 'Show Up Consistently', score: stepScores.step6 },
    { name: 'Clarify Before You Assume', score: stepScores.step7 },
    { name: 'Celebrate What\'s Working', score: stepScores.step8 },
    { name: 'Missed the Mark? Restart at Step 1', score: stepScores.step9 }
  ]

  return steps.reduce((lowest, current) => 
    current.score < lowest.score ? current : lowest
  )
}

// Helper function to generate score description
function generateScoreDescription(percentageScore) {
  if (percentageScore >= 85) {
    return "Exceptional Leadership - You demonstrate mastery across the accountability framework"
  } else if (percentageScore >= 70) {
    return "Strong Leadership - Good foundation with opportunities for targeted improvement"
  } else if (percentageScore >= 55) {
    return "Developing Leadership - Several areas need attention to increase effectiveness"
  } else {
    return "Emerging Leadership - Significant development opportunities across the framework"
  }
}