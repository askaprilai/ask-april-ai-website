require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3002;

// Configure multer for file uploads
const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept common document formats
        const allowedTypes = [
            'text/plain',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/html'
        ];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Please upload PDF, Word, HTML, or text files.'));
        }
    }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// Store active conversations in memory (in production, use a database)
const activeConversations = new Map();

// Document templates and industry-specific data
const documentTemplates = {
    'employee-handbook': {
        name: 'Employee Handbook',
        timeEstimate: '15-30 mins',
        sections: [
            'Welcome Message',
            'Company Overview',
            'Employment Policies',
            'Workplace Conduct',
            'Benefits and Compensation',
            'Safety and Security',
            'Performance Standards',
            'Progressive Discipline',
            'Employee Resources'
        ]
    },
    'training-program': {
        name: 'Training Program',
        timeEstimate: '20-45 mins',
        sections: [
            'Program Overview',
            'Learning Objectives',
            'Training Schedule',
            'Core Competencies',
            'Assessment Methods',
            'Resources and Materials',
            'Progress Tracking',
            'Certification Requirements'
        ]
    },
    'policy-document': {
        name: 'Policy Document',
        timeEstimate: '10-20 mins',
        sections: [
            'Policy Statement',
            'Purpose and Scope',
            'Definitions',
            'Procedures',
            'Responsibilities',
            'Compliance Requirements',
            'Enforcement',
            'Review and Updates'
        ]
    },
    'process-documentation': {
        name: 'Process Documentation',
        timeEstimate: '15-25 mins',
        sections: [
            'Process Overview',
            'Prerequisites',
            'Step-by-Step Instructions',
            'Quality Checkpoints',
            'Troubleshooting Guide',
            'Best Practices',
            'Common Mistakes',
            'Review and Approval'
        ]
    }
};

const industrySpecifics = {
    'restaurant': {
        name: 'Restaurant/Food Service',
        commonChallenges: ['Food safety compliance', 'High turnover', 'Peak hour management', 'Customer service standards'],
        regulations: ['Health department requirements', 'Food handling certification', 'Alcohol service laws', 'Labor regulations'],
        keyRoles: ['Server', 'Cook', 'Host/Hostess', 'Manager', 'Dishwasher', 'Bartender']
    },
    'retail': {
        name: 'Retail',
        commonChallenges: ['Loss prevention', 'Seasonal staffing', 'Customer complaints', 'Inventory management'],
        regulations: ['Consumer protection laws', 'Return policies', 'Safety regulations', 'Labor standards'],
        keyRoles: ['Sales Associate', 'Cashier', 'Stock Associate', 'Supervisor', 'Manager', 'Visual Merchandiser']
    },
    'healthcare': {
        name: 'Healthcare',
        commonChallenges: ['HIPAA compliance', 'Patient satisfaction', 'Emergency procedures', 'Staff certification'],
        regulations: ['HIPAA privacy rules', 'OSHA standards', 'State licensing requirements', 'Patient rights'],
        keyRoles: ['Receptionist', 'Medical Assistant', 'Nurse', 'Technician', 'Administrator']
    },
    'professional-services': {
        name: 'Professional Services',
        commonChallenges: ['Client confidentiality', 'Project management', 'Quality assurance', 'Professional development'],
        regulations: ['Professional licensing', 'Client confidentiality', 'Data protection', 'Industry standards'],
        keyRoles: ['Consultant', 'Administrator', 'Project Manager', 'Analyst', 'Client Relations']
    }
};

// AI Co-Pilot API Endpoints

