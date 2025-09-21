// Simple ElevenLabs API test
require('dotenv').config();
const fetch = require('node-fetch');

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

console.log('Testing API Key:', API_KEY ? 'Found' : 'Missing');
console.log('Voice ID:', VOICE_ID);

async function testAPI() {
  try {
    // Test 1: Get user info
    console.log('\n1. Testing API connection...');
    const userResponse = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: { 'xi-api-key': API_KEY }
    });
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ API Key valid!');
      console.log('User ID:', userData.xi_api_key);
    } else {
      console.log('❌ API Key invalid:', userResponse.status, userResponse.statusText);
      return;
    }

    // Test 2: Get voices
    console.log('\n2. Fetching voices...');
    const voicesResponse = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': API_KEY }
    });

    if (voicesResponse.ok) {
      const voicesData = await voicesResponse.json();
      console.log('✅ Found', voicesData.voices.length, 'voices');
      
      voicesData.voices.forEach(voice => {
        console.log(`- ${voice.name} (${voice.voice_id})`);
      });
      
      // Check if our voice ID exists
      const ourVoice = voicesData.voices.find(v => v.voice_id === VOICE_ID);
      if (ourVoice) {
        console.log('✅ Your voice found:', ourVoice.name);
        
        // Test 3: Generate short audio
        console.log('\n3. Generating test audio...');
        await generateTestAudio();
        
      } else {
        console.log('❌ Voice ID not found in your account');
      }
    } else {
      console.log('❌ Cannot fetch voices:', voicesResponse.status);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function generateTestAudio() {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY
      },
      body: JSON.stringify({
        text: "Hello! This is April's Daily Ripple test. Welcome to your daily dose of leadership inspiration.",
        model_id: 'eleven_monolingual_v1'
      })
    });

    if (response.ok) {
      const fs = require('fs');
      if (!fs.existsSync('./audio')) fs.mkdirSync('./audio');
      
      const audioBuffer = await response.buffer();
      fs.writeFileSync('./audio/test.mp3', audioBuffer);
      console.log('✅ Test audio created: ./audio/test.mp3');
    } else {
      console.log('❌ Audio generation failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Audio generation error:', error.message);
  }
}

testAPI();