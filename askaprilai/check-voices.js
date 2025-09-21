// Check available voices in your ElevenLabs account
require('dotenv').config();
const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');

const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY
});

async function checkVoices() {
    console.log('Checking available voices in your account...');
    
    try {
        const voices = await elevenlabs.voices.getAll();
        
        console.log(`Found ${voices.voices.length} voices:`);
        console.log('');
        
        voices.voices.forEach((voice, index) => {
            console.log(`${index + 1}. Name: ${voice.name}`);
            console.log(`   ID: ${voice.voice_id || voice.id}`);
            console.log(`   Category: ${voice.category}`);
            console.log(`   Description: ${voice.description || 'No description'}`);
            console.log('');
        });
        
        // Check if we can find April's voice
        const aprilVoice = voices.voices.find(v => 
            v.name.toLowerCase().includes('april') || 
            v.description?.toLowerCase().includes('april')
        );
        
        if (aprilVoice) {
            console.log('Found April voice:');
            console.log(`   Name: ${aprilVoice.name}`);
            console.log(`   ID: ${aprilVoice.voice_id || aprilVoice.id}`);
            console.log('');
            console.log('Update your .env file with this Voice ID:');
            console.log(`ELEVENLABS_VOICE_ID=${aprilVoice.voice_id || aprilVoice.id}`);
        } else {
            console.log('No voice with "april" in name found.');
            console.log('Choose a voice ID from the list above and update your .env file.');
        }
        
    } catch (error) {
        console.error('Error fetching voices:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
        }
    }
}

checkVoices();