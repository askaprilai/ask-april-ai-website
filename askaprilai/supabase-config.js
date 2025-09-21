// Supabase Configuration for Ask April AI
// This handles contact form submissions and user data

class SupabaseClient {
    constructor() {
        // These will need to be set in your Vercel environment variables
        this.supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
        this.supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key-here';
        this.apiUrl = `${this.supabaseUrl}/rest/v1`;
    }

    async submitContactForm(formData) {
        try {
            const response = await fetch(`${this.apiUrl}/contact_submissions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.supabaseKey,
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    company: formData.company || null,
                    industry: formData.industry || null,
                    subject: formData.subject,
                    message: formData.message,
                    submitted_at: new Date().toISOString(),
                    status: 'new'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Supabase submission error:', error);
            return { success: false, error: error.message };
        }
    }

    async subscribeToNewsletter(email, name = null) {
        try {
            const response = await fetch(`${this.apiUrl}/newsletter_subscribers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.supabaseKey,
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    email: email,
                    name: name,
                    subscribed_at: new Date().toISOString(),
                    status: 'active'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupabaseClient;
} else {
    window.SupabaseClient = SupabaseClient;
}