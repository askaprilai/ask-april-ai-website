// ChatGPT-Style Member Workspace Controller
class MemberWorkspaceController {
    constructor() {
        this.apiBaseUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:3002/api/copilot'
            : '/api/copilot';
        this.currentConversation = null;
        this.isGenerating = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeInterface();
    }

    setupEventListeners() {
        // New chat button
        document.getElementById('newChatBtn').addEventListener('click', () => {
            this.startNewChat();
        });

        // Suggestion cards
        document.querySelectorAll('.suggestion-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const suggestion = e.currentTarget.getAttribute('data-suggestion');
                this.startChatWithSuggestion(suggestion);
            });
        });

        // Chat input
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');

        chatInput.addEventListener('input', () => {
            this.handleInputChange();
        });

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        // Attachment button
        document.getElementById('attachmentBtn').addEventListener('click', () => {
            this.toggleUploadZone();
        });

        // File input
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files[0]);
        });

        // Chat items in sidebar
        document.querySelectorAll('.chat-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.switchToChat(e.currentTarget);
            });
        });

        // Drag and drop for upload
        this.setupDragAndDrop();
        
        // Upload option in welcome screen
        const uploadOption = document.getElementById('uploadOption');
        if (uploadOption) {
            uploadOption.addEventListener('click', () => {
                this.triggerFileUpload();
            });
        }
        
        // Create new option in welcome screen
        const createNewOption = document.getElementById('createNewOption');
        if (createNewOption) {
            createNewOption.addEventListener('click', () => {
                this.showDocumentTypes();
            });
        }
    }

    initializeInterface() {
        // Show welcome screen by default
        this.showWelcomeScreen();
        
        // Auto-resize textarea
        this.setupAutoResize();
    }

    setupAutoResize() {
        const textarea = document.getElementById('chatInput');
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }

    handleInputChange() {
        const input = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        
        sendBtn.disabled = !input.value.trim() || this.isGenerating;
    }

    startNewChat() {
        // Reset to welcome screen
        this.showWelcomeScreen();
        
        // Clear current conversation
        this.currentConversation = null;
        
        // Update sidebar
        document.querySelectorAll('.chat-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Clear input
        document.getElementById('chatInput').value = '';
        this.handleInputChange();
    }

    startChatWithSuggestion(suggestion) {
        // Hide welcome screen and show chat
        this.showChatInterface();
        
        // Add user message
        this.addMessage('user', suggestion);
        
        // Clear input and add suggestion
        document.getElementById('chatInput').value = '';
        this.handleInputChange();
        
        // Process the suggestion
        this.processUserMessage(suggestion);
    }

    async sendMessage() {
        if (this.isGenerating) return;
        
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Show chat interface if not already shown
        this.showChatInterface();
        
        // Add user message
        this.addMessage('user', message);
        
        // Clear input
        input.value = '';
        input.style.height = 'auto';
        this.handleInputChange();
        
        // Process message
        await this.processUserMessage(message);
    }

    async processUserMessage(message) {
        this.isGenerating = true;
        this.handleInputChange();
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate AI processing
        await this.simulateAIResponse(message);
        
        this.isGenerating = false;
        this.handleInputChange();
    }

    async simulateAIResponse(userMessage) {
        // Remove typing indicator after a delay
        setTimeout(() => {
            this.removeTypingIndicator();
            
            // Determine response based on message content
            let response = this.generateAIResponse(userMessage);
            
            // Add AI response
            this.addMessage('ai', response.message);
            
            // If this triggers document generation, show modal
            if (response.action === 'generate_document') {
                setTimeout(() => {
                    this.startDocumentGeneration(response.documentType);
                }, 1000);
            }
        }, 1500 + Math.random() * 1000); // Random delay for realism
    }

    generateAIResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Document type detection
        if (message.includes('employee handbook') || message.includes('handbook')) {
            return {
                message: "I'll help you create a comprehensive employee handbook! This will include all the essential policies and procedures your team needs. Let me gather some information about your business first.\n\nWhat's the name of your business?",
                action: 'generate_document',
                documentType: 'employee-handbook'
            };
        }
        
        if (message.includes('training program') || message.includes('training')) {
            return {
                message: "Great! I'll help you design an effective training program. This will be customized for your industry and specific needs.\n\nWhat type of training are you looking to create? (e.g., customer service, onboarding, safety)",
                action: 'generate_document',
                documentType: 'training-program'
            };
        }
        
        if (message.includes('performance review') || message.includes('review')) {
            return {
                message: "Perfect! I'll create a fair and effective performance review system for you. This will include evaluation criteria, goal-setting frameworks, and development planning.\n\nWhat industry is your business in?",
                action: 'generate_document',
                documentType: 'performance-review'
            };
        }
        
        if (message.includes('safety policy') || message.includes('safety')) {
            return {
                message: "Safety first! I'll help you create a comprehensive safety policy that ensures workplace safety and regulatory compliance.\n\nWhat type of workplace do you need safety policies for?",
                action: 'generate_document',
                documentType: 'safety-policy'
            };
        }
        
        if (message.includes('policy') || message.includes('procedure')) {
            return {
                message: "I can help you create professional policies and procedures. These are essential for consistent operations and legal compliance.\n\nWhat specific policy would you like to create?",
                action: 'generate_document',
                documentType: 'policy-document'
            };
        }
        
        // General helpful responses
        return {
            message: "I can help you create professional leadership documents including employee handbooks, training programs, performance reviews, safety policies, and more. What would you like to work on today?",
            action: 'continue_chat'
        };
    }

    showWelcomeScreen() {
        document.getElementById('welcomeScreen').style.display = 'flex';
        document.getElementById('chatMessages').style.display = 'none';
    }

    showChatInterface() {
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('chatMessages').style.display = 'flex';
    }

    addMessage(sender, content) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        if (sender === 'ai') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="aprilb.png" alt="April AI">
                </div>
                <div class="message-content">
                    <p>${content}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="user-avatar-placeholder">J</div>
                <div class="message-content">
                    <p>${content}</p>
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai typing-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <img src="aprilb.png" alt="April AI">
            </div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    removeTypingIndicator() {
        const typingMessage = document.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }

    toggleUploadZone() {
        const uploadZone = document.getElementById('uploadZone');
        const isVisible = uploadZone.style.display !== 'none';
        
        uploadZone.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            this.addMessage('ai', 'Please upload your document and I\'ll help you improve it! I can work with PDF, Word, HTML, or text files.');
        }
    }

    setupDragAndDrop() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');
        
        // Handle upload zone clicks
        uploadZone.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Handle drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });
    }

    handleFileUpload(file) {
        if (!file) return;
        
        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/html'];
        
        if (!allowedTypes.includes(file.type)) {
            this.addMessage('ai', 'Sorry, I can only work with PDF, Word, HTML, or text files. Please upload a supported file type.');
            return;
        }
        
        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            this.addMessage('ai', 'The file is too large. Please upload a file smaller than 10MB.');
            return;
        }
        
        // Hide upload zone
        document.getElementById('uploadZone').style.display = 'none';
        
        // Show chat interface
        this.showChatInterface();
        
        // Add user message about file upload
        this.addMessage('user', `📎 Uploaded: ${file.name}`);
        
        // Process file upload
        this.processFileUpload(file);
    }

    async processFileUpload(file) {
        this.isGenerating = true;
        this.handleInputChange();
        
        this.showTypingIndicator();
        
        // Simulate file processing
        setTimeout(() => {
            this.removeTypingIndicator();
            
            const response = `I've analyzed your document "${file.name}". I can help you improve it by:

• Enhancing clarity and readability
• Adding missing policy sections
• Ensuring legal compliance
• Updating language and formatting
• Adding industry-specific best practices

Would you like me to create an improved version of your document?`;
            
            this.addMessage('ai', response);
            
            this.isGenerating = false;
            this.handleInputChange();
            
            // After a moment, ask for confirmation
            setTimeout(() => {
                this.addMessage('ai', 'Just say "yes" or "improve it" and I\'ll get started!');
            }, 2000);
            
        }, 2000 + Math.random() * 1000);
    }

    async startDocumentGeneration(documentType) {
        // Show generation modal
        this.showGenerationModal();
        
        // Simulate document generation progress
        this.simulateDocumentGeneration();
    }

    showGenerationModal() {
        const modal = document.getElementById('generationModal');
        modal.style.display = 'flex';
        
        // Reset progress
        document.getElementById('generationProgressFill').style.width = '0%';
        document.getElementById('generationProgressText').textContent = '0% complete';
        
        // Reset steps
        document.querySelectorAll('.gen-step').forEach(step => {
            step.classList.remove('active', 'completed');
        });
        document.querySelector('.gen-step').classList.add('active');
    }

    simulateDocumentGeneration() {
        let progress = 0;
        let currentStep = 0;
        const steps = document.querySelectorAll('.gen-step');
        const progressFill = document.getElementById('generationProgressFill');
        const progressText = document.getElementById('generationProgressText');
        
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5; // 5-20% per interval
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Complete all steps
                steps.forEach(step => {
                    step.classList.remove('active');
                    step.classList.add('completed');
                });
                
                // Show document ready after a brief delay
                setTimeout(() => {
                    this.showDocumentReady();
                }, 1000);
            }
            
            // Update progress bar
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}% complete`;
            
            // Update current step
            const newStep = Math.floor((progress / 100) * steps.length);
            if (newStep > currentStep && newStep < steps.length) {
                steps[currentStep].classList.remove('active');
                steps[currentStep].classList.add('completed');
                steps[newStep].classList.add('active');
                currentStep = newStep;
            }
        }, 800);
    }

    showDocumentReady() {
        // Hide generation modal
        document.getElementById('generationModal').style.display = 'none';
        
        // Show document ready modal
        const readyModal = document.getElementById('documentReadyModal');
        readyModal.style.display = 'flex';
        
        // Setup download buttons
        this.setupDownloadButtons();
        
        // Add message to chat
        this.addMessage('ai', '🎉 Your document is ready! You can download it in multiple formats. I\'ve also added it to your document library for future reference.');
    }

    setupDownloadButtons() {
        // Remove any existing listeners first
        const downloadPdf = document.getElementById('downloadPdf');
        const downloadWord = document.getElementById('downloadWord');
        const downloadHtml = document.getElementById('downloadHtml');
        const previewDoc = document.getElementById('previewDoc');
        const createAnother = document.getElementById('createAnotherDoc');
        const saveToLibrary = document.getElementById('saveToLibrary');

        if (downloadPdf) {
            downloadPdf.addEventListener('click', () => {
                this.downloadDocument('pdf');
            });
        }
        
        if (downloadWord) {
            downloadWord.addEventListener('click', () => {
                this.downloadDocument('docx');
            });
        }
        
        if (downloadHtml) {
            downloadHtml.addEventListener('click', () => {
                this.downloadDocument('html');
            });
        }
        
        if (previewDoc) {
            previewDoc.addEventListener('click', () => {
                this.previewDocument();
            });
        }
        
        if (createAnother) {
            createAnother.addEventListener('click', () => {
                document.getElementById('documentReadyModal').style.display = 'none';
                this.startNewChat();
            });
        }
        
        if (saveToLibrary) {
            saveToLibrary.addEventListener('click', () => {
                document.getElementById('documentReadyModal').style.display = 'none';
                this.addMessage('ai', '✅ Document saved to your library! You can access it anytime from the sidebar. Would you like to create another document?');
            });
        }
    }

    downloadDocument(format) {
        // Create sample document content
        const documentContent = this.generateSampleDocument(format);
        
        // Create download blob
        let blob, filename;
        
        if (format === 'pdf') {
            // For PDF, we'd normally generate actual PDF content
            blob = new Blob([documentContent], { type: 'application/pdf' });
            filename = 'employee-handbook.pdf';
        } else if (format === 'docx') {
            // For Word, we'd normally generate actual DOCX content
            blob = new Blob([documentContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            filename = 'employee-handbook.docx';
        } else if (format === 'html') {
            blob = new Blob([documentContent], { type: 'text/html' });
            filename = 'employee-handbook.html';
        }
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        // Show notification
        this.showNotification(`✅ Downloaded ${filename} successfully!`, 'success');
        
        // Add to chat
        setTimeout(() => {
            this.addMessage('ai', `Your document has been downloaded as ${format.toUpperCase()}! Check your Downloads folder. Need any changes or want to create another document?`);
        }, 1000);
    }

    generateSampleDocument(format) {
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Handbook - Sample Business</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        h1 { color: #000; border-bottom: 3px solid #059669; padding-bottom: 10px; }
        h2 { color: #333; margin-top: 30px; }
        .header { text-align: center; margin-bottom: 40px; }
        .section { margin-bottom: 30px; padding: 20px; border-left: 4px solid #059669; background: #f8fdf9; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Employee Handbook</h1>
        <p>Sample Business - Generated on ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div class="section">
        <h2>Welcome Message</h2>
        <p>Welcome to Sample Business! We're excited to have you join our team. This handbook will guide you through our policies, procedures, and expectations to help you succeed in your role.</p>
    </div>
    
    <div class="section">
        <h2>Company Overview</h2>
        <p>Sample Business is dedicated to providing excellent service to our customers. We believe in teamwork, excellence, and continuous improvement.</p>
    </div>
    
    <div class="section">
        <h2>Employment Policies</h2>
        <h3>Equal Opportunity Employment</h3>
        <p>Sample Business is an equal opportunity employer committed to creating an inclusive environment for all employees.</p>
        
        <h3>Work Schedule</h3>
        <p>Work schedules will be provided in advance and may vary based on business needs.</p>
        
        <h3>Performance Reviews</h3>
        <p>Regular performance evaluations will be conducted to support your professional development.</p>
    </div>
    
    <div class="section">
        <h2>Workplace Conduct</h2>
        <h3>Professional Behavior</h3>
        <p>All employees are expected to maintain professional conduct that reflects positively on Sample Business.</p>
        
        <h3>Communication</h3>
        <p>Clear, respectful communication is essential for our team's success.</p>
    </div>
    
    <div class="section">
        <h2>Safety and Security</h2>
        <h3>General Safety</h3>
        <p>The safety of our employees and customers is our top priority at Sample Business.</p>
        
        <h3>Emergency Procedures</h3>
        <p>All employees should be familiar with emergency exits and procedures.</p>
    </div>
    
    <div class="footer">
        <p>Document created with Ask April AI Co-Pilot</p>
        <p>This document should be reviewed by legal counsel before implementation</p>
    </div>
</body>
</html>`;

        if (format === 'html') {
            return htmlContent;
        } else {
            // For PDF and DOCX, return simplified text version
            return `EMPLOYEE HANDBOOK
Sample Business
Generated on ${new Date().toLocaleDateString()}

WELCOME MESSAGE
Welcome to Sample Business! We're excited to have you join our team. This handbook will guide you through our policies, procedures, and expectations to help you succeed in your role.

COMPANY OVERVIEW
Sample Business is dedicated to providing excellent service to our customers. We believe in teamwork, excellence, and continuous improvement.

EMPLOYMENT POLICIES

Equal Opportunity Employment
Sample Business is an equal opportunity employer committed to creating an inclusive environment for all employees.

Work Schedule
Work schedules will be provided in advance and may vary based on business needs.

Performance Reviews
Regular performance evaluations will be conducted to support your professional development.

WORKPLACE CONDUCT

Professional Behavior
All employees are expected to maintain professional conduct that reflects positively on Sample Business.

Communication
Clear, respectful communication is essential for our team's success.

SAFETY AND SECURITY

General Safety
The safety of our employees and customers is our top priority at Sample Business.

Emergency Procedures
All employees should be familiar with emergency exits and procedures.

---
Document created with Ask April AI Co-Pilot
This document should be reviewed by legal counsel before implementation`;
        }
    }

    previewDocument() {
        // Generate preview content
        const previewContent = this.generateSampleDocument('html');
        
        // Open in new window
        const previewWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
        previewWindow.document.write(previewContent);
        previewWindow.document.close();
        
        // Show notification
        this.showNotification('📖 Document preview opened in new window', 'info');
        
        // Add to chat
        setTimeout(() => {
            this.addMessage('ai', 'I\'ve opened a preview of your document in a new window. You can review it and let me know if you need any changes!');
        }, 1000);
    }

    switchToChat(chatItem) {
        // Update active state
        document.querySelectorAll('.chat-item').forEach(item => {
            item.classList.remove('active');
        });
        chatItem.classList.add('active');
        
        // Show chat interface
        this.showChatInterface();
        
        // Load chat messages (simulated)
        this.loadChatHistory(chatItem.querySelector('h4').textContent);
    }

    loadChatHistory(documentTitle) {
        // Clear current messages
        document.getElementById('chatMessages').innerHTML = '';
        
        // Add simulated conversation
        this.addMessage('user', `I need help with my ${documentTitle.toLowerCase()}`);
        this.addMessage('ai', `I'd be happy to help you with your ${documentTitle.toLowerCase()}! I can review it, make improvements, or help you create a new version. What would you like to do?`);
    }

    triggerFileUpload() {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.click();
        }
    }
    
    showDocumentTypes() {
        // Hide main actions and show document type selection
        const mainActions = document.querySelector('.main-actions');
        const documentTypes = document.getElementById('documentTypes');
        
        if (mainActions && documentTypes) {
            mainActions.style.display = 'none';
            documentTypes.style.display = 'block';
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
    // Add a small delay to ensure all elements are ready
    setTimeout(() => {
        const workspace = new MemberWorkspaceController();
        
        // Debug: Log if elements exist
        console.log('Upload option element:', document.getElementById('uploadOption'));
        console.log('Create new option element:', document.getElementById('createNewOption'));
        console.log('File input element:', document.getElementById('fileInput'));
    }, 100);
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 80px;
            right: 20px;
            background: white;
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 16px 20px;
            z-index: 10001;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        }

        .notification.show {
            transform: translateX(0);
        }

        .notification.error {
            border-left: 4px solid #ef4444;
        }

        .notification.success {
            border-left: 4px solid #10b981;
        }

        .notification.info {
            border-left: 4px solid #3b82f6;
        }

        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .notification-icon {
            font-size: 1.1rem;
            flex-shrink: 0;
        }

        .notification-message {
            font-weight: 500;
            color: #374151;
            line-height: 1.4;
            font-size: 0.875rem;
        }
    `;
    document.head.appendChild(style);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MemberWorkspaceController;
}