// Upload and analyze existing document
app.post('/api/copilot/upload', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { documentType, improvementGoals } = req.body;
        
        // Read the uploaded file
        const filePath = req.file.path;
        let fileContent = '';
        
        try {
            if (req.file.mimetype === 'text/plain' || req.file.mimetype === 'text/html') {
                fileContent = await fs.readFile(filePath, 'utf8');
            } else {
                // For other file types, we'll extract text (simplified for now)
                fileContent = await fs.readFile(filePath, 'utf8');
            }
        } catch (error) {
            console.error('Error reading file:', error);
            return res.status(400).json({ error: 'Could not read uploaded file' });
        }

        // Analyze the document
        const analysis = analyzeExistingDocument(fileContent, documentType);
        
        const conversationId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        
        // Initialize conversation with uploaded document
        const conversation = {
            id: conversationId,
            documentType: documentType || 'document-update',
            originalDocument: {
                filename: req.file.originalname,
                content: fileContent,
                analysis: analysis
            },
            currentStep: 'document_analysis',
            collectedInfo: {
                improvement_goals: improvementGoals || ''
            },
            messages: [],
            createdAt: new Date().toISOString()
        };

        activeConversations.set(conversationId, conversation);

        // Clean up uploaded file
        await fs.unlink(filePath);

        const response = {
            conversationId,
            message: `I've analyzed your ${req.file.originalname}. Here's what I found:`,
            analysis: analysis,
            suggestions: generateImprovementSuggestions(analysis),
            nextStep: 'review_analysis'
        };

        res.json(response);
    } catch (error) {
        console.error('Error uploading document:', error);
        res.status(500).json({ error: 'Failed to process uploaded document' });
    }
});

// Start a new conversation
app.post('/api/copilot/start', async (req, res) => {
    try {
        const { documentType, businessInfo } = req.body;
        
        if (!documentType || !documentTemplates[documentType]) {
            return res.status(400).json({
                error: 'Invalid document type',
                availableTypes: Object.keys(documentTemplates)
            });
        }

        const conversationId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const template = documentTemplates[documentType];
        
        // Initialize conversation state
        const conversation = {
            id: conversationId,
            documentType,
            template,
            businessInfo: businessInfo || {},
            currentStep: 'gathering_info',
            collectedInfo: {},
            messages: [],
            createdAt: new Date().toISOString()
        };

        activeConversations.set(conversationId, conversation);

        // Generate initial questions based on document type and business info
        const initialQuestions = generateInitialQuestions(documentType, businessInfo);
        
        const response = {
            conversationId,
            message: `Hi! I'm April, and I'm excited to help you create a professional ${template.name.toLowerCase()}. This usually takes about ${template.timeEstimate}, and I'll guide you through each step.`,
            questions: initialQuestions,
            estimatedTime: template.timeEstimate,
            nextStep: 'answer_questions'
        };

        res.json(response);
    } catch (error) {
        console.error('Error starting conversation:', error);
        res.status(500).json({ error: 'Failed to start conversation' });
    }
});

