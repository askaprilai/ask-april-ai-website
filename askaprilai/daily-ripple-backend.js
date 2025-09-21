// Daily Ripple Backend API
// Connects ElevenLabs generation to website

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const DailyRippleSystem = require('./daily-ripple-generator');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/audio', express.static('audio')); // Serve audio files

// Initialize Daily Ripple System
const rippleSystem = new DailyRippleSystem();

// API Routes

// Get today's episode
app.get('/api/today', async (req, res) => {
  try {
    const today = new Date();
    const dayIndex = today.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    const todaysEpisode = {
      id: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
      day: dayNames[dayIndex],
      date: today.toISOString().split('T')[0],
      title: getTodaysTitle(dayIndex),
      description: getTodaysDescription(dayIndex),
      audioUrl: `/audio/daily-${dayNames[dayIndex]}.mp3`,
      duration: '5:12',
      published: true
    };

    res.json(todaysEpisode);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get today\'s episode' });
  }
});

// Get weekly episodes
app.get('/api/week', async (req, res) => {
  try {
    const weekEpisodes = getWeeklyEpisodes();
    res.json(weekEpisodes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get weekly episodes' });
  }
});

// Generate new episode
app.post('/api/generate', async (req, res) => {
  try {
    const { script, title, day } = req.body;
    
    const audioPath = await rippleSystem.generateAudio(script, `daily-${day.toLowerCase()}`);
    
    const episode = {
      id: Date.now().toString(),
      title: title,
      day: day,
      audioUrl: audioPath.replace('./audio', '/audio'),
      duration: '5:00',
      generated: new Date().toISOString()
    };

    res.json(episode);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate episode', details: error.message });
  }
});

// Generate full week
app.post('/api/generate-week', async (req, res) => {
  try {
    console.log('Generating weekly content...');
    const episodes = await rippleSystem.generateWeek();
    
    // Save episode metadata
    const episodeData = episodes.map(ep => ({
      id: ep.day.toLowerCase(),
      title: ep.title,
      day: ep.day,
      audioUrl: ep.audioPath ? ep.audioPath.replace('./audio', '/audio') : null,
      duration: ep.duration || '5:00',
      generated: new Date().toISOString(),
      error: ep.error || null
    }));

    // Save to episodes.json
    fs.writeFileSync('./episodes.json', JSON.stringify(episodeData, null, 2));
    
    res.json({
      success: true,
      episodes: episodeData,
      generated: episodeData.filter(ep => !ep.error).length,
      errors: episodeData.filter(ep => ep.error).length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate weekly content', details: error.message });
  }
});

// Get episode library
app.get('/api/library', async (req, res) => {
  try {
    const { search, topic, limit = 20, offset = 0 } = req.query;
    
    // Load episodes from file or database
    const allEpisodes = loadEpisodeLibrary();
    
    let filteredEpisodes = allEpisodes;
    
    if (search) {
      filteredEpisodes = filteredEpisodes.filter(ep => 
        ep.title.toLowerCase().includes(search.toLowerCase()) ||
        ep.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (topic && topic !== 'all') {
      filteredEpisodes = filteredEpisodes.filter(ep => ep.topic === topic);
    }
    
    const paginatedEpisodes = filteredEpisodes.slice(offset, offset + parseInt(limit));
    
    res.json({
      episodes: paginatedEpisodes,
      total: filteredEpisodes.length,
      hasMore: offset + parseInt(limit) < filteredEpisodes.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get episode library' });
  }
});

// User progress tracking
app.post('/api/track', async (req, res) => {
  try {
    const { userId, episodeId, action, progress } = req.body;
    
    // In production, save to database
    // For now, just log the tracking data
    console.log('Tracking:', { userId, episodeId, action, progress, timestamp: new Date() });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track progress' });
  }
});

// Community features
app.get('/api/discussions/:episodeId', async (req, res) => {
  try {
    const { episodeId } = req.params;
    
    // Mock discussion data (replace with real database)
    const discussions = [
      {
        id: 1,
        user: 'Sarah M.',
        comment: 'The tip about connecting personally with team members really hit home. I tried it this morning and the energy shift was immediate!',
        timestamp: new Date().toISOString(),
        likes: 12
      },
      {
        id: 2,
        user: 'Mike R.',
        comment: 'Setting that one clear goal for the week - game changer. My team is already more focused.',
        timestamp: new Date().toISOString(),
        likes: 8
      }
    ];
    
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get discussions' });
  }
});

// RSS Feed for podcast platforms
app.get('/rss', (req, res) => {
  try {
    const rssContent = fs.readFileSync('./rss-feed.xml', 'utf8');
    res.set('Content-Type', 'application/rss+xml');
    res.send(rssContent);
  } catch (error) {
    res.status(500).send('RSS feed not available');
  }
});

// Helper functions
function getTodaysTitle(dayIndex) {
  const titles = [
    'Sunday Reflection: Week Ahead Preparation',
    'Monday Momentum: Lead with Purpose', 
    'Tuesday Truth: Difficult Conversations',
    'Wednesday Wisdom: Customer Connection',
    'Thursday Thinking: Growing Your People',
    'Friday Focus: Weekly Reflection',
    'Saturday Strategy: Planning for Success'
  ];
  return titles[dayIndex];
}

function getTodaysDescription(dayIndex) {
  const descriptions = [
    'Prepare for the week ahead with intention and purpose',
    'Set the tone for an incredible week with intentional leadership',
    'Master the conversations you\'ve been avoiding',
    'Create magical moments that turn customers into advocates', 
    'Develop the people who make your business possible',
    'Reflect on wins and prepare for the week ahead',
    'Strategic planning for leadership success'
  ];
  return descriptions[dayIndex];
}

function getWeeklyEpisodes() {
  // Try to load from episodes.json, fallback to defaults
  try {
    const episodes = JSON.parse(fs.readFileSync('./episodes.json', 'utf8'));
    return episodes;
  } catch (error) {
    // Return default week structure
    return [
      { id: 'monday', title: 'Monday Momentum: Lead with Purpose', day: 'Monday', duration: '5:12' },
      { id: 'tuesday', title: 'Tuesday Truth: Difficult Conversations', day: 'Tuesday', duration: '4:58' },
      { id: 'wednesday', title: 'Wednesday Wisdom: Customer Connection', day: 'Wednesday', duration: '5:03' },
      { id: 'thursday', title: 'Thursday Thinking: Growing Your People', day: 'Thursday', duration: '5:07' },
      { id: 'friday', title: 'Friday Focus: Weekly Reflection', day: 'Friday', duration: '4:55' }
    ];
  }
}

function loadEpisodeLibrary() {
  // Mock library data (replace with real database)
  return [
    {
      id: 'ep-203',
      title: 'How to Handle Underperforming Employees',
      description: 'Practical strategies for difficult performance conversations',
      topic: 'Leadership',
      duration: '5:15',
      audioUrl: '/audio/ep-203.mp3'
    },
    {
      id: 'ep-198', 
      title: 'Turning Complaints into Compliments',
      description: 'Transform customer complaints into loyalty opportunities',
      topic: 'Customer Service',
      duration: '4:58',
      audioUrl: '/audio/ep-198.mp3'
    }
    // Add more episodes as needed
  ];
}

// Start server
app.listen(PORT, () => {
  console.log(`Daily Ripple API running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}/api/today`);
});

module.exports = app;