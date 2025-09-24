// ============================================================
// Authentication System - Daily Tasks
// ============================================================

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('dailyTasks_users') || '[]');
        this.init();
    }

    init() {
        // Check if user is already logged in
        const savedSession = localStorage.getItem('dailyTasks_session');
        if (savedSession) {
            const sessionData = JSON.parse(savedSession);
            if (this.isValidSession(sessionData)) {
                this.currentUser = sessionData.user;
                this.redirectToApp();
                return;
            }
        }

        this.setupEventListeners();
        this.showScreen('login');
    }

    setupEventListeners() {
        // Navigation between screens
        document.getElementById('show-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.showScreen('register');
        });

        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showScreen('login');
        });

        document.getElementById('forgot-password-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.showScreen('recovery');
        });

        document.getElementById('back-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showScreen('login');
        });

        // Form submissions
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        document.getElementById('recovery-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePasswordRecovery();
        });
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.auth-container').forEach(screen => {
            screen.classList.add('hidden');
        });

        // Show selected screen
        document.getElementById(`${screenName}-screen`).classList.remove('hidden');

        // Clear any messages
        this.clearMessages();
    }

    showMessage(message, type = 'error') {
        this.clearMessages();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i>
            ${message}
        `;

        // Insert at the beginning of the active form
        const activeForm = document.querySelector('.auth-container:not(.hidden) .auth-form');
        activeForm.insertBefore(messageDiv, activeForm.firstChild);
    }

    clearMessages() {
        document.querySelectorAll('.message').forEach(msg => msg.remove());
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters');
            return;
        }

        // Show loading state
        const submitBtn = document.querySelector('#login-form .auth-btn');
        this.setLoading(submitBtn, true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Find user (in real app, this would be server-side)
        const user = this.users.find(u => u.email === email);
        
        if (!user || user.password !== password) {
            this.showMessage('Invalid email or password');
            this.setLoading(submitBtn, false);
            return;
        }

        // Successful login
        this.currentUser = { ...user };
        delete this.currentUser.password; // Remove password from session data

        // Save session
        const sessionData = {
            user: this.currentUser,
            timestamp: Date.now(),
            expires: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
        };
        localStorage.setItem('dailyTasks_session', JSON.stringify(sessionData));

        this.setLoading(submitBtn, false);
        this.showMessage('Welcome back! Redirecting...', 'success');

        // Redirect to main app
        setTimeout(() => {
            this.redirectToApp();
        }, 1000);
    }

    async handleRegister() {
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;

        if (!name || name.length < 2) {
            this.showMessage('Please enter your full name (minimum 2 characters)');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match');
            return;
        }

        // Check if user already exists
        if (this.users.some(u => u.email === email)) {
            this.showMessage('An account with this email already exists');
            return;
        }

        // Show loading state
        const submitBtn = document.querySelector('#register-form .auth-btn');
        this.setLoading(submitBtn, true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password, // In real app, this would be hashed
            createdAt: new Date().toISOString(),
            tasks: []
        };

        this.users.push(newUser);
        localStorage.setItem('dailyTasks_users', JSON.stringify(this.users));

        this.setLoading(submitBtn, false);
        this.showMessage('Account created successfully! You can now sign in.', 'success');

        // Switch to login screen after delay
        setTimeout(() => {
            this.showScreen('login');
            document.getElementById('login-email').value = email;
        }, 2000);
    }

    async handlePasswordRecovery() {
        const email = document.getElementById('recovery-email').value.trim();

        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address');
            return;
        }

        // Show loading state
        const submitBtn = document.querySelector('#recovery-form .auth-btn');
        this.setLoading(submitBtn, true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Check if user exists (in real app, send email regardless for security)
        const userExists = this.users.some(u => u.email === email);

        this.setLoading(submitBtn, false);

        if (userExists) {
            this.showMessage('Password reset instructions have been sent to your email.', 'success');
        } else {
            this.showMessage('If an account with this email exists, you will receive reset instructions.', 'success');
        }

        // In a real app, you would send an email with a reset link
        // For demo purposes, we'll just show the success message
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setLoading(button, isLoading) {
        const icon = button.querySelector('i');
        
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
            icon.className = 'fas fa-spinner';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            // Restore original icon based on button's parent form
            const formId = button.closest('form').id;
            switch (formId) {
                case 'login-form':
                    icon.className = 'fas fa-sign-in-alt';
                    break;
                case 'register-form':
                    icon.className = 'fas fa-user-plus';
                    break;
                case 'recovery-form':
                    icon.className = 'fas fa-paper-plane';
                    break;
            }
        }
    }

    isValidSession(sessionData) {
        return sessionData && 
               sessionData.user && 
               sessionData.expires > Date.now();
    }

    redirectToApp() {
        window.location.href = 'index.html';
    }

    // Static method to get current user (for use in main app)
    static getCurrentUser() {
        const savedSession = localStorage.getItem('dailyTasks_session');
        if (savedSession) {
            const sessionData = JSON.parse(savedSession);
            if (sessionData && sessionData.expires > Date.now()) {
                return sessionData.user;
            }
        }
        return null;
    }

    // Static method to logout
    static logout() {
        localStorage.removeItem('dailyTasks_session');
        window.location.href = 'auth.html';
    }
}

// Initialize authentication system
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

// Export for use in other modules
window.AuthManager = AuthManager;