// Continue conversation with user responses
app.post('/api/copilot/continue', async (req, res) => {
    try {
        const { conversationId, answers, message } = req.body;
        
        const conversation = activeConversations.get(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        // Store user's answers
        if (answers) {
            Object.assign(conversation.collectedInfo, answers);
        }

        // Add user message to history
        if (message) {
            conversation.messages.push({
                role: 'user',
                content: message,
                timestamp: new Date().toISOString()
            });
        }

        // Determine next step based on current progress
        let response;
        
        if (conversation.currentStep === 'document_analysis') {
            // Handle uploaded document improvement
            conversation.currentStep = 'generating_document';
            response = {
                message: "Perfect! I'll now create an improved version of your document based on my analysis and your input. This will take about 2-3 minutes...",
                nextStep: 'document_generation',
                status: 'generating'
            };
            
            // Start document improvement generation
            setTimeout(() => {
                generateImprovedDocument(conversation);
            }, 3000);
        } else if (conversation.currentStep === 'gathering_info') {
            // Check if we have enough information to proceed
            const missingInfo = identifyMissingInformation(conversation);
            
            if (missingInfo.length > 0) {
                response = {
                    message: "Great! I have some follow-up questions to make sure your document is perfectly tailored to your business.",
                    questions: missingInfo,
                    nextStep: 'answer_questions'
                };
            } else {
                conversation.currentStep = 'generating_document';
                response = {
                    message: "Perfect! I have all the information I need. Let me create your document now. This will take about 2-3 minutes...",
                    nextStep: 'document_generation',
                    status: 'generating'
                };
                
                // Start document generation (simulated for now)
                setTimeout(() => {
                    generateDocument(conversation);
                }, 3000);
            }
        } else if (conversation.currentStep === 'document_ready') {
            response = {
                message: "Your document is ready! You can download it below, and I'm here if you need any adjustments.",
                document: conversation.generatedDocument,
                nextStep: 'review_and_download'
            };
        }

        // Add April's response to conversation history
        conversation.messages.push({
            role: 'assistant',
            content: response.message,
            timestamp: new Date().toISOString()
        });

        activeConversations.set(conversationId, conversation);
        res.json(response);

    } catch (error) {
        console.error('Error continuing conversation:', error);
        res.status(500).json({ error: 'Failed to continue conversation' });
    }
});

// Check document generation status
app.get('/api/copilot/status/:conversationId', async (req, res) => {
    try {
        const { conversationId } = req.params;
        const conversation = activeConversations.get(conversationId);
        
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        const response = {
            status: conversation.currentStep,
            progress: calculateProgress(conversation),
            estimatedTimeRemaining: estimateTimeRemaining(conversation)
        };

        if (conversation.currentStep === 'document_ready') {
            response.document = conversation.generatedDocument;
            response.message = "Your document is ready for download!";
        }

        res.json(response);
    } catch (error) {
        console.error('Error checking status:', error);
        res.status(500).json({ error: 'Failed to check status' });
    }
});

// Download generated document
app.get('/api/copilot/download/:conversationId', async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { format = 'html' } = req.query;
        
        const conversation = activeConversations.get(conversationId);
        if (!conversation || !conversation.generatedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }

        const document = conversation.generatedDocument;
        
        if (format === 'html') {
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Content-Disposition', `attachment; filename="${document.title.replace(/\s+/g, '_')}.html"`);
            res.send(document.htmlContent);
        } else if (format === 'txt') {
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', `attachment; filename="${document.title.replace(/\s+/g, '_')}.txt"`);
            res.send(document.textContent);
        } else {
            res.status(400).json({ error: 'Unsupported format' });
        }
    } catch (error) {
        console.error('Error downloading document:', error);
        res.status(500).json({ error: 'Failed to download document' });
    }
});

// Helper Functions

function generateInitialQuestions(documentType, businessInfo) {
    const questions = [
        {
            id: 'business_name',
            question: "What's your business name?",
            type: 'text',
            required: true
        },
        {
            id: 'industry',
            question: "What industry are you in?",
            type: 'select',
            options: Object.keys(industrySpecifics).map(key => ({
                value: key,
                label: industrySpecifics[key].name
            })),
            required: true
        },
        {
            id: 'team_size',
            question: "How many employees do you have?",
            type: 'select',
            options: [
                { value: '1-5', label: '1-5 employees' },
                { value: '6-15', label: '6-15 employees' },
                { value: '16-50', label: '16-50 employees' },
                { value: '51-100', label: '51-100 employees' },
                { value: '100+', label: 'More than 100 employees' }
            ],
            required: true
        }
    ];

    // Add document-specific questions
    if (documentType === 'employee-handbook') {
        questions.push(
            {
                id: 'current_challenges',
                question: "What are your biggest challenges with managing your team?",
                type: 'textarea',
                placeholder: "e.g., High turnover, unclear expectations, communication issues..."
            },
            {
                id: 'company_values',
                question: "What are your core company values? (Optional)",
                type: 'textarea',
                placeholder: "e.g., Excellent customer service, teamwork, integrity..."
            }
        );
    } else if (documentType === 'training-program') {
        questions.push(
            {
                id: 'training_role',
                question: "What role/position is this training for?",
                type: 'text',
                required: true
            },
            {
                id: 'key_skills',
                question: "What are the most important skills for this role?",
                type: 'textarea',
                placeholder: "e.g., Customer service, cash handling, product knowledge..."
            }
        );
    }

    return questions;
}

function identifyMissingInformation(conversation) {
    const missingInfo = [];
    const collected = conversation.collectedInfo;
    
    // Check for required basic info
    if (!collected.business_name || !collected.industry || !collected.team_size) {
        return []; // Return to basic questions
    }

    // Industry-specific follow-up questions
    const industry = industrySpecifics[collected.industry];
    if (industry && !collected.specific_regulations) {
        missingInfo.push({
            id: 'specific_regulations',
            question: `Are there any specific regulations or requirements I should include for ${industry.name}?`,
            type: 'textarea',
            placeholder: `e.g., ${industry.regulations.slice(0, 2).join(', ')}...`
        });
    }

    if (!collected.existing_policies) {
        missingInfo.push({
            id: 'existing_policies',
            question: "Do you have any existing policies or procedures I should incorporate?",
            type: 'textarea',
            placeholder: "Describe any current policies you want to keep or modify..."
        });
    }

    return missingInfo;
}

