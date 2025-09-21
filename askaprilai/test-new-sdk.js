// Test the new ElevenLabs SDK
require('dotenv').config();
const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
const fs = require('fs');

const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY
});

async function testNewSDK() {
    console.log('Testing new ElevenLabs SDK...');
    console.log('API Key:', process.env.ELEVENLABS_API_KEY ? 'Found' : 'Missing');
    console.log('Voice ID:', process.env.ELEVENLABS_VOICE_ID);

    try {
        // Test with your voice ID
        const audio = await elevenlabs.textToSpeech.convert(
            process.env.ELEVENLABS_VOICE_ID, // Your voice ID
            {
                text: "Hello! This is April's Daily Ripple test using the new SDK. Welcome to your daily dose of leadership inspiration!",
                modelId: 'eleven_multilingual_v2',
                outputFormat: 'mp3_44100_128',
            }
        );

        // Save the audio
        if (!fs.existsSync('./audio')) {
            fs.mkdirSync('./audio');
        }

        // Convert audio stream to buffer and save
        const chunks = [];
        for await (const chunk of audio) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        
        fs.writeFileSync('./audio/test-new-sdk.mp3', buffer);
        console.log('Success! Audio saved to: ./audio/test-new-sdk.mp3');
        
        return true;
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.status, error.response.statusText);
        }
        return false;
    }
}

testNewSDK();