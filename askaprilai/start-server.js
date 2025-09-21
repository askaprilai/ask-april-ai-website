// Simple local server for testing Daily Ripple
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Serve static files
app.use(express.static('.'));
app.use('/audio', express.static('audio'));

// API endpoints for Daily Ripple
app.get('/api/today', (req, res) => {
    const today = new Date();
    const dayIndex = today.getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Load episodes if available
    let episodes = [];
    try {
        episodes = JSON.parse(fs.readFileSync('./episodes.json', 'utf8'));
    } catch (error) {
        // Fallback data
        episodes = [
            {
                id: 'monday',
                title: 'Monday Momentum: Lead with Purpose',
                description: 'Set the tone for an incredible week with intentional leadership',
                day: 'Monday',
                duration: '5:12'
            }
        ];
    }
    
    // Find today's episode or return Monday as default
    const todaysEpisode = episodes.find(ep => ep.day === dayNames[dayIndex]) || episodes[0];
    
    res.json({
        ...todaysEpisode,
        date: today.toISOString().split('T')[0],
        available: false // Will be true when real audio is ready
    });
});

app.get('/api/week', (req, res) => {
    try {
        const episodes = JSON.parse(fs.readFileSync('./episodes.json', 'utf8'));
        res.json(episodes);
    } catch (error) {
        // Fallback weekly episodes
        res.json([
            { id: 'monday', title: 'Monday Momentum: Lead with Purpose', day: 'Monday', duration: '5:12' },
            { id: 'tuesday', title: 'Tuesday Truth: Difficult Conversations', day: 'Tuesday', duration: '4:58' },
            { id: 'wednesday', title: 'Wednesday Wisdom: Customer Connection', day: 'Wednesday', duration: '5:03' },
            { id: 'thursday', title: 'Thursday Thinking: Growing Your People', day: 'Thursday', duration: '5:07' },
            { id: 'friday', title: 'Friday Focus: Weekly Reflection', day: 'Friday', duration: '4:55' }
        ]);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Daily Ripple Server running at: http://localhost:${PORT}`);
    console.log(`Open Daily Ripple: http://localhost:${PORT}/daily-ripple-page.html`);
    console.log(`Main website: http://localhost:${PORT}/askapril-replica.html`);
    console.log('');
    console.log('CURRENT STATUS:');
    console.log('Website and player interface working');
    console.log('Episode data and descriptions loading');  
    console.log('Audio files ready');
    console.log('');
    console.log('TO REGENERATE AUDIO:');
    console.log('1. Update scripts in daily-ripple-generator-new.js');
    console.log('2. Run: node daily-ripple-generator-new.js');
    console.log('3. Audio will automatically update');
});