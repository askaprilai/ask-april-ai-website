// Daily Ripple Generator with new ElevenLabs SDK
require('dotenv').config();
const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
const fs = require('fs');
const path = require('path');

class DailyRippleGenerator {
    constructor() {
        this.elevenlabs = new ElevenLabsClient({
            apiKey: process.env.ELEVENLABS_API_KEY
        });
        this.voiceId = process.env.ELEVENLABS_VOICE_ID;
        this.audioDir = './audio';
        this.ensureAudioDir();
    }

    ensureAudioDir() {
        if (!fs.existsSync(this.audioDir)) {
            fs.mkdirSync(this.audioDir, { recursive: true });
        }
    }

    getWeeklyScripts() {
        return [
            {
                id: 'monday',
                title: 'Monday Momentum: Lead with Purpose',
                description: 'Set the tone for an incredible week with intentional leadership',
                day: 'Monday',
                duration: '5:12',
                filename: 'monday-momentum.mp3',
                script: `Good morning, leaders! It's Monday, and I'm April with your Daily Ripple. Today, we're talking about leading with purpose.

Your energy as a leader sets the tone for everything. When you walk in with intention and excitement, your team feels it immediately. But here's what most leaders get wrong - they think Monday momentum is about pushing harder. It's not. It's about pulling people toward a shared vision.

Here's your Monday action plan: First, take the first 30 minutes of your day to connect with your team members individually. Not about work - ask how their weekend was, and really listen. This isn't small talk; it's leadership intelligence.

Second, set one clear, achievable goal for the week that everyone can rally around. Make it specific, make it meaningful, and make sure everyone knows their part in achieving it.

Third, share your energy intentionally. Your excitement about the possibilities this week holds is contagious. If you're not excited about what you're building together, why should they be?

Remember, great leaders don't just manage Monday - they make Monday matter. You've got this. Until tomorrow, keep creating positive ripples.`
            },
            {
                id: 'tuesday',
                title: 'Tuesday Truth: Difficult Conversations',
                description: 'Master the conversations you\'ve been avoiding',
                day: 'Tuesday',
                duration: '4:58',
                filename: 'tuesday-truth.mp3',
                script: `Welcome back to your Daily Ripple. It's Tuesday, and I'm April. Today we're tackling something every leader faces but few master - the difficult conversations you've been avoiding.

Here's the truth: that conversation you've been putting off is already happening. Your team member knows there's an issue. Your customer senses something's wrong. The only question is whether you're going to guide that conversation or let it guide you.

The secret to difficult conversations isn't making them easier - it's making them shorter and more effective. Here's how: Start with care, not criticism. "I've noticed something, and I care about your success too much to let it slide." That immediately changes the dynamic.

Second, focus on behavior, not character. Instead of "You're always late," try "I've noticed you've been arriving after our team huddles. Help me understand what's happening." You're solving a problem together, not attacking a person.

Finally, end with agreement on next steps. Never leave a difficult conversation hanging. "So we're both committed to X by Y date. How does that sound to you?"

The conversations you avoid today become the crises you manage tomorrow. Address it now, address it with care, and watch how much stronger your relationships become. Until tomorrow, keep creating positive ripples.`
            },
            {
                id: 'wednesday',
                title: 'Wednesday Wisdom: Customer Connection',
                description: 'Create magical moments that turn customers into advocates',
                day: 'Wednesday',
                duration: '5:03',
                filename: 'wednesday-wisdom.mp3',
                script: `It's Wednesday, and you're halfway through the week! I'm April, and this is your Daily Ripple about what really drives customer loyalty - creating those magical moments that turn buyers into believers.

Here's what most businesses get wrong: they think customer service is about solving problems. But extraordinary customer experience is about creating positive surprises. It's the difference between meeting expectations and exceeding dreams.

Let me give you three ways to create magic today: First, anticipate needs before they're expressed. When a customer mentions they're planning an event, follow up with relevant suggestions. When someone's frustrated, offer solutions they didn't even know existed.

Second, personalize the unexpected. Remember names, preferences, and previous conversations. But go deeper - remember their goals, their challenges, and their wins. Make every interaction feel like a continuation of an ongoing relationship, not a transaction.

Third, empower your team to say yes. Give every team member the authority to make small gestures that create big impressions. A complimentary upgrade, a handwritten note, or simply staying late to solve a problem - these moments become the stories customers tell their friends.

Your customers don't just buy your product - they buy into your promise of how their life will be better. Make that promise irresistible. Until tomorrow, keep creating positive ripples.`
            },
            {
                id: 'thursday',
                title: 'Thursday Thinking: Growing Your People',
                description: 'Develop the people who make your business possible',
                day: 'Thursday',
                duration: '5:07',
                filename: 'thursday-thinking.mp3',
                script: `Thursday greetings, leaders! I'm April, and your Daily Ripple today is all about the most important part of your job - developing the people who make your business possible.

Here's a hard truth: your success is limited by your team's growth. If you're not actively developing your people, you're not leading - you're just managing. And management maintains the status quo while leadership creates the future.

The best leaders I know follow a simple principle: they see potential before people see it in themselves. They're talent scouts, mentors, and cheerleaders all rolled into one. But here's the key - development isn't about sending people to training once a year. It's about daily investments in their growth.

Start with this: identify one skill each team member wants to develop, and create a plan to help them get there. Maybe it's public speaking, maybe it's technical expertise, maybe it's leadership itself. Match them with mentors, give them stretch assignments, and celebrate their progress publicly.

Second, delegate with development in mind. Don't just hand off tasks - hand off opportunities. Give people projects that slightly stretch their abilities. Yes, it might take longer initially, but you're building capability for the future.

Finally, have career conversations regularly. Ask your people where they want to be in two years, and work backward to create a path. Even if their ultimate goal takes them beyond your team, invest in their journey. Great leaders create other leaders.

Your legacy isn't what you accomplish - it's who you develop along the way. Until tomorrow, keep creating positive ripples.`
            },
            {
                id: 'friday',
                title: 'Friday Focus: Weekly Reflection',
                description: 'Reflect on wins and prepare for the week ahead',
                day: 'Friday',
                duration: '4:55',
                filename: 'friday-focus.mp3',
                script: `Happy Friday, leaders! I'm April, and it's time for your Daily Ripple reflection on the week that was and preparation for the week ahead.

Before you rush into weekend mode, take 15 minutes for the most important leadership practice: intentional reflection. This isn't just thinking about what happened - it's extracting the lessons that will make you stronger.

Start with wins. What went better than expected this week? Maybe a team member stepped up, maybe a process improvement paid off, maybe you handled a difficult situation with more grace than usual. Write these down. Wins are fuel for future success, but only if you consciously acknowledge them.

Next, examine your challenges. What didn't go as planned? But here's the key question - what would you do differently knowing what you know now? This isn't about regret; it's about wisdom. Every setback contains seeds of future success if you're willing to plant them.

Finally, look ahead with intention. What's your focus for next week? Not just what needs to get done, but who needs your attention, what relationships need nurturing, and what opportunities need your energy.

The best leaders don't just survive weeks - they learn from them. They extract every ounce of wisdom and carry it forward. As you head into your weekend, remember that rest isn't the absence of productivity - it's the foundation of it.

Recharge with purpose, reflect with gratitude, and return with renewed energy. Keep creating positive ripples, and I'll see you Monday for another week of leadership growth.`
            }
        ];
    }

