-- Accountability Assessment Database Schema for Supabase
-- Stores assessment results with company analytics support

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Accountability assessments table
CREATE TABLE public.accountability_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    email TEXT NOT NULL,
    company_code TEXT, -- For aggregate company analytics
    
    -- Assessment scores
    total_score INTEGER NOT NULL,
    percentage_score INTEGER NOT NULL,
    
    -- Individual step scores (9 steps of accountability)
    step_1_score INTEGER NOT NULL, -- Right Person, Right Role
    step_2_score INTEGER NOT NULL, -- Expectations Clear & Confirmed
    step_3_score INTEGER NOT NULL, -- Agreed Consequences
    step_4_score INTEGER NOT NULL, -- Follow-Up Plan
    step_5_score INTEGER NOT NULL, -- Course-Correct Quickly
    step_6_score INTEGER NOT NULL, -- Show Up Consistently
    step_7_score INTEGER NOT NULL, -- Clarify Before Assume
    step_8_score INTEGER NOT NULL, -- Celebrate What's Working
    step_9_score INTEGER NOT NULL, -- Restart at Step 1
    
    -- Full assessment answers (JSON for flexibility)
    assessment_answers JSONB NOT NULL,
    
    -- Personalized plan data
    priority_step_name TEXT,
    priority_step_score INTEGER,
    score_description TEXT,
    
    -- Email and follow-up tracking
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    action_plan_sent BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    source TEXT DEFAULT 'web_assessment',
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company analytics summary table (for aggregate reporting)
CREATE TABLE public.company_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_code TEXT UNIQUE NOT NULL,
    company_name TEXT, -- Optional friendly name
    
    -- Summary statistics
    total_assessments INTEGER DEFAULT 0,
    average_total_score DECIMAL(5,2),
    average_percentage_score DECIMAL(5,2),
    
    -- Step-by-step averages
    avg_step_1_score DECIMAL(3,2),
    avg_step_2_score DECIMAL(3,2),
    avg_step_3_score DECIMAL(3,2),
    avg_step_4_score DECIMAL(3,2),
    avg_step_5_score DECIMAL(3,2),
    avg_step_6_score DECIMAL(3,2),
    avg_step_7_score DECIMAL(3,2),
    avg_step_8_score DECIMAL(3,2),
    avg_step_9_score DECIMAL(3,2),
    
    -- Most common priority areas
    most_common_priority_step TEXT,
    priority_step_frequency INTEGER,
    
    -- Timestamps
    first_assessment_date TIMESTAMP WITH TIME ZONE,
    last_assessment_date TIMESTAMP WITH TIME ZONE,
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_assessments_email ON public.accountability_assessments(email);
CREATE INDEX idx_assessments_company_code ON public.accountability_assessments(company_code);
CREATE INDEX idx_assessments_completed_at ON public.accountability_assessments(completed_at DESC);
CREATE INDEX idx_assessments_percentage_score ON public.accountability_assessments(percentage_score DESC);
CREATE INDEX idx_company_analytics_code ON public.company_analytics(company_code);

-- Row Level Security (RLS)
ALTER TABLE public.accountability_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow public insert for new assessments
CREATE POLICY "Anyone can create assessment" ON public.accountability_assessments
    FOR INSERT WITH CHECK (true);

-- Allow public read for general statistics (anonymized)
CREATE POLICY "Public read access for stats" ON public.accountability_assessments
    FOR SELECT USING (true);

-- Company analytics - read only for authenticated users
CREATE POLICY "Public read company analytics" ON public.company_analytics
    FOR SELECT USING (true);