function generateDocument(conversation) {
    // Simulate document generation
    setTimeout(() => {
        const info = conversation.collectedInfo;
        const template = conversation.template;
        
        const document = {
            title: `${info.business_name} - ${template.name}`,
            sections: generateDocumentSections(conversation),
            createdAt: new Date().toISOString(),
            businessInfo: info
        };

        // Generate HTML content
        document.htmlContent = generateHtmlDocument(document);
        document.textContent = generateTextDocument(document);

        conversation.generatedDocument = document;
        conversation.currentStep = 'document_ready';
        activeConversations.set(conversation.id, conversation);
        
        console.log(`Document generated for conversation ${conversation.id}`);
    }, 2000);
}

function generateImprovedDocument(conversation) {
    // Simulate improved document generation
    setTimeout(() => {
        const originalDoc = conversation.originalDocument;
        const analysis = originalDoc.analysis;
        const improvementGoals = conversation.collectedInfo.improvement_goals || '';
        
        const document = {
            title: `${originalDoc.filename} - Improved Version`,
            originalFilename: originalDoc.filename,
            improvements: [],
            sections: generateImprovedSections(originalDoc, analysis, improvementGoals),
            createdAt: new Date().toISOString(),
            analysisResults: analysis
        };

        // Track what improvements were made
        document.improvements = [
            'Updated formatting and structure',
            'Added missing policy sections',
            'Enhanced legal compliance language',
            'Improved readability and clarity',
            'Added industry-specific best practices'
        ];

        // Generate HTML content
        document.htmlContent = generateImprovedHtmlDocument(document);
        document.textContent = generateImprovedTextDocument(document);

        conversation.generatedDocument = document;
        conversation.currentStep = 'document_ready';
        activeConversations.set(conversation.id, conversation);
        
        console.log(`Improved document generated for conversation ${conversation.id}`);
    }, 2000);
}

function generateImprovedSections(originalDoc, analysis, improvementGoals) {
    const sections = [];
    
    // Start with the original content but improved
    sections.push({
        title: 'Document Summary',
        content: `This is an improved version of your original ${originalDoc.filename}. The original document had ${analysis.wordCount} words and ${analysis.sections.length} main sections.`
    });

    // Add improvements based on gaps
    if (analysis.gaps.includes('Missing equal opportunity policies')) {
        sections.push({
            title: 'Equal Opportunity Employment',
            content: 'We are an equal opportunity employer committed to creating an inclusive environment for all employees. We do not discriminate based on race, religion, color, national origin, gender, sexual orientation, age, marital status, veteran status, or disability status.'
        });
    }

    if (analysis.gaps.includes('Missing safety policies')) {
        sections.push({
            title: 'Workplace Safety',
            content: 'The safety of our employees and customers is our top priority. All employees must follow safety protocols, report hazards immediately, and participate in safety training programs. Emergency procedures are posted throughout the workplace.'
        });
    }

    if (analysis.gaps.includes('Missing attendance policies')) {
        sections.push({
            title: 'Attendance and Punctuality',
            content: 'Regular attendance and punctuality are essential for business operations. Employees are expected to arrive on time and ready to work. Excessive absences or tardiness may result in disciplinary action.'
        });
    }

    if (analysis.gaps.includes('Missing dress code policies')) {
        sections.push({
            title: 'Dress Code and Appearance',
            content: 'Employees are expected to maintain a professional appearance appropriate for their role and our business environment. Specific dress code requirements will be provided during orientation.'
        });
    }

    // Add performance section if missing
    if (analysis.gaps.includes('Missing performance policies')) {
        sections.push({
            title: 'Performance Standards and Reviews',
            content: 'We believe in supporting employee growth through regular feedback and performance reviews. Performance expectations will be clearly communicated, and employees will receive ongoing coaching and development opportunities.'
        });
    }

    // Add improved original content
    sections.push({
        title: 'Enhanced Original Content',
        content: 'The following sections have been updated and improved from your original document:\n\n' + 
                 originalDoc.content.substring(0, 500) + '...\n\n' +
                 '[Content has been reformatted and enhanced for clarity and compliance]'
    });

    // Add implementation guide
    sections.push({
        title: 'Implementation Guidelines',
        content: 'To successfully implement this updated document:\n\n' +
                 '• Review all sections with your management team\n' +
                 '• Customize any sections to fit your specific needs\n' +
                 '• Have the document reviewed by legal counsel\n' +
                 '• Communicate changes to all employees\n' +
                 '• Provide training on new policies\n' +
                 '• Set a regular review schedule for updates'
    });

    return sections;
}

