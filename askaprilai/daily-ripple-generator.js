// Complete Daily Ripple Generation System
require('dotenv').config();
const fs = require('fs');
const fetch = require('node-fetch');

class DailyRippleSystem {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    this.voiceId = process.env.ELEVENLABS_VOICE_ID;
    this.audioDir = './audio';
    this.ensureAudioDir();
  }

  ensureAudioDir() {
    if (!fs.existsSync(this.audioDir)) {
      fs.mkdirSync(this.audioDir, { recursive: true });
    }
  }

  // Generate a week's worth of Daily Ripple content
  async generateWeek() {
    const scripts = this.getWeeklyScripts();
    const results = [];

    console.log('🎙️ Generating April\'s Daily Ripple - Week Content');
    console.log('================================================\\n');

    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];
      console.log(`Generating ${script.day}: ${script.title}...`);
      
      try {
        const audioPath = await this.generateAudio(script.content, `day-${i + 1}-${script.day.toLowerCase()}`);
        results.push({
          day: script.day,
          title: script.title,
          audioPath: audioPath,
          script: script.content,
          duration: '5:00'
        });
        console.log(`✅ Generated: ${script.day}`);
        
        // Small delay to respect API limits
        await this.delay(2000);
        
      } catch (error) {
        console.error(`❌ Error generating ${script.day}:`, error.message);
        results.push({
          day: script.day,
          title: script.title,
          error: error.message
        });
      }
    }

    // Generate RSS feed
    this.generateRSSFeed(results);
    
    console.log('\\n🎉 Daily Ripple generation complete!');
    console.log(`Generated ${results.filter(r => !r.error).length} episodes`);
    
    return results;
  }

  async generateAudio(text, filename) {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }

    const audioBuffer = await response.buffer();
    const audioPath = `${this.audioDir}/${filename}.mp3`;
    fs.writeFileSync(audioPath, audioBuffer);
    
    return audioPath;
  }

  getWeeklyScripts() {
    return [
      {
        day: 'Monday',
        title: 'Monday Momentum: Lead with Purpose',
        content: `Good morning, leaders! It's Monday, and I'm April with your Daily Ripple. Today, we're talking about leading with purpose.

Your energy as a leader sets the tone for everything. When you walk in with intention and excitement, your team feels it immediately. But here's what most managers miss - purpose isn't just about big goals. It's about the small moments that matter.

Point one: Start your Monday by connecting with each team member personally. Not about work - about them. Ask about their weekend, their kids, their interests. This isn't small talk - it's foundation building. When people feel seen as humans, they perform as champions.

Point two: Set one clear, achievable goal for the week that everyone can rally around. Make it specific, make it measurable, and make it meaningful. Instead of "increase sales," try "help every customer leave feeling valued." Your team needs something to work toward together.

Point three: Share your why. Tell your team why this week matters, why their work matters, why they matter. People don't follow managers - they follow mission. Give them something bigger than a paycheck to work for.

Here's your action step: Before 10 AM today, write down three things you're grateful for about your team and share one with each team member. Gratitude creates motivation like nothing else.

Remember, great leaders don't just manage Monday - they make Monday matter. You've got this. Until tomorrow, keep creating positive ripples.`
      },
      {
        day: 'Tuesday',
        title: 'Tuesday Truth: The Conversations You\'re Avoiding',
        content: `Welcome back to your Daily Ripple. It's Tuesday, and I'm April. Today we're tackling something every leader faces but few master - the difficult conversations you've been avoiding.

That performance issue you noticed last week? That attitude problem that's affecting the whole team? That process that isn't working but everyone's afraid to mention? The conversation you're avoiding is usually the one your business needs most.

Point one: Start with curiosity, not accusation. Instead of "You're always late," try "I've noticed you've been arriving after your scheduled time. Help me understand what's happening." This approach opens doors instead of building walls. People defend against attacks but they respond to genuine interest.

Point two: Focus on impact, not intent. Don't guess why someone is behaving a certain way. Instead, describe what you're observing and how it affects the team or customers. "When tasks aren't completed on time, it puts pressure on everyone else and can impact our customer service." This removes emotion and focuses on facts.

Point three: Give them ownership of the solution. Ask "What do you think would help you succeed here?" or "How do you think we should handle this moving forward?" People support what they help create. When they're part of building the solution, they're invested in making it work.

Here's your action step: Identify one conversation you've been putting off and schedule it for this week. Write down three questions you'll ask instead of three things you'll tell them. Remember - clarity is kindness.

Difficult conversations are like going to the gym - nobody loves them, but everyone benefits from them. Create that ripple of accountability today.`
      },
      {
        day: 'Wednesday',
        title: 'Wednesday Wisdom: Creating Customer Magic',
        content: `It's Wednesday, and you're halfway through the week! I'm April, and this is your Daily Ripple about what really drives customer loyalty - creating those magical moments that turn customers into advocates.

Here's what most businesses get wrong - they think customers buy products or services. But customers don't just buy what you sell - they buy how you make them feel. Your team doesn't just deliver products - they deliver experiences, emotions, and memories.

Point one: Train your team to notice the details that matter. The customer who seems stressed about a decision, the regular who's trying something new, the first-time visitor who looks overwhelmed. These are opportunities disguised as ordinary moments. When your team learns to read these signals, they can create personalized experiences that customers remember forever.

Point two: Empower your team to say yes. Give them permission and tools to solve problems on the spot. A refund, an upgrade, a small gift, extra attention - these cost you pennies but create loyalty worth hundreds. When customers see your team go above and beyond, they don't just come back - they bring friends.

Point three: Remember that recovery is more powerful than perfection. How you handle mistakes creates stronger loyalty than getting everything right the first time. A sincere apology, immediate action, and a little something extra turns frustrated customers into your biggest fans. They'll tell everyone about how you made it right.

Here's your action step: Challenge your team to create one genuine "wow" moment for a customer today. Not forced or scripted - something real and personal. Share these stories at your next team meeting. Success breeds success.

Every customer interaction is a chance to create a positive ripple that extends far beyond your doors. Make today count.`
      },
      {
        day: 'Thursday',
        title: 'Thursday Thinking: Growing Your People',
        content: `Thursday greetings, leaders! I'm April, and your Daily Ripple today is all about the most important part of your job - developing the people who make your business possible.

Here's the truth that separates good managers from great leaders: Your job isn't just to manage people - it's to grow people. Every day, ask yourself this question: Is each team member better today than they were last month? If the answer is no, you're missing your greatest opportunity.

Point one: Delegate growth, not just tasks. Don't just give someone a job - give them a challenge that stretches their skills. Instead of "Take inventory," try "Figure out a system to reduce our inventory errors by half." Instead of "Handle customer complaints," ask "Develop a process that turns complaints into compliments." You're not just getting work done - you're building capabilities.

Point two: Create learning moments from everyday situations. When something goes wrong, don't just fix it - use it as a teaching opportunity. When something goes right, help them understand why it worked. Turn your workplace into a classroom where every challenge becomes a chance to level up.

Point three: Catch people doing things right more than you catch them doing things wrong. For every correction you make, find three things to praise. Recognition creates motivation like nothing else. But make it specific - not just "good job" but "the way you handled that difficult customer showed real patience and problem-solving skills."

Here's your action step: Pick one team member today and identify their next growth opportunity. What skill could they develop? What challenge could stretch them? Have that development conversation this week. Show them you're invested in their future, not just their productivity.

When you develop your people, they develop your business. Keep planting those seeds of growth.`
      },
      {
        day: 'Friday',
        title: 'Friday Focus: Weekly Reflection and Forward Thinking',
        content: `Happy Friday, leaders! I'm April, and it's time for your Daily Ripple reflection on the week that was and preparation for the week ahead.

You made it through another week of leading, and that's not small - that's significant. Leadership is one of the hardest jobs in the world because you're responsible not just for results, but for the people who create those results. So first, acknowledge what you've accomplished.

Point one: Take 10 minutes to celebrate the wins, even the small ones. What went better this week than last week? Which team member showed improvement? What challenge did you handle better than before? Acknowledging progress creates momentum. Success builds on success, but only if you stop long enough to recognize it.

Point two: Learn from the challenges without dwelling on them. What would you do differently if you faced the same situation again? What systems need improvement? What conversations need to happen? Turn every setback into a setup for future success. The goal isn't to avoid all problems - it's to get better at solving them.

Point three: Plan one thing for next week that will make your team's job easier or more enjoyable. Maybe it's a process improvement, maybe it's a small celebration, maybe it's just taking time to listen. Great leaders are always thinking ahead - not just about what needs to be done, but about how to make doing it better for everyone involved.

Here's your action step: Before you leave today, thank three people specifically for something they did well this week. Be specific about the impact it had. Then, write down one thing you'll do differently next week to be an even better leader.

You made it through another week of leading. That takes courage, patience, and heart. Enjoy your weekend - you've earned it. I'll see you Monday for another Daily Ripple.`
      }
    ];
  }

  generateRSSFeed(episodes) {
    const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>April's Daily Ripple</title>
    <description>5-minute daily inspiration for retail and hospitality leaders</description>
    <language>en-us</language>
    <itunes:author>April Sabral</itunes:author>
    <itunes:category text="Business">
      <itunes:category text="Management"/>
    </itunes:category>
    <link>https://askaprilai.com/daily-ripple</link>
    <itunes:image href="https://askaprilai.com/podcast-artwork.jpg"/>
    
    ${episodes.filter(ep => !ep.error).map((episode, index) => `
    <item>
      <title>${episode.title}</title>
      <description>Daily leadership inspiration for retail and hospitality managers</description>
      <enclosure url="https://askaprilai.com/audio/${episode.audioPath.split('/').pop()}" 
                 length="0" type="audio/mpeg"/>
      <guid>daily-ripple-${Date.now()}-${index}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <itunes:duration>${episode.duration}</itunes:duration>
    </item>`).join('')}
    
  </channel>
</rss>`;

    fs.writeFileSync('./rss-feed.xml', rssContent);
    console.log('✅ RSS feed generated: ./rss-feed.xml');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Quick test function
async function quickTest() {
  const system = new DailyRippleSystem();
  
  try {
    console.log('🧪 Testing with single episode...');
    const testScript = "Hello! This is April with a quick test of the Daily Ripple system. Welcome to your daily dose of leadership inspiration.";
    
    const audioPath = await system.generateAudio(testScript, 'test-episode');
    console.log('✅ Test episode generated:', audioPath);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\\n💡 Troubleshooting tips:');
    console.log('1. Check your ElevenLabs API key in .env file');
    console.log('2. Verify your voice ID is correct');
    console.log('3. Make sure you have credits in your ElevenLabs account');
  }
}

// Export the system
module.exports = DailyRippleSystem;

// If run directly, do a quick test
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--test')) {
    quickTest();
  } else if (args.includes('--week')) {
    const system = new DailyRippleSystem();
    system.generateWeek();
  } else {
    console.log('Daily Ripple System Ready!');
    console.log('\\nCommands:');
    console.log('  node daily-ripple-generator.js --test   (Test single episode)');
    console.log('  node daily-ripple-generator.js --week   (Generate full week)');
  }
}