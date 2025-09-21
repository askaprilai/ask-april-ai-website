// Debug the voice response structure
require('dotenv').config();
const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');

const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY
});

async function debugVoices() {
    try {
        const voices = await elevenlabs.voices.getAll();
        
        console.log('Raw response structure:');
        console.log(JSON.stringify(voices, null, 2));
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

debugVoices();