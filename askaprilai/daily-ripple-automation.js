// Daily Ripple Automation System
// Generates audio content using ElevenLabs API

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

class DailyRippleAutomation {
  constructor(elevenLabsApiKey, voiceId) {
    this.apiKey = elevenLabsApiKey;
    this.voiceId = voiceId; // Your cloned voice ID
    this.baseUrl = 'https://api.elevenlabs.io/v1';
  }

  // Generate audio from script using ElevenLabs
  async generateAudio(script, filename) {
    const url = `${this.baseUrl}/text-to-speech/${this.voiceId}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey
      },
      body: JSON.stringify({
        text: script,
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
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const audioBuffer = await response.buffer();
    fs.writeFileSync(`./audio/${filename}.mp3`, audioBuffer);
    
    console.log(`Audio generated: ${filename}.mp3`);
    return `./audio/${filename}.mp3`;
  }

  // Create full script from template
  createFullScript(template) {
    let script = template.intro + " ";
    
    template.keyPoints.forEach((point, index) => {
      script += `Point ${index + 1}: ${point} `;
    });
    
    script += `Here's your action step: ${template.actionStep} `;
    script += template.outro;
    
    return script;
  }

  // Generate a week's worth of content
  async generateWeeklyContent(templates) {
    const audioFiles = [];
    
    if (!fs.existsSync('./audio')) {
      fs.mkdirSync('./audio');
    }

    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      const script = this.createFullScript(template);
      const filename = `daily-ripple-${i + 1}-${template.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      
      try {
        const audioPath = await this.generateAudio(script, filename);
        audioFiles.push({
          title: template.title,
          audioPath: audioPath,
          script: script
        });
        
        // Wait 1 second between API calls to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error generating audio for ${template.title}:`, error);
      }
    }
    
    return audioFiles;
  }

  // Generate RSS feed for podcast distribution
  generateRSSFeed(episodes) {
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>April's Daily Ripple</title>
    <description>5-minute daily inspiration for retail and hospitality leaders</description>
    <language>en-us</language>
    <itunes:author>April Sabral</itunes:author>
    <itunes:category text="Business">
      <itunes:category text="Management"/>
    </itunes:category>
    <itunes:category text="Education">
      <itunes:category text="Self-Improvement"/>
    </itunes:category>
    <itunes:image href="https://your-domain.com/podcast-artwork.jpg"/>
    <link>https://askaprilai.com/daily-ripple</link>
    
    ${episodes.map((episode, index) => `
    <item>
      <title>${episode.title}</title>
      <description>Daily inspiration for leaders in retail and hospitality</description>
      <enclosure url="https://your-domain.com/audio/${path.basename(episode.audioPath)}" 
                 length="0" type="audio/mpeg"/>
      <guid>daily-ripple-${index + 1}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <itunes:duration>5:00</itunes:duration>
    </item>`).join('')}
    
  </channel>
</rss>`;

    fs.writeFileSync('./rss-feed.xml', rss);
    return rss;
  }
}

// Usage example
async function createDailyRipple() {
  // You'll need to add your actual ElevenLabs API key and voice ID
  const automation = new DailyRippleAutomation(
    'YOUR_ELEVENLABS_API_KEY', 
    'YOUR_VOICE_ID'
  );

  const { dailyRippleTemplates } = require('./daily-ripple-scripts.js');
  
  try {
    console.log('Generating weekly Daily Ripple content...');
    const episodes = await automation.generateWeeklyContent(dailyRippleTemplates);
    
    console.log('Creating RSS feed...');
    automation.generateRSSFeed(episodes);
    
    console.log('✅ Daily Ripple content generated successfully!');
    console.log(`Generated ${episodes.length} episodes`);
    
  } catch (error) {
    console.error('Error creating Daily Ripple content:', error);
  }
}

module.exports = DailyRippleAutomation;

// Uncomment to run
// createDailyRipple();