    async generateEpisode(episode) {
        console.log(`Generating: ${episode.title}`);
        
        try {
            const audio = await this.elevenlabs.textToSpeech.convert(
                this.voiceId,
                {
                    text: episode.script,
                    modelId: 'eleven_multilingual_v2',
                    outputFormat: 'mp3_44100_128',
                }
            );

            // Convert audio stream to buffer
            const chunks = [];
            for await (const chunk of audio) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);
            
            // Save audio file
            const filepath = path.join(this.audioDir, episode.filename);
            fs.writeFileSync(filepath, buffer);
            
            console.log(`Generated: ${episode.filename}`);
            return true;
            
        } catch (error) {
            console.error(`Failed to generate ${episode.title}:`, error.message);
            return false;
        }
    }

    async generateWeek() {
        const episodes = this.getWeeklyScripts();
        console.log('Starting Daily Ripple generation...');
        console.log(`Using voice: ${this.voiceId}`);
        console.log('');

        let successful = 0;
        let failed = 0;

        for (const episode of episodes) {
            const success = await this.generateEpisode(episode);
            if (success) {
                successful++;
            } else {
                failed++;
            }
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('');
        console.log('GENERATION COMPLETE:');
        console.log(`Successful: ${successful}`);
        console.log(`Failed: ${failed}`);
        console.log('');

        if (successful > 0) {
            console.log('Generated audio files:');
            episodes.forEach(ep => {
                const filepath = path.join(this.audioDir, ep.filename);
                if (fs.existsSync(filepath)) {
                    const stats = fs.statSync(filepath);
                    console.log(`   ${ep.filename} (${Math.round(stats.size / 1024)}KB)`);
                }
            });
            console.log('');
            console.log('Your Daily Ripple is ready!');
            console.log('   Open: http://localhost:3001/daily-ripple-page.html');
        }

        // Update episodes.json with availability
        this.updateEpisodesData(episodes);
    }

    updateEpisodesData(episodes) {
        const episodesData = episodes.map(ep => ({
            ...ep,
            audioUrl: `/audio/${ep.filename}`,
            available: fs.existsSync(path.join(this.audioDir, ep.filename))
        }));

        fs.writeFileSync('./episodes.json', JSON.stringify(episodesData, null, 2));
        console.log('Updated episodes.json');
    }

    async generateSingle(day) {
        const episodes = this.getWeeklyScripts();
        const episode = episodes.find(ep => ep.day.toLowerCase() === day.toLowerCase());
        
        if (!episode) {
            console.error(`Day "${day}" not found. Available: ${episodes.map(ep => ep.day).join(', ')}`);
            return;
        }

        console.log(`Generating single episode: ${episode.title}`);
        const success = await this.generateEpisode(episode);
        
        if (success) {
            this.updateEpisodesData(episodes);
            console.log('Single episode ready!');
            console.log('   Open: http://localhost:3001/daily-ripple-page.html');
        }
    }
}

// CLI handling
const args = process.argv.slice(2);
const generator = new DailyRippleGenerator();

if (args.includes('--test')) {
    console.log('Running test generation...');
    generator.generateSingle('Monday');
} else if (args.includes('--day')) {
    const dayIndex = args.indexOf('--day') + 1;
    const day = args[dayIndex];
    if (day) {
        generator.generateSingle(day);
    } else {
        console.error('Please specify a day: --day Monday');
    }
} else {
    generator.generateWeek();
}