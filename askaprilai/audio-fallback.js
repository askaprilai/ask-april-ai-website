// Temporary Audio Fallback System
// Creates sample episodes while ElevenLabs API is being fixed

const fs = require('fs');
const path = require('path');

class AudioFallback {
    constructor() {
        this.audioDir = './audio';
        this.ensureAudioDir();
    }

    ensureAudioDir() {
        if (!fs.existsSync(this.audioDir)) {
            fs.mkdirSync(this.audioDir, { recursive: true });
        }
    }

    // Create sample episode data for testing
    createSampleEpisodes() {
        const episodes = [
            {
                id: 'monday',
                title: 'Monday Momentum: Lead with Purpose',
                description: 'Set the tone for an incredible week with intentional leadership',
                day: 'Monday',
                duration: '5:12',
                script: `Good morning, leaders! It's Monday, and I'm April with your Daily Ripple. Today, we're talking about leading with purpose. Your energy as a leader sets the tone for everything. When you walk in with intention and excitement, your team feels it immediately...`,
                audioUrl: '/audio/monday-momentum.mp3',
                available: false // Will be true once audio is generated
            },
            {
                id: 'tuesday',
                title: 'Tuesday Truth: Difficult Conversations',
                description: 'Master the conversations you\'ve been avoiding',
                day: 'Tuesday',
                duration: '4:58',
                script: `Welcome back to your Daily Ripple. It's Tuesday, and I'm April. Today we're tackling something every leader faces but few master - the difficult conversations you've been avoiding...`,
                audioUrl: '/audio/tuesday-truth.mp3',
                available: false
            },
            {
                id: 'wednesday',
                title: 'Wednesday Wisdom: Customer Connection',
                description: 'Create magical moments that turn customers into advocates',
                day: 'Wednesday',
                duration: '5:03',
                script: `It's Wednesday, and you're halfway through the week! I'm April, and this is your Daily Ripple about what really drives customer loyalty - creating those magical moments...`,
                audioUrl: '/audio/wednesday-wisdom.mp3',
                available: false
            },
            {
                id: 'thursday',
                title: 'Thursday Thinking: Growing Your People',
                description: 'Develop the people who make your business possible',
                day: 'Thursday',
                duration: '5:07',
                script: `Thursday greetings, leaders! I'm April, and your Daily Ripple today is all about the most important part of your job - developing the people who make your business possible...`,
                audioUrl: '/audio/thursday-thinking.mp3',
                available: false
            },
            {
                id: 'friday',
                title: 'Friday Focus: Weekly Reflection',
                description: 'Reflect on wins and prepare for the week ahead',
                day: 'Friday',
                duration: '4:55',
                script: `Happy Friday, leaders! I'm April, and it's time for your Daily Ripple reflection on the week that was and preparation for the week ahead...`,
                audioUrl: '/audio/friday-focus.mp3',
                available: false
            }
        ];

        // Save episode data
        fs.writeFileSync('./episodes.json', JSON.stringify(episodes, null, 2));
        console.log('✅ Sample episodes created in episodes.json');
        
        return episodes;
    }

    // Create placeholder audio files (silent MP3s for testing)
    async createPlaceholderAudio() {
        const episodes = JSON.parse(fs.readFileSync('./episodes.json', 'utf8'));
        
        console.log('🎵 Creating placeholder audio files...');
        
        for (const episode of episodes) {
            const filename = path.basename(episode.audioUrl);
            const filepath = path.join(this.audioDir, filename);
            
            // Create a simple text file as placeholder
            // (In production, these would be actual MP3 files from ElevenLabs)
            const placeholder = `Placeholder for: ${episode.title}\nScript: ${episode.script.substring(0, 100)}...`;
            fs.writeFileSync(filepath.replace('.mp3', '.txt'), placeholder);
            
            console.log(`📝 Created placeholder: ${filename}`);
        }
        
        console.log('✅ Placeholder files created. Replace with actual MP3s from ElevenLabs.');
    }

    // Instructions for connecting real audio
    printInstructions() {
        console.log(`
🎯 HOW TO CONNECT REAL AUDIO:

1. FIX ELEVENLABS API KEY:
   - Check your ElevenLabs dashboard
   - Regenerate API key if needed
   - Verify voice ID: 1KtMKr5khbNAxBQoRs3X

2. GENERATE REAL AUDIO:
   node daily-ripple-generator.js --test
   
   If that works, then run:
   npm run generate

3. WEBSITE WILL AUTOMATICALLY USE:
   - ./audio/monday-momentum.mp3
   - ./audio/tuesday-truth.mp3
   - ./audio/wednesday-wisdom.mp3
   - ./audio/thursday-thinking.mp3
   - ./audio/friday-focus.mp3

4. START THE BACKEND:
   npm run dev
   
5. OPEN DAILY RIPPLE PAGE:
   Open daily-ripple-page.html in browser

🔧 TROUBLESHOOTING ELEVENLABS:
- Visit: https://elevenlabs.io/app/settings
- Copy new API key to .env file
- Ensure you have credits in your account
- Check voice ID is correct

💡 FOR NOW, THE WEBSITE SHOWS:
- Episode titles and descriptions
- Player interface (will say "audio not available")
- All community features work
- Ready for real audio when API is fixed
        `);
    }
}

// Run the fallback system
const fallback = new AudioFallback();
fallback.createSampleEpisodes();
fallback.createPlaceholderAudio();
fallback.printInstructions();