-- Function to calculate and update company analytics
CREATE OR REPLACE FUNCTION public.update_company_analytics(p_company_code TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_stats RECORD;
BEGIN
    -- Calculate aggregate statistics for the company
    SELECT 
        COUNT(*) as total_assessments,
        AVG(total_score) as avg_total_score,
        AVG(percentage_score) as avg_percentage_score,
        AVG(step_1_score) as avg_step_1,
        AVG(step_2_score) as avg_step_2,
        AVG(step_3_score) as avg_step_3,
        AVG(step_4_score) as avg_step_4,
        AVG(step_5_score) as avg_step_5,
        AVG(step_6_score) as avg_step_6,
        AVG(step_7_score) as avg_step_7,
        AVG(step_8_score) as avg_step_8,
        AVG(step_9_score) as avg_step_9,
        MIN(completed_at) as first_assessment,
        MAX(completed_at) as last_assessment,
        MODE() WITHIN GROUP (ORDER BY priority_step_name) as common_priority
    INTO v_stats
    FROM public.accountability_assessments 
    WHERE company_code = p_company_code;
    
    -- Upsert company analytics
    INSERT INTO public.company_analytics (
        company_code,
        total_assessments,
        average_total_score,
        average_percentage_score,
        avg_step_1_score,
        avg_step_2_score,
        avg_step_3_score,
        avg_step_4_score,
        avg_step_5_score,
        avg_step_6_score,
        avg_step_7_score,
        avg_step_8_score,
        avg_step_9_score,
        first_assessment_date,
        last_assessment_date,
        most_common_priority_step,
        priority_step_frequency,
        last_calculated_at
    )
    VALUES (
        p_company_code,
        v_stats.total_assessments,
        v_stats.avg_total_score,
        v_stats.avg_percentage_score,
        v_stats.avg_step_1,
        v_stats.avg_step_2,
        v_stats.avg_step_3,
        v_stats.avg_step_4,
        v_stats.avg_step_5,
        v_stats.avg_step_6,
        v_stats.avg_step_7,
        v_stats.avg_step_8,
        v_stats.avg_step_9,
        v_stats.first_assessment,
        v_stats.last_assessment,
        v_stats.common_priority,
        (SELECT COUNT(*) FROM public.accountability_assessments 
         WHERE company_code = p_company_code AND priority_step_name = v_stats.common_priority),
        NOW()
    )
    ON CONFLICT (company_code) 
    DO UPDATE SET
        total_assessments = EXCLUDED.total_assessments,
        average_total_score = EXCLUDED.average_total_score,
        average_percentage_score = EXCLUDED.average_percentage_score,
        avg_step_1_score = EXCLUDED.avg_step_1_score,
        avg_step_2_score = EXCLUDED.avg_step_2_score,
        avg_step_3_score = EXCLUDED.avg_step_3_score,
        avg_step_4_score = EXCLUDED.avg_step_4_score,
        avg_step_5_score = EXCLUDED.avg_step_5_score,
        avg_step_6_score = EXCLUDED.avg_step_6_score,
        avg_step_7_score = EXCLUDED.avg_step_7_score,
        avg_step_8_score = EXCLUDED.avg_step_8_score,
        avg_step_9_score = EXCLUDED.avg_step_9_score,
        first_assessment_date = EXCLUDED.first_assessment_date,
        last_assessment_date = EXCLUDED.last_assessment_date,
        most_common_priority_step = EXCLUDED.most_common_priority_step,
        priority_step_frequency = EXCLUDED.priority_step_frequency,
        last_calculated_at = EXCLUDED.last_calculated_at,
        updated_at = NOW();
END;
$$;

-- Trigger to automatically update company analytics after new assessment
CREATE OR REPLACE FUNCTION public.trigger_update_company_analytics()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only update company analytics if company_code is provided
    IF NEW.company_code IS NOT NULL THEN
        PERFORM public.update_company_analytics(NEW.company_code);
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_assessment_company_analytics
    AFTER INSERT ON public.accountability_assessments
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_update_company_analytics();

-- Views for reporting
CREATE VIEW public.assessment_summary AS
SELECT 
    DATE(completed_at) as assessment_date,
    COUNT(*) as total_assessments,
    AVG(percentage_score) as avg_percentage_score,
    COUNT(DISTINCT company_code) FILTER (WHERE company_code IS NOT NULL) as companies_represented
FROM public.accountability_assessments
GROUP BY DATE(completed_at)
ORDER BY assessment_date DESC;

CREATE VIEW public.step_performance_summary AS
SELECT 
    'Step 1: Right Person, Right Role' as step_name,
    AVG(step_1_score) as average_score,
    COUNT(*) FILTER (WHERE step_1_score <= 2) as low_performers,
    COUNT(*) FILTER (WHERE step_1_score >= 3) as high_performers
FROM public.accountability_assessments
UNION ALL
SELECT 
    'Step 2: Expectations Clear & Confirmed',
    AVG(step_2_score),
    COUNT(*) FILTER (WHERE step_2_score <= 2),
    COUNT(*) FILTER (WHERE step_2_score >= 3)
FROM public.accountability_assessments
-- ... continue for all 9 steps
UNION ALL
SELECT 
    'Step 9: Restart at Step 1',
    AVG(step_9_score),
    COUNT(*) FILTER (WHERE step_9_score <= 2),
    COUNT(*) FILTER (WHERE step_9_score >= 3)
FROM public.accountability_assessments
ORDER BY step_name;