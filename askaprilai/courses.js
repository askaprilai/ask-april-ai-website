// Courses Page JavaScript
class CoursesController {
    constructor() {
        this.currentIndustry = 'retail';
        this.userProgress = {
            coursesCompleted: 3,
            hoursLearned: 8.5,
            certificatesEarned: 12,
            overallProgress: 68
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeIndustryTabs();
        this.loadUserProgress();
    }

    setupEventListeners() {
        // Industry tabs
        document.querySelectorAll('.industry-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const industry = e.target.getAttribute('data-industry');
                this.switchIndustry(industry);
            });
        });

        // Course buttons
        document.querySelectorAll('.course-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const courseCard = e.target.closest('.course-card');
                const courseTitle = courseCard.querySelector('h3').textContent;
                const isPremium = e.target.classList.contains('premium');
                
                if (isPremium) {
                    this.showUpgradeModal();
                } else {
                    this.startCourse(courseTitle);
                }
            });
        });

        // Continue learning buttons
        document.querySelectorAll('.continue-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const activityItem = e.target.closest('.activity-item');
                const courseTitle = activityItem.querySelector('h4').textContent;
                this.continueCourse(courseTitle);
            });
        });

        // Category links
        document.querySelectorAll('.category-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = e.target.getAttribute('href');
                this.scrollToSection(targetSection);
            });
        });

        // Video preview play button
        const playBtn = document.querySelector('.play-btn-large');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                this.playWelcomeVideo();
            });
        }
    }

    switchIndustry(industry) {
        // Update tab active states
        document.querySelectorAll('.industry-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-industry="${industry}"]`).classList.add('active');

        // Update content visibility
        document.querySelectorAll('.industry-content').forEach(content => {
            content.classList.remove('active');
        });
        document.querySelector(`.industry-content[data-industry="${industry}"]`).classList.add('active');

        this.currentIndustry = industry;
    }

    initializeIndustryTabs() {
        this.switchIndustry('retail'); // Default to retail
    }

    loadUserProgress() {
        // Update progress statistics
        const progressStats = document.querySelectorAll('.progress-stats .stat h4');
        if (progressStats.length >= 3) {
            progressStats[0].textContent = this.userProgress.coursesCompleted;
            progressStats[1].textContent = this.userProgress.hoursLearned;
            progressStats[2].textContent = this.userProgress.certificatesEarned;
        }

        // Update overall progress bar
        const progressFill = document.querySelector('.progress-bar.large .progress-fill');
        const progressPercentage = document.querySelector('.progress-percentage');
        
        if (progressFill && progressPercentage) {
            progressFill.style.width = `${this.userProgress.overallProgress}%`;
            progressPercentage.textContent = `${this.userProgress.overallProgress}% Complete`;
        }

        // Simulate some course progress
        this.updateCourseProgress();
    }

    updateCourseProgress() {
        // Add some random progress to courses
        const progressBars = document.querySelectorAll('.course-progress .progress-fill');
        const progressTexts = document.querySelectorAll('.course-progress .progress-text');
        
        progressBars.forEach((bar, index) => {
            let progress = 0;
            if (index === 0) progress = 100; // First course completed
            else if (index === 1) progress = 45; // Second course in progress
            else if (index === 2) progress = 80; // Third course almost done
            
            bar.style.width = `${progress}%`;
            
            if (progressTexts[index]) {
                if (progress === 0) {
                    progressTexts[index].textContent = 'Not started';
                } else if (progress === 100) {
                    progressTexts[index].textContent = 'Completed';
                } else {
                    progressTexts[index].textContent = `${progress}% complete`;
                }
            }
        });
    }

    startCourse(courseTitle) {
        // Show course starting animation
        this.showNotification(`Starting "${courseTitle}"...`, 'info');
        
        // Simulate course loading
        setTimeout(() => {
            this.showNotification(`Welcome to "${courseTitle}"! Let's begin your learning journey.`, 'success');
            
            // In a real implementation, this would redirect to the course player
            // For now, we'll just show a modal
            this.showCourseModal(courseTitle);
        }, 1500);
    }

    continueCourse(courseTitle) {
        this.showNotification(`Continuing "${courseTitle}"...`, 'info');
        
        setTimeout(() => {
            this.showCourseModal(courseTitle, true);
        }, 1000);
    }

    showCourseModal(courseTitle, isContinuing = false) {
        const modal = document.createElement('div');
        modal.className = 'course-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="course-header">
                    <h2>${courseTitle}</h2>
                    <button class="close-modal">✕</button>
                </div>
                <div class="course-body">
                    <div class="video-player">
                        <div class="video-placeholder">
                            <img src="aprilb.png" alt="April Sabral" class="instructor-img">
                            <div class="play-overlay">
                                <button class="play-btn">▶</button>
                            </div>
                        </div>
                        <div class="video-controls">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${isContinuing ? '45' : '0'}%"></div>
                            </div>
                            <div class="control-buttons">
                                <button class="control-btn">⏮️</button>
                                <button class="control-btn play">▶️</button>
                                <button class="control-btn">⏭️</button>
                                <span class="time">00:00 / 15:30</span>
                            </div>
                        </div>
                    </div>
                    <div class="lesson-sidebar">
                        <h3>Course Content</h3>
                        <div class="lesson-list">
                            <div class="lesson-item ${isContinuing ? '' : 'active'}">
                                <span class="lesson-number">1</span>
                                <span class="lesson-title">Introduction to Leadership</span>
                                <span class="lesson-duration">5:30</span>
                            </div>
                            <div class="lesson-item ${isContinuing ? 'active' : ''}">
                                <span class="lesson-number">2</span>
                                <span class="lesson-title">The Foundation of Trust</span>
                                <span class="lesson-duration">8:45</span>
                            </div>
                            <div class="lesson-item">
                                <span class="lesson-number">3</span>
                                <span class="lesson-title">Communication Strategies</span>
                                <span class="lesson-duration">12:15</span>
                            </div>
                            <div class="lesson-item">
                                <span class="lesson-number">4</span>
                                <span class="lesson-title">Practical Applications</span>
                                <span class="lesson-duration">10:20</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="course-actions">
                    <button class="btn-secondary">Save Progress</button>
                    <button class="btn-primary">Continue Learning</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup modal event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // Add modal styles
        if (!document.querySelector('#courseModalStyles')) {
            const styles = document.createElement('style');
            styles.id = 'courseModalStyles';
            styles.textContent = `
                .course-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .course-modal .modal-content {
                    width: 90%;
                    max-width: 1000px;
                    height: 80vh;
                    display: flex;
                    flex-direction: column;
                }
                .course-header {
                    padding: 20px 30px;
                    background: linear-gradient(135deg, #000 0%, #333 100%);
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-radius: 15px 15px 0 0;
                }
                .course-header h2 {
                    color: #FFD700;
                    margin: 0;
                }
                .course-body {
                    flex: 1;
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 20px;
                    padding: 30px;
                }
                .video-player {
                    background: #000;
                    border-radius: 10px;
                    overflow: hidden;
                }
                .video-placeholder {
                    position: relative;
                    width: 100%;
                    height: 300px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .instructor-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .play-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0,0,0,0.5);
                }
                .play-btn {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: #FFD700;
                    color: #000;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                }
                .video-controls {
                    padding: 15px;
                    background: #333;
                }
                .video-controls .progress-bar {
                    height: 4px;
                    background: #666;
                    border-radius: 2px;
                    margin-bottom: 10px;
                    overflow: hidden;
                }
                .control-buttons {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .control-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                }
                .time {
                    color: #ccc;
                    font-size: 0.9rem;
                    margin-left: auto;
                }
                .lesson-sidebar {
                    background: #f8f9fa;
                    border-radius: 10px;
                    padding: 20px;
                }
                .lesson-sidebar h3 {
                    margin-bottom: 20px;
                    color: #000;
                }
                .lesson-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .lesson-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    background: white;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .lesson-item:hover {
                    background: #fffbf0;
                    border-color: #FFD700;
                }
                .lesson-item.active {
                    background: #FFD700;
                    color: #000;
                }
                .lesson-number {
                    width: 25px;
                    height: 25px;
                    border-radius: 50%;
                    background: #eee;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    font-weight: 600;
                }
                .lesson-item.active .lesson-number {
                    background: #000;
                    color: #FFD700;
                }
                .lesson-title {
                    flex: 1;
                    font-weight: 500;
                }
                .lesson-duration {
                    font-size: 0.8rem;
                    color: #666;
                }
                .course-actions {
                    padding: 20px 30px;
                    border-top: 1px solid #eee;
                    display: flex;
                    gap: 15px;
                    justify-content: flex-end;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    showUpgradeModal() {
        const modal = document.createElement('div');
        modal.className = 'upgrade-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="upgrade-header">
                    <div class="upgrade-icon">👑</div>
                    <h2>Upgrade to Premium</h2>
                    <p>Access advanced courses and exclusive content</p>
                </div>
                <div class="upgrade-features">
                    <div class="feature-item">
                        <span class="feature-icon">✨</span>
                        <span class="feature-text">Unlimited access to all courses</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">🎓</span>
                        <span class="feature-text">Advanced management training</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">📜</span>
                        <span class="feature-text">Completion certificates</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">💬</span>
                        <span class="feature-text">Direct access to April</span>
                    </div>
                </div>
                <div class="upgrade-actions">
                    <button class="btn-secondary close-upgrade">Maybe Later</button>
                    <a href="https://askaprilai.newzenler.com/courses/builder-subscription/buy" target="_blank" class="btn-primary">Upgrade Now</a>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.close-upgrade').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    playWelcomeVideo() {
        this.showNotification('Welcome video coming soon!', 'info');
        // In a real implementation, this would open a video player
    }

    scrollToSection(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const coursesController = new CoursesController();
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            padding: 15px 20px;
            z-index: 10001;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        }

        .notification.show {
            transform: translateX(0);
        }

        .notification.error {
            border-left: 4px solid #dc3545;
        }

        .notification.success {
            border-left: 4px solid #28a745;
        }

        .notification.info {
            border-left: 4px solid #17a2b8;
        }

        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .notification-icon {
            font-size: 1.2rem;
        }

        .notification-message {
            font-weight: 500;
            color: #000;
            line-height: 1.4;
        }

        .upgrade-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .upgrade-modal .modal-content {
            width: 90%;
            max-width: 500px;
            padding: 40px;
            text-align: center;
        }

        .upgrade-header {
            margin-bottom: 30px;
        }

        .upgrade-icon {
            font-size: 4rem;
            margin-bottom: 20px;
        }

        .upgrade-header h2 {
            font-size: 2rem;
            font-weight: 800;
            color: #000;
            margin-bottom: 10px;
        }

        .upgrade-header p {
            color: #666;
            font-size: 1.1rem;
        }

        .upgrade-features {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 30px;
            text-align: left;
        }

        .feature-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
        }

        .feature-icon {
            font-size: 1.5rem;
            width: 30px;
        }

        .feature-text {
            font-weight: 500;
            color: #000;
        }

        .upgrade-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CoursesController;
}