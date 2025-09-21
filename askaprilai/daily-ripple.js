// Daily Ripple Interactive Features
class DailyRipplePlayer {
    constructor() {
        this.currentAudio = null;
        this.isPlaying = false;
        this.currentEpisode = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTodaysEpisode();
        this.setupProgressTracking();
    }

    setupEventListeners() {
        // Play buttons
        document.querySelectorAll('.play-btn, .mini-play-btn, .play-button-large').forEach(btn => {
            btn.addEventListener('click', (e) => this.handlePlay(e));
        });

        // Save buttons
        document.querySelectorAll('.save-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSave(e));
        });

        // Share buttons
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleShare(e));
        });

        // Community links
        document.querySelectorAll('.community-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleCommunityAction(e));
        });
    }

    async handlePlay(e) {
        e.preventDefault();
        const button = e.target;
        const episodeCard = button.closest('.episode-card') || button.closest('.player-mockup');
        
        if (!episodeCard) return;

        // Get episode data
        const episodeData = this.getEpisodeData(episodeCard);
        
        if (this.isPlaying && this.currentEpisode === episodeData.id) {
            this.pause();
        } else {
            await this.play(episodeData);
        }
    }

    getEpisodeData(element) {
        const title = element.querySelector('h3, h4')?.textContent || 'Daily Ripple Episode';
        const description = element.querySelector('p')?.textContent || '';
        const duration = element.querySelector('.duration')?.textContent || '5:00';
        
        return {
            id: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            title: title,
            description: description,
            duration: duration,
            audioUrl: this.getAudioUrl(title) // You'll implement this based on your audio storage
        };
    }

    getAudioUrl(title) {
        // Map titles to actual filenames
        const titleMap = {
            'monday momentum: lead with purpose': 'monday-momentum.mp3',
            'tuesday truth: difficult conversations': 'tuesday-truth.mp3', 
            'wednesday wisdom: customer connection': 'wednesday-wisdom.mp3',
            'thursday thinking: growing your people': 'thursday-thinking.mp3',
            'friday focus: weekly reflection': 'friday-focus.mp3'
        };
        
        const key = title.toLowerCase();
        const filename = titleMap[key] || `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.mp3`;
        return `./audio/${filename}`;
    }

    async play(episodeData) {
        try {
            // Stop current audio if playing
            if (this.currentAudio) {
                this.currentAudio.pause();
            }

            // Create new audio element
            this.currentAudio = new Audio(episodeData.audioUrl);
            this.currentEpisode = episodeData.id;
            
            // Set up audio event listeners
            this.setupAudioListeners();
            
            // Update UI
            this.updatePlayButton(true);
            this.showNowPlaying(episodeData);
            this.startVisualizer();
            
            // Start playing
            await this.currentAudio.play();
            this.isPlaying = true;
            
            // Track analytics
            this.trackPlay(episodeData);
            
        } catch (error) {
            console.error('Error playing audio:', error);
            this.showUpgradeMessage();
        }
    }

    pause() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.isPlaying = false;
            this.updatePlayButton(false);
            this.pauseVisualizer();
        }
    }

    setupAudioListeners() {
        if (!this.currentAudio) return;

        this.currentAudio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updatePlayButton(false);
            this.pauseVisualizer();
            this.markAsCompleted();
        });

        this.currentAudio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.currentAudio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.showError('Audio not available yet. Coming soon!');
        });
    }

    updatePlayButton(isPlaying) {
        document.querySelectorAll('.play-btn, .mini-play-btn, .play-button-large').forEach(btn => {
            btn.textContent = isPlaying ? '⏸️' : '▶';
        });
    }

    showNowPlaying(episodeData) {
        // Create floating player if it doesn't exist
        let floatingPlayer = document.querySelector('.floating-player');
        if (!floatingPlayer) {
            floatingPlayer = this.createFloatingPlayer();
            document.body.appendChild(floatingPlayer);
        }

        // Update floating player content
        floatingPlayer.querySelector('.fp-title').textContent = episodeData.title;
        floatingPlayer.querySelector('.fp-duration').textContent = episodeData.duration;
        floatingPlayer.classList.add('active');
    }

    createFloatingPlayer() {
        const player = document.createElement('div');
        player.className = 'floating-player';
        player.innerHTML = `
            <div class="fp-content">
                <div class="fp-info">
                    <div class="fp-title">Episode Title</div>
                    <div class="fp-duration">0:00</div>
                </div>
                <div class="fp-controls">
                    <button class="fp-play">⏸️</button>
                    <button class="fp-close">✕</button>
                </div>
            </div>
            <div class="fp-progress">
                <div class="fp-progress-bar"></div>
            </div>
        `;

        // Add event listeners
        player.querySelector('.fp-play').addEventListener('click', () => {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.currentAudio?.play();
            }
        });

        player.querySelector('.fp-close').addEventListener('click', () => {
            this.pause();
            player.classList.remove('active');
        });

        return player;
    }

    updateProgress() {
        if (!this.currentAudio) return;

        const progress = (this.currentAudio.currentTime / this.currentAudio.duration) * 100;
        const progressBar = document.querySelector('.fp-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        // Update time display
        const currentTime = this.formatTime(this.currentAudio.currentTime);
        const duration = this.formatTime(this.currentAudio.duration);
        const durationDisplay = document.querySelector('.fp-duration');
        if (durationDisplay) {
            durationDisplay.textContent = `${currentTime} / ${duration}`;
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    handleSave(e) {
        e.preventDefault();
        const episodeCard = e.target.closest('.episode-card');
        const episodeData = this.getEpisodeData(episodeCard);
        
        // Save to localStorage for now (in production, save to user account)
        let savedEpisodes = JSON.parse(localStorage.getItem('savedRipples') || '[]');
        
        if (!savedEpisodes.find(ep => ep.id === episodeData.id)) {
            savedEpisodes.push(episodeData);
            localStorage.setItem('savedRipples', JSON.stringify(savedEpisodes));
            
            // Update UI
            e.target.textContent = '✅ Saved';
            e.target.style.background = '#28a745';
            e.target.style.color = '#fff';
            
            this.showToast('Episode saved to your library!');
        } else {
            this.showToast('Episode already in your library');
        }
    }

    handleShare(e) {
        e.preventDefault();
        const episodeCard = e.target.closest('.episode-card');
        const episodeData = this.getEpisodeData(episodeCard);
        
        if (navigator.share) {
            navigator.share({
                title: episodeData.title,
                text: `Check out this Daily Ripple: ${episodeData.description}`,
                url: window.location.href
            });
        } else {
            // Fallback to copy to clipboard
            const shareText = `${episodeData.title} - ${window.location.href}`;
            navigator.clipboard.writeText(shareText).then(() => {
                this.showToast('Link copied to clipboard!');
            });
        }
    }

    handleCommunityAction(e) {
        // Let the default link behavior handle navigation
        // Remove preventDefault to allow normal link navigation
        return true;
    }

    openDiscussion() {
        // Simulate opening a discussion modal
        this.showModal(`
            <h3>Today's Discussion</h3>
            <p>Share your thoughts on today's episode: "Monday Momentum: Lead with Purpose"</p>
            <textarea placeholder="What leadership insight resonated with you today?"></textarea>
            <div class="recent-comments">
                <div class="comment">
                    <strong>Sarah M.</strong>: "The tip about connecting personally with team members really hit home. I tried it this morning and the energy shift was immediate!"
                </div>
                <div class="comment">
                    <strong>Mike R.</strong>: "Setting that one clear goal for the week - game changer. My team is already more focused."
                </div>
            </div>
            <button class="btn-primary">Share Your Insight</button>
        `);
    }

    openWinSharing() {
        this.showModal(`
            <h3>Share Your Implementation Win</h3>
            <p>Tell the community how you applied today's Daily Ripple:</p>
            <textarea placeholder="I took April's advice and..."></textarea>
            <select>
                <option>Choose impact level</option>
                <option>Small but meaningful</option>
                <option>Significant change</option>
                <option>Game-changing result</option>
            </select>
            <button class="btn-primary">Share Your Win</button>
        `);
    }

    openLibrary() {
        this.showModal(`
            <h3>Episode Library</h3>
            <div class="library-search">
                <input type="search" placeholder="Search episodes...">
                <select>
                    <option>All Topics</option>
                    <option>Difficult Conversations</option>
                    <option>Team Development</option>
                    <option>Customer Service</option>
                    <option>Leadership Mindset</option>
                </select>
            </div>
            <div class="library-results">
                <div class="library-episode">
                    <span class="episode-topic">Leadership</span>
                    <h4>How to Handle Underperforming Employees</h4>
                    <p>Episode #203 • 5:15</p>
                </div>
                <div class="library-episode">
                    <span class="episode-topic">Customer Service</span>
                    <h4>Turning Complaints into Compliments</h4>
                    <p>Episode #198 • 4:58</p>
                </div>
            </div>
        `);
    }

    setupReminders() {
        this.showModal(`
            <h3>Daily Ripple Reminders</h3>
            <p>Never miss your daily dose of leadership inspiration:</p>
            <div class="reminder-options">
                <label>
                    <input type="checkbox" checked> Email notifications
                </label>
                <label>
                    <input type="checkbox"> Push notifications
                </label>
                <label>
                    <input type="checkbox"> SMS reminders
                </label>
            </div>
            <div class="reminder-time">
                <label>Remind me at: <input type="time" value="08:00"></label>
            </div>
            <button class="btn-primary">Save Preferences</button>
        `);
    }

    showModal(content) {
        // Remove existing modal
        const existingModal = document.querySelector('.ripple-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create new modal
        const modal = document.createElement('div');
        modal.className = 'ripple-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">✕</button>
                ${content}
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            modal.remove();
        });
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    showError(message) {
        this.showToast(message);
    }

    showUpgradeMessage() {
        this.showModal(`
            <div class="upgrade-prompt">
                <h3>🎙️ Daily Ripple Audio Coming Soon!</h3>
                <p>April's Daily Ripple episodes are currently being generated with her personal voice clone.</p>
                
                <div class="upgrade-benefits">
                    <h4>What you'll get:</h4>
                    <ul>
                        <li>✅ 5-minute daily leadership inspiration</li>
                        <li>✅ April's personal voice and insights</li>
                        <li>✅ New episodes every weekday</li>
                        <li>✅ Full episode archive</li>
                        <li>✅ Community discussions</li>
                    </ul>
                </div>
                
                <div class="upgrade-actions">
                    <a href="https://www.delphi.ai/askaprilai/free-trial" target="_blank" class="btn-primary">
                        Start Free Trial - Get Notified
                    </a>
                    <p class="upgrade-note">Be the first to access when episodes launch!</p>
                </div>
            </div>
        `);
    }

    async loadTodaysEpisode() {
        try {
            // Fetch today's episode from API
            const response = await fetch('/api/today');
            const episode = await response.json();
            
            // Update the page with real episode data
            this.updateTodaysEpisode(episode);
            
            // Load weekly episodes
            const weekResponse = await fetch('/api/week');
            const weekEpisodes = await weekResponse.json();
            this.updateWeeklyEpisodes(weekEpisodes);
            
        } catch (error) {
            console.error('Error loading episodes:', error);
            // Fallback to static content if API fails
        }
    }

    updateTodaysEpisode(episode) {
        const todayCard = document.querySelector('.today-episode .episode-card');
        if (todayCard) {
            const titleElement = todayCard.querySelector('h3');
            const descElement = todayCard.querySelector('p');
            const durationElement = todayCard.querySelector('.duration');
            
            if (titleElement) titleElement.textContent = episode.title;
            if (descElement) descElement.textContent = episode.description;
            if (durationElement) durationElement.textContent = episode.duration;
            
            // Store episode data for playback
            todayCard.dataset.episodeId = episode.id;
            todayCard.dataset.audioUrl = episode.audioUrl;
        }
    }

    updateWeeklyEpisodes(episodes) {
        const weekContainer = document.querySelector('.week-episodes');
        if (!weekContainer) return;

        weekContainer.innerHTML = episodes.map((episode, index) => `
            <div class="episode-card" data-episode-id="${episode.id}" data-audio-url="${episode.audioUrl}">
                <div class="episode-number">${String(index + 1).padStart(2, '0')}</div>
                <div class="episode-info">
                    <h4>${episode.title}</h4>
                    <p>${episode.description || 'Daily leadership inspiration'}</p>
                    <span class="duration">${episode.duration}</span>
                </div>
                <button class="mini-play-btn">▶</button>
            </div>
        `).join('');

        // Re-attach event listeners
        weekContainer.querySelectorAll('.mini-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handlePlay(e));
        });
    }

    setupProgressTracking() {
        // Track user engagement and progress
        // This would integrate with your analytics system
    }

    trackPlay(episodeData) {
        // Analytics tracking
        console.log('Tracking play:', episodeData.title);
        
        // In production, send to analytics service
        // analytics.track('episode_played', {
        //     episode_id: episodeData.id,
        //     title: episodeData.title,
        //     user_id: getCurrentUserId()
        // });
    }

    markAsCompleted() {
        // Mark episode as completed
        let completedEpisodes = JSON.parse(localStorage.getItem('completedRipples') || '[]');
        if (this.currentEpisode && !completedEpisodes.includes(this.currentEpisode)) {
            completedEpisodes.push(this.currentEpisode);
            localStorage.setItem('completedRipples', JSON.stringify(completedEpisodes));
        }
    }

    startVisualizer() {
        const visualizer = document.getElementById('audioVisualizer');
        if (visualizer) {
            visualizer.classList.remove('paused');
        }
    }

    pauseVisualizer() {
        const visualizer = document.getElementById('audioVisualizer');
        if (visualizer) {
            visualizer.classList.add('paused');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const player = new DailyRipplePlayer();
    
    // Add some CSS for dynamic elements
    const style = document.createElement('style');
    style.textContent = `
        .floating-player {
            position: fixed;
            bottom: -100px;
            left: 20px;
            right: 20px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 1000;
            transition: bottom 0.3s ease;
        }
        
        .floating-player.active {
            bottom: 20px;
        }
        
        .fp-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
        }
        
        .fp-title {
            font-weight: 600;
            color: #000;
            font-size: 0.9rem;
        }
        
        .fp-duration {
            font-size: 0.8rem;
            color: #666;
        }
        
        .fp-controls {
            display: flex;
            gap: 10px;
        }
        
        .fp-play, .fp-close {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 5px;
        }
        
        .fp-progress {
            height: 3px;
            background: #eee;
            border-radius: 0 0 12px 12px;
        }
        
        .fp-progress-bar {
            height: 100%;
            background: #FFD700;
            width: 0%;
            transition: width 0.1s;
        }
        
        .ripple-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 2000;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
        }
        
        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            border-radius: 15px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
        }
        
        .toast {
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: #fff;
            padding: 12px 24px;
            border-radius: 25px;
            z-index: 3000;
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .toast.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DailyRipplePlayer;
}