function generateDocumentSections(conversation) {
    const info = conversation.collectedInfo;
    const template = conversation.template;
    const industry = industrySpecifics[info.industry] || {};
    
    return template.sections.map(sectionName => {
        let content = '';
        
        switch (sectionName) {
            case 'Welcome Message':
                content = `Welcome to ${info.business_name}! We're excited to have you join our team. This handbook will guide you through our policies, procedures, and expectations to help you succeed in your role.`;
                break;
            case 'Company Overview':
                content = `${info.business_name} is a ${industry.name || 'business'} dedicated to providing excellent service to our customers. ${info.company_values ? `Our core values include: ${info.company_values}` : 'We believe in teamwork, excellence, and continuous improvement.'}`;
                break;
            case 'Employment Policies':
                content = generateEmploymentPolicies(info, industry);
                break;
            case 'Workplace Conduct':
                content = generateWorkplaceConduct(info, industry);
                break;
            case 'Safety and Security':
                content = generateSafetyPolicies(info, industry);
                break;
            default:
                content = `This section will be customized based on your specific needs and industry requirements.`;
        }
        
        return {
            title: sectionName,
            content: content
        };
    });
}

function generateEmploymentPolicies(info, industry) {
    let policies = `
## Equal Opportunity Employment
${info.business_name} is an equal opportunity employer committed to creating an inclusive environment for all employees.

## Work Schedule
Work schedules will be provided in advance and may vary based on business needs.`;

    if (info.team_size && parseInt(info.team_size.split('-')[0]) > 15) {
        policies += `

## Performance Reviews
Regular performance evaluations will be conducted to support your professional development.`;
    }

    return policies;
}

function generateWorkplaceConduct(info, industry) {
    let conduct = `
## Professional Behavior
All employees are expected to maintain professional conduct that reflects positively on ${info.business_name}.

## Communication
Clear, respectful communication is essential for our team's success.`;

    if (industry.commonChallenges) {
        conduct += `

## Industry-Specific Standards
Given our work in ${industry.name}, special attention should be paid to: ${industry.commonChallenges.slice(0, 2).join(', ')}.`;
    }

    return conduct;
}

function generateSafetyPolicies(info, industry) {
    let safety = `
## General Safety
The safety of our employees and customers is our top priority at ${info.business_name}.

## Emergency Procedures
All employees should be familiar with emergency exits and procedures.`;

    if (industry.regulations) {
        safety += `

## Regulatory Compliance
We must comply with all relevant regulations including: ${industry.regulations.slice(0, 2).join(', ')}.`;
    }

    return safety;
}

