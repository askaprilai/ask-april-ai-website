// Premium AI Co-Pilot Controller
class PremiumCopilotController {
    constructor() {
        this.apiBaseUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:3002/api/copilot'
            : '/api/copilot';
        this.currentConversation = null;
        this.userDocuments = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.initializeCategoryTabs();
        this.initializeAIAssistant();
    }

    setupEventListeners() {
        // Document creation buttons
        document.querySelectorAll('.create-doc-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const docType = e.target.getAttribute('data-type');
                this.startPremiumDocumentCreation(docType);
            });
        });

        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const docType = e.target.getAttribute('data-type');
                this.startPremiumDocumentCreation(docType);
            });
        });

        // Category tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchCategory(e.target.getAttribute('data-category'));
            });
        });

        // AI Assistant
        document.getElementById('sendMessage').addEventListener('click', () => {
            this.sendChatMessage();
        });

        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });

        // Suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const suggestion = e.target.textContent;
                document.getElementById('chatInput').value = suggestion;
                this.sendChatMessage();
            });
        });

        // Minimize assistant
        document.getElementById('minimizeAssistant').addEventListener('click', () => {
            this.toggleAssistant();
        });
    }

    loadUserData() {
        // Simulate loading user documents and analytics
        this.userDocuments = [
            {
                id: 1,
                title: "Employee Handbook v2.0",
                type: "employee-handbook-pro",
                lastModified: "2 hours ago",
                status: "completed"
            },
            {
                id: 2,
                title: "Customer Service Training",
                type: "advanced-training",
                lastModified: "yesterday",
                status: "completed"
            },
            {
                id: 3,
                title: "Safety Policy Update",
                type: "safety-system",
                lastModified: "3 days ago",
                status: "completed"
            }
        ];

        this.updateAnalytics({
            documentsCreated: 23,
            hoursSaved: 156,
            teamsImproved: 5,
            efficiencyGained: 78
        });
    }

    updateAnalytics(data) {
        // Update analytics display
        const analyticsItems = document.querySelectorAll('.analytics-item h4');
        if (analyticsItems.length >= 3) {
            analyticsItems[0].textContent = data.documentsCreated;
            analyticsItems[1].textContent = data.hoursSaved;
            analyticsItems[2].textContent = data.teamsImproved;
        }

        // Update progress ring
        const progressRing = document.querySelector('.ring-progress');
        if (progressRing) {
            const percentage = data.efficiencyGained;
            progressRing.style.background = `conic-gradient(#FFD700 0% ${percentage}%, #eee ${percentage}% 100%)`;
            progressRing.querySelector('.progress-text').textContent = `${percentage}%`;
        }
    }

    initializeCategoryTabs() {
        this.switchCategory('hr'); // Default to HR category
    }

    switchCategory(category) {
        // Update tab active states
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Update document category display
        document.querySelectorAll('.doc-category').forEach(cat => {
            cat.classList.remove('active');
        });
        document.querySelector(`.doc-category[data-category="${category}"]`).classList.add('active');
    }

    async startPremiumDocumentCreation(documentType) {
        try {
            // Show loading state
            this.showNotification('Starting document creation...', 'info');

            // Enhanced document types for premium users
            const premiumDocumentTypes = {
                'employee-handbook-pro': 'Enhanced Employee Handbook with Legal Compliance',
                'performance-review': 'Performance Review System',
                'job-description': 'AI-Powered Job Description',
                'team-development': 'Team Development Plan',
                'advanced-training': 'Advanced Training Program',
                'leadership-curriculum': 'Leadership Development Curriculum',
                'sop-advanced': 'Advanced Standard Operating Procedures',
                'safety-system': 'Safety Management System',
                'compliance-framework': 'Compliance Framework'
            };

            const response = await fetch(`${this.apiBaseUrl}/premium/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer premium-token' // Premium user token
                },
                body: JSON.stringify({
                    documentType: documentType,
                    premiumFeatures: true,
                    userTier: 'premium'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.currentConversation = data.conversationId;

            // Open advanced creation modal
            this.openPremiumCreationModal(data);

        } catch (error) {
            console.error('Error starting premium document creation:', error);
            this.showNotification('Sorry, there was an error starting document creation. Please try again.', 'error');
        }
    }

    openPremiumCreationModal(data) {
        // Create and show premium modal with enhanced features
        const modal = document.createElement('div');
        modal.className = 'premium-creation-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🚀 Premium Document Creation</h2>
                    <button class="close-modal">✕</button>
                </div>
                <div class="modal-body">
                    <div class="creation-progress">
                        <div class="progress-step active" data-step="1">
                            <span class="step-number">1</span>
                            <span class="step-label">Business Details</span>
                        </div>
                        <div class="progress-step" data-step="2">
                            <span class="step-number">2</span>
                            <span class="step-label">Advanced Options</span>
                        </div>
                        <div class="progress-step" data-step="3">
                            <span class="step-number">3</span>
                            <span class="step-label">AI Generation</span>
                        </div>
                        <div class="progress-step" data-step="4">
                            <span class="step-number">4</span>
                            <span class="step-label">Review & Export</span>
                        </div>
                    </div>
                    <div class="creation-content" id="creationContent">
                        <div class="premium-features-notice">
                            <h3>✨ Premium Features Included:</h3>
                            <ul>
                                <li>✓ Advanced AI generation with industry-specific insights</li>
                                <li>✓ Legal compliance checking and recommendations</li>
                                <li>✓ Multiple export formats (PDF, Word, HTML)</li>
                                <li>✓ Custom branding and styling options</li>
                                <li>✓ Collaborative editing and review features</li>
                            </ul>
                        </div>
                        <div id="questionsContainer"></div>
                    </div>
                    <div class="modal-actions">
                        <button id="prevStep" class="btn-secondary" style="display: none;">Previous</button>
                        <button id="nextStep" class="btn-primary">Continue</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupModalEventListeners(modal, data);
        
        // Show questions
        this.showPremiumQuestions(data.questions);
    }

    showPremiumQuestions(questions) {
        const container = document.getElementById('questionsContainer');
        container.innerHTML = '';

        questions.forEach(question => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'premium-question-item';
            
            let inputHtml = '';
            if (question.type === 'text') {
                inputHtml = `<input type="text" id="${question.id}" name="${question.id}" ${question.required ? 'required' : ''} placeholder="${question.placeholder || ''}" class="premium-input">`;
            } else if (question.type === 'textarea') {
                inputHtml = `<textarea id="${question.id}" name="${question.id}" rows="4" placeholder="${question.placeholder || ''}" class="premium-textarea"></textarea>`;
            } else if (question.type === 'select') {
                const options = question.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
                inputHtml = `<select id="${question.id}" name="${question.id}" ${question.required ? 'required' : ''} class="premium-select">
                    <option value="">Choose an option...</option>
                    ${options}
                </select>`;
            }

            questionDiv.innerHTML = `
                <label for="${question.id}" class="premium-label">${question.question} ${question.required ? '*' : ''}</label>
                ${inputHtml}
                ${question.helpText ? `<p class="help-text">${question.helpText}</p>` : ''}
            `;

            container.appendChild(questionDiv);
        });
    }

    setupModalEventListeners(modal, data) {
        // Close modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // Next step
        modal.querySelector('#nextStep').addEventListener('click', () => {
            this.handleNextStep(modal);
        });
    }

    handleNextStep(modal) {
        // Collect form data and proceed to next step
        const formData = new FormData();
        const inputs = modal.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.value.trim()) {
                formData.append(input.name, input.value.trim());
            }
        });

        // Validate required fields
        const requiredFields = modal.querySelectorAll('[required]');
        let hasErrors = false;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ff4444';
                hasErrors = true;
            } else {
                field.style.borderColor = '';
            }
        });

        if (!hasErrors) {
            this.proceedToGeneration(modal, formData);
        }
    }

    proceedToGeneration(modal, formData) {
        // Update modal to show generation progress
        const content = modal.querySelector('#creationContent');
        content.innerHTML = `
            <div class="generation-progress">
                <div class="ai-avatar">
                    <img src="aprilb.png" alt="April AI" class="generating-avatar">
                </div>
                <h3>🤖 AI is creating your premium document...</h3>
                <p>This may take 3-5 minutes for premium features</p>
                <div class="premium-progress-bar">
                    <div class="premium-progress-fill" id="premiumProgressFill"></div>
                </div>
                <div class="generation-steps" id="generationSteps">
                    <div class="gen-step active">Analyzing your business requirements...</div>
                    <div class="gen-step">Checking legal compliance standards...</div>
                    <div class="gen-step">Generating industry-specific content...</div>
                    <div class="gen-step">Applying premium formatting...</div>
                    <div class="gen-step">Final review and optimization...</div>
                </div>
            </div>
        `;

        // Hide action buttons
        modal.querySelector('.modal-actions').style.display = 'none';

        // Start generation simulation
        this.simulatePremiumGeneration(modal);
    }

    simulatePremiumGeneration(modal) {
        let progress = 0;
        let currentStep = 0;
        const steps = modal.querySelectorAll('.gen-step');
        
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                this.showGenerationComplete(modal);
            }

            // Update progress bar
            modal.querySelector('#premiumProgressFill').style.width = `${progress}%`;

            // Update current step
            if (progress > currentStep * 20 && currentStep < steps.length) {
                steps[currentStep].classList.remove('active');
                steps[currentStep].classList.add('completed');
                currentStep++;
                if (currentStep < steps.length) {
                    steps[currentStep].classList.add('active');
                }
            }
        }, 800);
    }

    showGenerationComplete(modal) {
        const content = modal.querySelector('#creationContent');
        content.innerHTML = `
            <div class="generation-complete">
                <div class="success-animation">🎉</div>
                <h3>Your Premium Document is Ready!</h3>
                <p>Your document has been generated with all premium features included.</p>
                
                <div class="document-preview">
                    <div class="preview-header">
                        <span class="doc-type">📋 Employee Handbook Pro</span>
                        <span class="premium-badge">PREMIUM</span>
                    </div>
                    <div class="preview-stats">
                        <div class="stat">15 Sections</div>
                        <div class="stat">2,847 Words</div>
                        <div class="stat">Legal Compliant</div>
                    </div>
                </div>

                <div class="export-options">
                    <h4>Export Options:</h4>
                    <div class="export-buttons">
                        <button class="export-btn pdf">📄 Download PDF</button>
                        <button class="export-btn word">📝 Download Word</button>
                        <button class="export-btn html">🌐 Download HTML</button>
                        <button class="export-btn preview">👁️ Preview</button>
                    </div>
                </div>

                <div class="next-actions">
                    <h4>What's Next?</h4>
                    <ul>
                        <li>✓ Review document with your team</li>
                        <li>✓ Customize branding and styling</li>
                        <li>✓ Schedule legal review (premium support available)</li>
                        <li>✓ Implement with your team</li>
                    </ul>
                </div>
            </div>
        `;

        // Show new action buttons
        const actions = modal.querySelector('.modal-actions');
        actions.style.display = 'flex';
        actions.innerHTML = `
            <button class="btn-secondary">Create Another</button>
            <button class="btn-primary">Save to Library</button>
        `;
    }

    initializeAIAssistant() {
        // Add welcome message
        this.addAssistantMessage("Hi! I'm April's AI assistant. I can help you create any document, answer questions about leadership, or guide you through our premium features. What would you like to work on today?");
    }

    sendChatMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message
        this.addChatMessage(message, 'user');
        input.value = '';

        // Simulate AI response
        setTimeout(() => {
            this.generateAIResponse(message);
        }, 1000);
    }

    addChatMessage(message, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `<p>${message}</p>`;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addAssistantMessage(message) {
        this.addChatMessage(message, 'ai');
    }

    generateAIResponse(userMessage) {
        const responses = {
            'performance review': "I can help you create a comprehensive performance review template! It includes 360-degree feedback, goal setting, and development planning. Would you like me to start the creation process?",
            'team communication': "Great question! For better team communication, I recommend creating a communication protocol document. This would include meeting structures, feedback processes, and conflict resolution steps. Shall I create this for you?",
            'safety checklist': "Safety is crucial! I can generate a comprehensive safety checklist tailored to your industry. It will include daily checks, emergency procedures, and compliance requirements. What industry are you in?",
            'default': "I'd be happy to help with that! As a premium member, you have access to all our advanced document types. You can create employee handbooks, training programs, policies, and much more. What specific document would you like to work on?"
        };

        let response = responses.default;
        
        // Simple keyword matching for demo
        Object.keys(responses).forEach(keyword => {
            if (userMessage.toLowerCase().includes(keyword) && keyword !== 'default') {
                response = responses[keyword];
            }
        });

        this.addAssistantMessage(response);
    }

    toggleAssistant() {
        const assistant = document.getElementById('aiAssistant');
        const body = assistant.querySelector('.assistant-body');
        const minimizeBtn = document.getElementById('minimizeAssistant');
        
        if (body.style.display === 'none') {
            body.style.display = 'block';
            minimizeBtn.textContent = '−';
        } else {
            body.style.display = 'none';
            minimizeBtn.textContent = '+';
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
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const premiumCopilot = new PremiumCopilotController();
    
    // Add premium-specific CSS
    const style = document.createElement('style');
    style.textContent = `
        .premium-creation-modal {
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

        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
        }

        .modal-content {
            position: relative;
            background: white;
            border-radius: 20px;
            width: 90%;
            max-width: 900px;
            max-height: 90vh;
            overflow: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
            background: linear-gradient(135deg, #000 0%, #333 100%);
            color: white;
            padding: 30px;
            border-radius: 20px 20px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h2 {
            color: #FFD700;
            margin: 0;
        }

        .close-modal {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 5px;
        }

        .modal-body {
            padding: 40px;
        }

        .creation-progress {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            position: relative;
        }

        .creation-progress::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 30px;
            right: 30px;
            height: 2px;
            background: #eee;
            z-index: 1;
        }

        .progress-step {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            z-index: 2;
        }

        .step-number {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #eee;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            margin-bottom: 10px;
            transition: all 0.3s;
        }

        .progress-step.active .step-number {
            background: #FFD700;
            color: #000;
        }

        .step-label {
            font-size: 0.9rem;
            color: #666;
            text-align: center;
        }

        .premium-features-notice {
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            color: #000;
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 30px;
        }

        .premium-features-notice h3 {
            margin-bottom: 15px;
        }

        .premium-features-notice ul {
            list-style: none;
            padding: 0;
        }

        .premium-features-notice li {
            margin-bottom: 8px;
            font-weight: 500;
        }

        .premium-question-item {
            margin-bottom: 25px;
        }

        .premium-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #000;
        }

        .premium-input,
        .premium-textarea,
        .premium-select {
            width: 100%;
            padding: 15px;
            border: 2px solid #ddd;
            border-radius: 12px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }

        .premium-input:focus,
        .premium-textarea:focus,
        .premium-select:focus {
            outline: none;
            border-color: #FFD700;
        }

        .help-text {
            font-size: 0.85rem;
            color: #666;
            margin-top: 5px;
        }

        .modal-actions {
            display: flex;
            gap: 15px;
            justify-content: flex-end;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }

        .generation-progress {
            text-align: center;
            padding: 40px 20px;
        }

        .generating-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }

        .premium-progress-bar {
            width: 100%;
            height: 12px;
            background: #eee;
            border-radius: 6px;
            margin: 30px 0;
            overflow: hidden;
        }

        .premium-progress-fill {
            height: 100%;
            background: linear-gradient(45deg, #FFD700, #FFA500);
            transition: width 0.3s ease;
        }

        .generation-steps {
            text-align: left;
            max-width: 400px;
            margin: 30px auto 0;
        }

        .gen-step {
            padding: 10px;
            margin-bottom: 8px;
            border-radius: 8px;
            color: #666;
            transition: all 0.3s;
        }

        .gen-step.active {
            background: #FFD700;
            color: #000;
            font-weight: 600;
        }

        .gen-step.completed {
            background: #28a745;
            color: white;
        }

        .generation-complete {
            text-align: center;
            padding: 20px;
        }

        .success-animation {
            font-size: 4rem;
            margin-bottom: 20px;
            animation: bounce 1s infinite;
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }

        .document-preview {
            background: #f8f9fa;
            border: 2px solid #ddd;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
        }

        .preview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .doc-type {
            font-weight: 600;
            color: #000;
        }

        .preview-stats {
            display: flex;
            gap: 20px;
            justify-content: center;
        }

        .preview-stats .stat {
            background: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            color: #666;
        }

        .export-options {
            margin: 30px 0;
        }

        .export-options h4 {
            margin-bottom: 15px;
            color: #000;
        }

        .export-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .export-btn {
            background: white;
            border: 2px solid #ddd;
            padding: 12px 20px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 600;
        }

        .export-btn:hover {
            border-color: #FFD700;
            background: #fffbf0;
        }

        .next-actions {
            text-align: left;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            margin-top: 25px;
        }

        .next-actions h4 {
            margin-bottom: 15px;
            color: #000;
        }

        .next-actions ul {
            list-style: none;
            padding: 0;
        }

        .next-actions li {
            margin-bottom: 8px;
            color: #28a745;
            font-weight: 500;
        }

        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            padding: 20px;
            z-index: 10001;
            transform: translateX(400px);
            transition: transform 0.3s ease;
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
        }
    `;
    document.head.appendChild(style);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PremiumCopilotController;
}