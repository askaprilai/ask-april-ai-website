// AI Co-Pilot Frontend Controller
class AICopilotController {
    constructor() {
        this.apiBaseUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:3002/api/copilot'
            : '/api/copilot';
        this.currentConversation = null;
        this.currentStep = 'initial';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeInterface();
    }

    setupEventListeners() {
        // Tool card click handlers
        document.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleToolSelection(e));
        });

        // CTA button handlers
        document.querySelectorAll('[href*="free-trial"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCopilotInterface();
            });
        });

        // Demo button in hero
        const demoBtn = document.querySelector('a[href="#tools"]');
        if (demoBtn) {
            demoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
            });
        }
    }

    initializeInterface() {
        // Create hidden copilot interface
        this.createCopilotInterface();
    }

    createCopilotInterface() {
        const interface = document.createElement('div');
        interface.id = 'copilot-interface';
        interface.className = 'copilot-interface hidden';
        interface.innerHTML = `
            <div class="copilot-overlay"></div>
            <div class="copilot-modal">
                <div class="copilot-header">
                    <h2>AI Co-Pilot Assistant</h2>
                    <button class="copilot-close" id="closeCopilot">✕</button>
                </div>
                <div class="copilot-body">
                    <div class="copilot-messages" id="copilotMessages">
                        <div class="april-message">
                            <div class="april-avatar">
                                <span>👩‍💼</span>
                            </div>
                            <div class="message-content">
                                <p>Hi! I'm April, and I'm here to help you create professional business documents. What would you like to create today?</p>
                            </div>
                        </div>
                    </div>
                    <div class="copilot-input-area" id="copilotInputArea">
                        <div class="document-selection" id="documentSelection">
                            <h3>What would you like to do?</h3>
                            <div class="action-options">
                                <button class="action-option primary-action" id="createNewDoc">
                                    <span class="action-icon">✨</span>
                                    <span class="action-name">Create New Document</span>
                                    <span class="action-desc">Start from scratch with AI guidance</span>
                                </button>
                                <button class="action-option" id="improveExisting">
                                    <span class="action-icon">🔧</span>
                                    <span class="action-name">Improve Existing Document</span>
                                    <span class="action-desc">Upload and enhance your current documents</span>
                                </button>
                            </div>
                            
                            <div class="document-options" id="newDocOptions" style="display: none;">
                                <h4>Choose a document type:</h4>
                                <div class="doc-grid">
                                <button class="doc-option" data-type="employee-handbook">
                                    <span class="doc-icon">📋</span>
                                    <span class="doc-name">Employee Handbook</span>
                                    <span class="doc-time">15-30 mins</span>
                                </button>
                                <button class="doc-option" data-type="training-program">
                                    <span class="doc-icon">🎓</span>
                                    <span class="doc-name">Training Program</span>
                                    <span class="doc-time">20-45 mins</span>
                                </button>
                                <button class="doc-option" data-type="policy-document">
                                    <span class="doc-icon">📄</span>
                                    <span class="doc-name">Policy Document</span>
                                    <span class="doc-time">10-20 mins</span>
                                </button>
                                <button class="doc-option" data-type="process-documentation">
                                    <span class="doc-icon">⚙️</span>
                                    <span class="doc-name">Process Documentation</span>
                                    <span class="doc-time">15-25 mins</span>
                                </button>
                            </div>
                        </div>
                        <div class="question-form" id="questionForm" style="display: none;">
                            <div class="questions-container" id="questionsContainer"></div>
                            <div class="form-actions">
                                <button id="submitAnswers" class="btn-primary">Continue</button>
                                <button id="backButton" class="btn-secondary" style="display: none;">Back</button>
                            </div>
                        </div>
                        <div class="generation-status" id="generationStatus" style="display: none;">
                            <div class="status-content">
                                <div class="progress-spinner"></div>
                                <h3>Creating Your Document...</h3>
                                <p class="status-message">This will take about 2-3 minutes</p>
                                <div class="progress-bar">
                                    <div class="progress-fill" id="progressFill"></div>
                                </div>
                                <p class="progress-text" id="progressText">0% complete</p>
                            </div>
                        </div>
                        <div class="document-ready" id="documentReady" style="display: none;">
                            <div class="ready-content">
                                <div class="success-icon">✅</div>
                                <h3>Your Document is Ready!</h3>
                                <p>I've created a professional document tailored to your business needs.</p>
                                <div class="download-options">
                                    <button id="downloadHtml" class="btn-primary">Download HTML</button>
                                    <button id="downloadText" class="btn-secondary">Download Text</button>
                                    <button id="previewDocument" class="btn-secondary">Preview</button>
                                </div>
                                <div class="next-steps">
                                    <p><strong>Next Steps:</strong></p>
                                    <ul>
                                        <li>Review the document with your team</li>
                                        <li>Customize any sections as needed</li>
                                        <li>Have it reviewed by legal counsel if required</li>
                                        <li>Implement with your team</li>
                                    </ul>
                                </div>
                                <button id="createAnother" class="btn-secondary">Create Another Document</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(interface);
        this.setupInterfaceEventListeners();
    }

    setupInterfaceEventListeners() {
        // Close modal
        document.getElementById('closeCopilot').addEventListener('click', () => {
            this.hideCopilotInterface();
        });

        // Overlay click to close
        document.querySelector('.copilot-overlay').addEventListener('click', () => {
            this.hideCopilotInterface();
        });

        // Action selection
        document.getElementById('createNewDoc').addEventListener('click', () => {
            this.showNewDocumentOptions();
        });

        document.getElementById('improveExisting').addEventListener('click', () => {
            this.showUploadSection();
        });

        // Document type selection
        document.querySelectorAll('.doc-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectDocumentType(e.target.closest('.doc-option').dataset.type);
            });
        });

        // Form submission
        document.getElementById('submitAnswers').addEventListener('click', () => {
            this.submitAnswers();
        });

        // Download buttons
        document.getElementById('downloadHtml').addEventListener('click', () => {
            this.downloadDocument('html');
        });

        document.getElementById('downloadText').addEventListener('click', () => {
            this.downloadDocument('txt');
        });

        document.getElementById('previewDocument').addEventListener('click', () => {
            this.previewDocument();
        });

        document.getElementById('createAnother').addEventListener('click', () => {
            this.resetInterface();
        });
    }

    handleToolSelection(e) {
        const card = e.target.closest('.tool-card');
        if (!card) return;

        // Extract document type from the card
        const title = card.querySelector('h3').textContent.toLowerCase();
        let documentType = '';

        if (title.includes('employee handbook')) documentType = 'employee-handbook';
        else if (title.includes('training')) documentType = 'training-program';
        else if (title.includes('policy')) documentType = 'policy-document';
        else if (title.includes('process')) documentType = 'process-documentation';

        if (documentType) {
            this.showCopilotInterface();
            // Auto-select the document type
            setTimeout(() => {
                this.selectDocumentType(documentType);
            }, 500);
        }
    }

    showCopilotInterface() {
        document.getElementById('copilot-interface').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideCopilotInterface() {
        document.getElementById('copilot-interface').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    async selectDocumentType(documentType) {
        try {
            this.showStep('loading');
            this.addMessage('user', `I'd like to create a ${documentType.replace('-', ' ')}.`);

            const response = await fetch(`${this.apiBaseUrl}/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    documentType: documentType,
                    businessInfo: {}
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.currentConversation = data.conversationId;
            
            this.addMessage('april', data.message);
            this.showQuestions(data.questions);
            this.showStep('questions');

        } catch (error) {
            console.error('Error starting conversation:', error);
            this.addMessage('april', 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.');
            this.showStep('error');
        }
    }

    showQuestions(questions) {
        const container = document.getElementById('questionsContainer');
        container.innerHTML = '';

        questions.forEach(question => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-item';
            
            let inputHtml = '';
            if (question.type === 'text') {
                inputHtml = `<input type="text" id="${question.id}" name="${question.id}" ${question.required ? 'required' : ''} placeholder="${question.placeholder || ''}">`;
            } else if (question.type === 'textarea') {
                inputHtml = `<textarea id="${question.id}" name="${question.id}" rows="3" placeholder="${question.placeholder || ''}"></textarea>`;
            } else if (question.type === 'select') {
                const options = question.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
                inputHtml = `<select id="${question.id}" name="${question.id}" ${question.required ? 'required' : ''}>
                    <option value="">Choose an option...</option>
                    ${options}
                </select>`;
            }

            questionDiv.innerHTML = `
                <label for="${question.id}">${question.question} ${question.required ? '*' : ''}</label>
                ${inputHtml}
            `;

            container.appendChild(questionDiv);
        });
    }

    async submitAnswers() {
        try {
            const form = document.getElementById('questionForm');
            const formData = new FormData(form.querySelector('.questions-container'));
            const answers = {};

            for (let [key, value] of formData.entries()) {
                if (value.trim()) {
                    answers[key] = value.trim();
                }
            }

            // Check for required fields
            const requiredFields = document.querySelectorAll('#questionsContainer [required]');
            let hasErrors = false;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#ff4444';
                    hasErrors = true;
                } else {
                    field.style.borderColor = '';
                }
            });

            if (hasErrors) {
                this.addMessage('april', 'Please fill in all required fields (marked with *).');
                return;
            }

            this.showStep('loading');

            const response = await fetch(`${this.apiBaseUrl}/continue`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    conversationId: this.currentConversation,
                    answers: answers
                })
            });

            const data = await response.json();

            if (data.questions && data.questions.length > 0) {
                // More questions to answer
                this.addMessage('april', data.message);
                this.showQuestions(data.questions);
                this.showStep('questions');
            } else if (data.nextStep === 'document_generation') {
                // Start document generation
                this.addMessage('april', data.message);
                this.showStep('generating');
                this.startProgressTracking();
            }

        } catch (error) {
            console.error('Error submitting answers:', error);
            this.addMessage('april', 'Sorry, there was an error processing your answers. Please try again.');
        }
    }

    async startProgressTracking() {
        const checkStatus = async () => {
            try {
                const response = await fetch(`${this.apiBaseUrl}/status/${this.currentConversation}`);
                const data = await response.json();

                this.updateProgress(data.progress);

                if (data.status === 'document_ready') {
                    this.addMessage('april', data.message);
                    this.showStep('ready');
                } else {
                    // Continue checking
                    setTimeout(checkStatus, 2000);
                }
            } catch (error) {
                console.error('Error checking status:', error);
                setTimeout(checkStatus, 5000); // Retry after longer delay
            }
        };

        checkStatus();
    }

    updateProgress(progress) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        if (progressText) {
            progressText.textContent = `${progress}% complete`;
        }
    }

    async downloadDocument(format) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/download/${this.currentConversation}?format=${format}`);
            
            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `document.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            this.addMessage('april', `Your document has been downloaded as ${format.toUpperCase()}!`);
        } catch (error) {
            console.error('Error downloading document:', error);
            this.addMessage('april', 'Sorry, there was an error downloading your document. Please try again.');
        }
    }

    async previewDocument() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/download/${this.currentConversation}?format=html`);
            const htmlContent = await response.text();
            
            const previewWindow = window.open('', '_blank');
            previewWindow.document.write(htmlContent);
            previewWindow.document.close();
        } catch (error) {
            console.error('Error previewing document:', error);
            this.addMessage('april', 'Sorry, there was an error previewing your document.');
        }
    }

    showStep(step) {
        // Hide all steps
        document.getElementById('documentSelection').style.display = 'none';
        document.getElementById('questionForm').style.display = 'none';
        document.getElementById('generationStatus').style.display = 'none';
        document.getElementById('documentReady').style.display = 'none';

        // Show current step
        switch (step) {
            case 'selection':
                document.getElementById('documentSelection').style.display = 'block';
                break;
            case 'questions':
                document.getElementById('questionForm').style.display = 'block';
                break;
            case 'generating':
                document.getElementById('generationStatus').style.display = 'block';
                break;
            case 'ready':
                document.getElementById('documentReady').style.display = 'block';
                break;
        }

        this.currentStep = step;
    }

    addMessage(sender, content) {
        const messagesContainer = document.getElementById('copilotMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message`;

        if (sender === 'april') {
            messageDiv.innerHTML = `
                <div class="april-avatar">
                    <span>👩‍💼</span>
                </div>
                <div class="message-content">
                    <p>${content}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content user-content">
                    <p>${content}</p>
                </div>
            `;
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showNewDocumentOptions() {
        document.getElementById('newDocOptions').style.display = 'block';
        document.getElementById('uploadSection').style.display = 'none';
    }

    showUploadSection() {
        document.getElementById('newDocOptions').style.display = 'none';
        document.getElementById('uploadSection').style.display = 'block';
    }

    resetInterface() {
        this.currentConversation = null;
        this.currentStep = 'initial';
        
        // Clear messages except the first one
        const messagesContainer = document.getElementById('copilotMessages');
        const firstMessage = messagesContainer.querySelector('.april-message');
        messagesContainer.innerHTML = '';
        messagesContainer.appendChild(firstMessage);

        // Reset to document selection
        document.getElementById('newDocOptions').style.display = 'none';
        document.getElementById('uploadSection').style.display = 'none';
        this.showStep('selection');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const copilot = new AICopilotController();
    
    // Add CSS for the interface
    const style = document.createElement('style');
    style.textContent = `
        .copilot-interface {
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

        .copilot-interface.hidden {
            display: none;
        }

        .copilot-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
        }

        .copilot-modal {
            position: relative;
            background: white;
            border-radius: 15px;
            width: 90%;
            max-width: 800px;
            height: 80vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .copilot-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, #000 0%, #333 100%);
            color: white;
            border-radius: 15px 15px 0 0;
        }

        .copilot-header h2 {
            margin: 0;
            color: #FFD700;
        }

        .copilot-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 5px;
        }

        .copilot-body {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .copilot-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            max-height: 300px;
        }

        .april-message, .user-message {
            display: flex;
            margin-bottom: 15px;
            align-items: flex-start;
            gap: 10px;
        }

        .user-message {
            justify-content: flex-end;
        }

        .april-avatar {
            width: 40px;
            height: 40px;
            background: #FFD700;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }

        .message-content {
            background: #f5f5f5;
            padding: 12px 16px;
            border-radius: 12px;
            max-width: 70%;
            line-height: 1.5;
        }

        .user-content {
            background: #FFD700;
            color: #000;
        }

        .copilot-input-area {
            padding: 20px;
            border-top: 1px solid #eee;
            background: #fafafa;
        }

        .action-options {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin: 20px 0;
        }

        .action-option {
            background: white;
            border: 2px solid #eee;
            border-radius: 12px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s;
            text-align: left;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .action-option:hover {
            border-color: #FFD700;
            background: #fffbf0;
            transform: translateY(-2px);
        }

        .action-option.primary-action {
            border-color: #FFD700;
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            color: #000;
        }

        .action-option.primary-action:hover {
            background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
            transform: translateY(-3px);
            box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);
        }

        .action-icon {
            font-size: 2rem;
            min-width: 50px;
        }

        .action-name {
            font-weight: 600;
            font-size: 1.1rem;
            display: block;
            margin-bottom: 5px;
        }

        .action-desc {
            font-size: 0.9rem;
            color: #666;
            display: block;
            line-height: 1.4;
        }

        .action-option.primary-action .action-desc {
            color: #333;
        }

        .document-options {
            margin-top: 20px;
        }

        .doc-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 10px;
            margin-top: 15px;
        }

        .doc-option {
            background: white;
            border: 2px solid #eee;
            border-radius: 10px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.3s;
            text-align: center;
        }

        .doc-option:hover {
            border-color: #FFD700;
            background: #fffbf0;
        }

        .doc-icon {
            font-size: 1.5rem;
            display: block;
            margin-bottom: 8px;
        }

        .doc-name {
            font-weight: 600;
            display: block;
            margin-bottom: 4px;
        }

        .doc-time {
            font-size: 0.8rem;
            color: #666;
        }

        .question-item {
            margin-bottom: 20px;
        }

        .question-item label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
        }

        .question-item input,
        .question-item textarea,
        .question-item select {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s;
        }

        .question-item input:focus,
        .question-item textarea:focus,
        .question-item select:focus {
            outline: none;
            border-color: #FFD700;
        }

        .form-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 20px;
        }

        .generation-status {
            text-align: center;
            padding: 40px 20px;
        }

        .progress-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #FFD700;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: #eee;
            border-radius: 4px;
            margin: 20px 0;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(45deg, #FFD700, #FFA500);
            transition: width 0.3s ease;
        }

        .document-ready {
            text-align: center;
            padding: 40px 20px;
        }

        .success-icon {
            font-size: 3rem;
            margin-bottom: 20px;
        }

        .download-options {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin: 20px 0;
            flex-wrap: wrap;
        }

        .next-steps {
            text-align: left;
            background: #f9f9f9;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }

        .next-steps ul {
            margin: 10px 0;
            padding-left: 20px;
        }

        .next-steps li {
            margin-bottom: 5px;
        }

        @media (max-width: 768px) {
            .copilot-modal {
                width: 95%;
                height: 90vh;
            }

            .document-options {
                grid-template-columns: 1fr;
            }

            .download-options {
                flex-direction: column;
                align-items: center;
            }
        }
    `;
    document.head.appendChild(style);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AICopilotController;
}