function generateHtmlDocument(document) {
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${document.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        h1 { color: #000; border-bottom: 3px solid #FFD700; padding-bottom: 10px; }
        h2 { color: #333; margin-top: 30px; }
        h3 { color: #666; }
        .header { text-align: center; margin-bottom: 40px; }
        .section { margin-bottom: 30px; padding: 20px; border-left: 4px solid #FFD700; background: #fafafa; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${document.title}</h1>
        <p>Generated on ${new Date(document.createdAt).toLocaleDateString()}</p>
    </div>`;

    document.sections.forEach(section => {
        html += `
    <div class="section">
        <h2>${section.title}</h2>
        <div>${section.content.replace(/\n/g, '<br>')}</div>
    </div>`;
    });

    html += `
    <div class="footer">
        <p>Document created with Ask April AI Co-Pilot</p>
        <p>This document should be reviewed by legal counsel before implementation</p>
    </div>
</body>
</html>`;

    return html;
}

function generateImprovedHtmlDocument(document) {
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${document.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        h1 { color: #000; border-bottom: 3px solid #FFD700; padding-bottom: 10px; }
        h2 { color: #333; margin-top: 30px; }
        h3 { color: #666; }
        .header { text-align: center; margin-bottom: 40px; }
        .section { margin-bottom: 30px; padding: 20px; border-left: 4px solid #FFD700; background: #fafafa; }
        .improvement-badge { background: #e8f5e8; color: #2d6e2d; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; margin-left: 10px; }
        .analysis-summary { background: #f0f8ff; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #b3d9ff; }
        .improvements-list { background: #fff9e6; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${document.title}</h1>
        <p>Generated on ${new Date(document.createdAt).toLocaleDateString()}</p>
        <span class="improvement-badge">AI-Improved Document</span>
    </div>
    
    <div class="analysis-summary">
        <h3>📋 Document Analysis Summary</h3>
        <p><strong>Original file:</strong> ${document.originalFilename}</p>
        <p><strong>Analysis results:</strong> Found ${document.analysisResults.strengths.length} strengths and ${document.analysisResults.gaps.length} areas for improvement</p>
        <div class="improvements-list">
            <h4>🔧 Key Improvements Made:</h4>
            <ul>`;
    
    document.improvements.forEach(improvement => {
        html += `<li>${improvement}</li>`;
    });
    
    html += `
            </ul>
        </div>
    </div>`;

    document.sections.forEach(section => {
        html += `
    <div class="section">
        <h2>${section.title}</h2>
        <div>${section.content.replace(/\n/g, '<br>')}</div>
    </div>`;
    });

    html += `
    <div class="footer">
        <p>Document improved with Ask April AI Co-Pilot</p>
        <p>This document should be reviewed by legal counsel before implementation</p>
    </div>
</body>
</html>`;

    return html;
}

function generateTextDocument(document) {
    let text = `${document.title}\n${'='.repeat(document.title.length)}\n\n`;
    text += `Generated on ${new Date(document.createdAt).toLocaleDateString()}\n\n`;
    
    document.sections.forEach(section => {
        text += `${section.title}\n${'-'.repeat(section.title.length)}\n`;
        text += `${section.content}\n\n`;
    });
    
    text += `\nDocument created with Ask April AI Co-Pilot\n`;
    text += `This document should be reviewed by legal counsel before implementation\n`;
    
    return text;
}

function generateImprovedTextDocument(document) {
    let text = `${document.title}\n${'='.repeat(document.title.length)}\n\n`;
    text += `Generated on ${new Date(document.createdAt).toLocaleDateString()}\n`;
    text += `AI-IMPROVED DOCUMENT\n\n`;
    
    text += `DOCUMENT ANALYSIS SUMMARY\n`;
    text += `${'='.repeat(25)}\n`;
    text += `Original file: ${document.originalFilename}\n`;
    text += `Analysis results: Found ${document.analysisResults.strengths.length} strengths and ${document.analysisResults.gaps.length} areas for improvement\n\n`;
    
    text += `KEY IMPROVEMENTS MADE:\n`;
    document.improvements.forEach((improvement, index) => {
        text += `${index + 1}. ${improvement}\n`;
    });
    text += `\n`;
    
    document.sections.forEach(section => {
        text += `${section.title}\n${'-'.repeat(section.title.length)}\n`;
        text += `${section.content}\n\n`;
    });
    
    text += `\nDocument improved with Ask April AI Co-Pilot\n`;
    text += `This document should be reviewed by legal counsel before implementation\n`;
    
    return text;
}

function calculateProgress(conversation) {
    if (conversation.currentStep === 'gathering_info') return 25;
    if (conversation.currentStep === 'generating_document') return 75;
    if (conversation.currentStep === 'document_ready') return 100;
    return 0;
}

function estimateTimeRemaining(conversation) {
    if (conversation.currentStep === 'gathering_info') return '5-10 minutes';
    if (conversation.currentStep === 'generating_document') return '2-3 minutes';
    return '0 minutes';
}

function analyzeExistingDocument(content, documentType) {
    const analysis = {
        wordCount: content.split(/\s+/).length,
        sections: [],
        strengths: [],
        gaps: [],
        readabilityScore: 'Good',
        complianceIssues: [],
        suggestions: []
    };

    // Basic content analysis
    const lines = content.split('\n').filter(line => line.trim());
    
    // Identify sections (headers)
    const headerRegex = /^(#{1,6}\s+|[A-Z\s]{3,}:?$|^\d+\.\s+[A-Z])/;
    analysis.sections = lines.filter(line => headerRegex.test(line)).slice(0, 10);

    // Check for common policy elements
    const policyKeywords = {
        'equal opportunity': /equal\s+opportunity|discrimination|harassment/i,
        'safety': /safety|emergency|accident|injury/i,
        'attendance': /attendance|punctuality|tardiness|absent/i,
        'dress code': /dress\s+code|uniform|appearance|attire/i,
        'performance': /performance|evaluation|review|goals/i,
        'benefits': /benefits|vacation|sick\s+leave|insurance/i,
        'discipline': /discipline|termination|corrective\s+action/i,
        'confidentiality': /confidential|privacy|proprietary|non-disclosure/i
    };

    analysis.strengths = [];
    analysis.gaps = [];

    Object.entries(policyKeywords).forEach(([topic, regex]) => {
        if (regex.test(content)) {
            analysis.strengths.push(`Contains ${topic} policies`);
        } else {
            analysis.gaps.push(`Missing ${topic} policies`);
        }
    });

    // Check document structure
    if (analysis.sections.length >= 5) {
        analysis.strengths.push('Well-structured with multiple sections');
    } else {
        analysis.gaps.push('Could benefit from better organization');
    }

    // Word count analysis
    if (analysis.wordCount > 2000) {
        analysis.strengths.push('Comprehensive content');
    } else if (analysis.wordCount < 500) {
        analysis.gaps.push('Document may be too brief');
    }

    // Industry-specific checks
    if (documentType === 'employee-handbook') {
        const requiredSections = ['welcome', 'policies', 'benefits', 'conduct', 'safety'];
        const missingSections = requiredSections.filter(section => 
            !content.toLowerCase().includes(section)
        );
        
        if (missingSections.length > 0) {
            analysis.gaps.push(`Missing sections: ${missingSections.join(', ')}`);
        }
    }

    return analysis;
}

function generateImprovementSuggestions(analysis) {
    const suggestions = [];

    // Based on gaps
    if (analysis.gaps.length > 0) {
        suggestions.push({
            category: 'Content Gaps',
            priority: 'High',
            items: analysis.gaps.slice(0, 3),
            description: 'These important topics should be added to make your document more comprehensive.'
        });
    }

    // Structure improvements
    if (analysis.sections.length < 5) {
        suggestions.push({
            category: 'Structure',
            priority: 'Medium',
            items: ['Add clear section headers', 'Organize content into logical sections', 'Include table of contents'],
            description: 'Better organization will make your document easier to navigate and understand.'
        });
    }

    // Compliance suggestions
    if (analysis.complianceIssues.length > 0) {
        suggestions.push({
            category: 'Legal Compliance',
            priority: 'High',
            items: analysis.complianceIssues,
            description: 'These updates will help ensure your document meets current legal requirements.'
        });
    }

    // General improvements
    suggestions.push({
        category: 'Enhancements',
        priority: 'Low',
        items: [
            'Update language for clarity',
            'Add industry-specific best practices',
            'Include implementation guidelines',
            'Add visual formatting improvements'
        ],
        description: 'These changes will make your document more professional and user-friendly.'
    });

    return suggestions;
}

// Start server
app.listen(port, () => {
    console.log(`AI Co-Pilot backend running on port ${port}`);
    console.log(`Available endpoints:`);
    console.log(`  POST /api/copilot/start - Start new document creation`);
    console.log(`  POST /api/copilot/continue - Continue conversation`);
    console.log(`  GET /api/copilot/status/:id - Check generation status`);
    console.log(`  GET /api/copilot/download/:id - Download document`);
});

module.exports = app;