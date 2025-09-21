-- Supabase Database Schema for Ask April AI
-- Run these commands in your Supabase SQL editor

-- Contact form submissions table
CREATE TABLE contact_submissions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    company text,
    industry text,
    subject text NOT NULL,
    message text NOT NULL,
    submitted_at timestamp with time zone DEFAULT now(),
    status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'spam')),
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Newsletter subscribers table
CREATE TABLE newsletter_subscribers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text UNIQUE NOT NULL,
    name text,
    subscribed_at timestamp with time zone DEFAULT now(),
    status text DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    source text DEFAULT 'website',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- User sessions for AI interactions (future use)
CREATE TABLE user_sessions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id text UNIQUE NOT NULL,
    email text,
    name text,
    conversation_data jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_activity timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous inserts (for contact forms)
CREATE POLICY "Enable insert for contact submissions" ON contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for newsletter subscribers" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for user sessions" ON user_sessions
    FOR INSERT WITH CHECK (true);

-- Create policies for authenticated users to read their own data
CREATE POLICY "Enable select for authenticated users" ON contact_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable select for authenticated users" ON newsletter_subscribers
    FOR SELECT USING (auth.role() = 'authenticated');

-- Indexes for performance
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_submitted_at ON contact_submissions(submitted_at DESC);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);

CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);

CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_email ON user_sessions(email);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE
    ON contact_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_subscribers_updated_at BEFORE UPDATE
    ON newsletter_subscribers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE
    ON user_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();