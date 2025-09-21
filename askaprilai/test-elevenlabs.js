// Test ElevenLabs API and get your voice ID
require('dotenv').config();
const fetch = require('node-fetch');

const API_KEY = process.env.ELEVENLABS_API_KEY;

async function getVoices() {
  try {
    console.log('Fetching your ElevenLabs voices...');
    
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'xi-api-key': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('\\n🎤 Your Available Voices:');
    console.log('================================');
    
    data.voices.forEach((voice, index) => {
      console.log(`${index + 1}. ${voice.name}`);
      console.log(`   Voice ID: ${voice.voice_id}`);
      console.log(`   Category: ${voice.category}`);
      console.log(`   Description: ${voice.description || 'No description'}`);
      console.log('   ---');
    });

    // Find April's voice (look for custom/cloned voices)
    const customVoices = data.voices.filter(voice => 
      voice.category === 'cloned' || 
      voice.name.toLowerCase().includes('april') ||
      voice.category === 'professional'
    );

    if (customVoices.length > 0) {
      console.log('\\n🎯 Recommended Voice for Daily Ripple:');
      console.log(`Name: ${customVoices[0].name}`);
      console.log(`Voice ID: ${customVoices[0].voice_id}`);
      
      // Update .env file with the voice ID
      const fs = require('fs');
      let envContent = fs.readFileSync('.env', 'utf8');
      envContent = envContent.replace('your_voice_id_here', customVoices[0].voice_id);
      fs.writeFileSync('.env', envContent);
      
      console.log('✅ .env file updated with your voice ID!');
    }

  } catch (error) {
    console.error('Error fetching voices:', error.message);
  }
}

async function testVoiceGeneration(voiceId, testText = "Hello! This is a test of April's Daily Ripple. Welcome to your daily dose of leadership inspiration.") {
  try {
    console.log('\\n🎵 Testing voice generation...');
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY
      },
      body: JSON.stringify({
        text: testText,
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
      throw new Error(`Voice generation error: ${response.statusText}`);
    }

    const fs = require('fs');
    if (!fs.existsSync('./audio')) {
      fs.mkdirSync('./audio');
    }

    const audioBuffer = await response.buffer();
    fs.writeFileSync('./audio/test-daily-ripple.mp3', audioBuffer);
    
    console.log('✅ Test audio generated: ./audio/test-daily-ripple.mp3');
    console.log('🎧 Play this file to hear how your Daily Ripple will sound!');
    
  } catch (error) {
    console.error('Error generating test audio:', error.message);
  }
}

// Run the setup
async function setup() {
  console.log('🚀 Setting up April\'s Daily Ripple System...');
  console.log('================================================');
  
  await getVoices();
  
  // If we found a voice, test it
  const fs = require('fs');
  const envContent = fs.readFileSync('.env', 'utf8');
  const voiceIdMatch = envContent.match(/ELEVENLABS_VOICE_ID=(.+)/);
  
  if (voiceIdMatch && voiceIdMatch[1] !== 'your_voice_id_here') {
    await testVoiceGeneration(voiceIdMatch[1]);
    
    console.log('\\n🎉 Setup Complete!');
    console.log('Next steps:');
    console.log('1. Listen to the test audio file');
    console.log('2. Run: node daily-ripple-automation.js');
    console.log('3. Check the generated episodes in ./audio/');
  } else {
    console.log('\\n⚠️ Please select a voice ID from the list above and update your .env file');
  }
}

setup();