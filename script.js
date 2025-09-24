// ============================================================
// Daily Tasks App - Enhanced with Authentication
// ============================================================

class DailyTasksApp {
    constructor() {
        this.currentUser = null;
        this.tasks = [];
        this.weatherData = null;
        this.init();
    }

    init() {
        // Check authentication
        this.currentUser = AuthManager.getCurrentUser();
        if (!this.currentUser) {
            window.location.href = 'auth.html';
            return;
        }

        // Initialize DOM elements
        this.initializeElements();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load user data
        this.loadUserTasks();
        
        // Initialize weather and dynamic background
        this.initWeatherBackground();
        
        // Update UI
        this.updateUserDisplay();
        this.updateTaskCounts();
        this.updateEmptyState();
    }

    initializeElements() {
        // User elements
        this.userNameElement = document.getElementById('user-name');
        this.logoutBtn = document.getElementById('logout-btn');
        
        // Task lists
        this.pendingTasksList = document.getElementById('pending-tasks');
        this.completedTasksList = document.getElementById('completed-tasks');
        this.emptyState = document.getElementById('empty-state');
        
        // Counters
        this.pendingCount = document.getElementById('pending-count');
        this.completedCount = document.getElementById('completed-count');
        
        // Progress elements (keeping existing functionality)
        this.progressBar = document.getElementById('progress');
        this.progressNumbers = document.getElementById('numbers');
        this.progressMessage = document.getElementById('progress-message');
        
        // Modal elements
        this.floatingBtn = document.getElementById('floating-add-btn');
        this.taskModal = document.getElementById('task-modal');
        this.modalOverlay = document.getElementById('modal-overlay');
        this.closeModalBtn = document.getElementById('close-modal');
        this.taskForm = document.getElementById('task-form');
        this.cancelBtn = document.getElementById('cancel-task');
        
        // Form inputs
        this.taskNameInput = document.getElementById('task-name');
        this.taskDateInput = document.getElementById('task-date');
        this.taskEmojiSelect = document.getElementById('task-emoji');
        
        // Set default date to today
        this.taskDateInput.value = new Date().toISOString().split('T')[0];
    }

    setupEventListeners() {
        // Logout
        this.logoutBtn.addEventListener('click', () => {
            AuthManager.logout();
        });
        
        // Modal controls
        this.floatingBtn.addEventListener('click', () => this.openTaskModal());
        this.closeModalBtn.addEventListener('click', () => this.closeTaskModal());
        this.cancelBtn.addEventListener('click', () => this.closeTaskModal());
        this.modalOverlay.addEventListener('click', () => this.closeTaskModal());
        
        // Form submission
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });
        
        // Close modal with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.taskModal.classList.contains('hidden')) {
                this.closeTaskModal();
            }
        });
    }

    updateUserDisplay() {
        this.userNameElement.textContent = `Welcome, ${this.currentUser.name}!`;
    }

    openTaskModal() {
        this.taskModal.classList.remove('hidden');
        this.taskNameInput.focus();
        document.body.style.overflow = 'hidden';
    }

    closeTaskModal() {
        this.taskModal.classList.add('hidden');
        this.taskForm.reset();
        this.taskDateInput.value = new Date().toISOString().split('T')[0];
        document.body.style.overflow = 'auto';
    }

    async addTask() {
        const name = this.taskNameInput.value.trim();
        const date = this.taskDateInput.value;
        const emoji = this.taskEmojiSelect.value;

        if (!name) {
            alert('Please enter a task name');
            return;
        }

        const task = {
            id: Date.now().toString(),
            name,
            date,
            emoji,
            completed: false,
            createdAt: new Date().toISOString(),
            userId: this.currentUser.id
        };

        this.tasks.unshift(task); // Add to beginning of array
        this.saveUserTasks();
        this.renderTasks();
        this.updateTaskCounts();
        this.updateEmptyState();
        this.updateProgressBar();
        this.closeTaskModal();
        
        // Show success animation
        this.showTaskAddedAnimation();
    }

    showTaskAddedAnimation() {
        // Create a temporary success indicator
        const successMsg = document.createElement('div');
        successMsg.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(4, 252, 87, 0.9);
                color: white;
                padding: 15px 25px;
                border-radius: 15px;
                font-weight: bold;
                z-index: 3000;
                animation: slideInOut 2s ease-in-out forwards;
            ">
                <i class="fas fa-check-circle"></i> Task added successfully!
            </div>
        `;
        
        document.body.appendChild(successMsg);
        setTimeout(() => {
            if (successMsg.parentNode) {
                successMsg.parentNode.removeChild(successMsg);
            }
        }, 2000);
        
        // Add animation keyframes if not already added
        if (!document.querySelector('#taskSuccessAnimation')) {
            const style = document.createElement('style');
            style.id = 'taskSuccessAnimation';
            style.textContent = `
                @keyframes slideInOut {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    renderTasks() {
        // Clear existing tasks
        this.pendingTasksList.innerHTML = '';
        this.completedTasksList.innerHTML = '';

        // Separate tasks by completion status
        const pendingTasks = this.tasks.filter(task => !task.completed);
        const completedTasks = this.tasks.filter(task => task.completed);

        // Render pending tasks
        pendingTasks.forEach(task => {
            this.pendingTasksList.appendChild(this.createTaskElement(task));
        });

        // Render completed tasks
        completedTasks.forEach(task => {
            this.completedTasksList.appendChild(this.createTaskElement(task));
        });
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.taskId = task.id;

        const taskDate = new Date(task.date);
        const formattedDate = taskDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-content">
                <div class="task-header">
                    ${task.emoji ? `<span class="task-emoji">${task.emoji}</span>` : ''}
                    <span class="task-name">${task.name}</span>
                </div>
                <div class="task-date">
                    <i class="fas fa-calendar-alt"></i>
                    ${formattedDate}
                </div>
            </div>
            <div class="task-actions">
                <button class="edit-task-btn" title="Edit task" ${task.completed ? 'disabled' : ''}>
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-task-btn" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        // Add event listeners
        const checkbox = li.querySelector('.task-checkbox');
        const editBtn = li.querySelector('.edit-task-btn');
        const deleteBtn = li.querySelector('.delete-task-btn');

        checkbox.addEventListener('change', () => this.toggleTask(task.id));
        editBtn.addEventListener('click', () => this.editTask(task.id));
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

        return li;
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            
            this.saveUserTasks();
            this.renderTasks();
            this.updateTaskCounts();
            this.updateEmptyState();
            this.updateProgressBar();
            
            if (task.completed && this.tasks.filter(t => !t.completed).length === 0) {
                this.showCompletionAnimation();
            }
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && !task.completed) {
            // Pre-fill the form with current task data
            this.taskNameInput.value = task.name;
            this.taskDateInput.value = task.date;
            this.taskEmojiSelect.value = task.emoji || '';
            
            // Change form behavior to edit mode
            this.taskForm.dataset.editId = taskId;
            this.taskForm.querySelector('.btn-primary').innerHTML = '<i class="fas fa-save"></i> Update Task';
            
            // Open modal
            this.openTaskModal();
            
            // Override form submission for edit
            this.taskForm.onsubmit = (e) => {
                e.preventDefault();
                this.updateTask(taskId);
            };
        }
    }

    updateTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.name = this.taskNameInput.value.trim();
            task.date = this.taskDateInput.value;
            task.emoji = this.taskEmojiSelect.value;
            task.updatedAt = new Date().toISOString();
            
            this.saveUserTasks();
            this.renderTasks();
            this.closeTaskModal();
            
            // Reset form to add mode
            delete this.taskForm.dataset.editId;
            this.taskForm.querySelector('.btn-primary').innerHTML = '<i class="fas fa-plus"></i> Create Task';
            this.taskForm.onsubmit = (e) => {
                e.preventDefault();
                this.addTask();
            };
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveUserTasks();
            this.renderTasks();
            this.updateTaskCounts();
            this.updateEmptyState();
            this.updateProgressBar();
        }
    }

    updateTaskCounts() {
        const pendingCount = this.tasks.filter(t => !t.completed).length;
        const completedCount = this.tasks.filter(t => t.completed).length;
        
        this.pendingCount.textContent = pendingCount;
        this.completedCount.textContent = completedCount;
    }

    updateEmptyState() {
        const hasAnyTasks = this.tasks.length > 0;
        this.emptyState.classList.toggle('hidden', hasAnyTasks);
    }

    // Existing progress bar functionality (enhanced)
    updateProgressBar() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(t => t.completed).length;

        // Calculate percentage
        const progressPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
        
        // Update progress bar
        this.progressBar.style.width = `${progressPercentage}%`;
        this.progressNumbers.textContent = totalTasks === 0 ? '0/0' : `${completedTasks}/${totalTasks}`;
        
        // Update progress message
        if (totalTasks === 0) {
            this.progressMessage.textContent = 'Add your first task!';
            this.progressMessage.style.color = '#fff';
        } else if (completedTasks === totalTasks) {
            this.progressMessage.innerHTML = '🎉 All tasks completed! Well done!';
            this.progressMessage.style.color = '#04fc57';
            this.progressMessage.style.textShadow = '0 0 10px rgba(4, 252, 87, 0.5)';
        } else if (completedTasks === 0) {
            this.progressMessage.textContent = `${totalTasks} task${totalTasks > 1 ? 's' : ''} waiting for you`;
            this.progressMessage.style.color = '#fff';
            this.progressMessage.style.textShadow = 'none';
        } else {
            const pendingTasks = totalTasks - completedTasks;
            this.progressMessage.textContent = `Great progress! ${pendingTasks} task${pendingTasks > 1 ? 's' : ''} remaining`;
            this.progressMessage.style.color = '#fff';
            this.progressMessage.style.textShadow = 'none';
        }
        
        // Save progress
        this.saveUserProgress(totalTasks, completedTasks, progressPercentage);
    }

    // Enhanced completion animation
    showCompletionAnimation() {
        // Create confetti container
        const confettiContainer = document.createElement('div');
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 1000;
        `;
        
        // Generate confetti particles
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#04fc57'][Math.floor(Math.random() * 6)]};
                left: ${Math.random() * 100}vw;
                animation: confetti-fall 3s linear forwards;
                border-radius: 50%;
            `;
            confettiContainer.appendChild(confetti);
        }
        
        document.body.appendChild(confettiContainer);
        
        // Remove after animation
        setTimeout(() => {
            if (confettiContainer.parentNode) {
                confettiContainer.parentNode.removeChild(confettiContainer);
            }
        }, 3000);
    }

    // Weather and dynamic background system
    async initWeatherBackground() {
        await this.getWeatherData();
        this.setWeatherBasedBackground();
        this.createWeatherWidget();
        this.addWeatherParticles();
    }

    async getWeatherData() {
        try {
            // Get user's location
            const position = await this.getUserLocation();
            
            // Use OpenWeatherMap API (free tier)
            const API_KEY = '8b8c3f4b5bb8e9c2e6b2c3d4e5f6a7b8'; // Demo key - replace with real one
            const { latitude, longitude } = position.coords;
            
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            
            if (response.ok) {
                this.weatherData = await response.json();
            } else {
                // Fallback weather data for demo
                this.weatherData = this.getFallbackWeatherData();
            }
        } catch (error) {
            console.log('Using demo weather data');
            this.weatherData = this.getFallbackWeatherData();
        }
    }

    getUserLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                resolve,
                () => reject(new Error('Location access denied')),
                { timeout: 10000 }
            );
        });
    }

    getFallbackWeatherData() {
        const weatherTypes = ['clear', 'clouds', 'rain', 'snow', 'thunder'];
        const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        
        return {
            weather: [{ main: randomWeather, description: `${randomWeather} sky` }],
            main: { temp: 22, feels_like: 25 },
            name: 'Demo City',
            sys: { sunrise: Date.now()/1000 - 3600, sunset: Date.now()/1000 + 3600 }
        };
    }

    setWeatherBasedBackground() {
        if (!this.weatherData) return;

        const body = document.body;
        const weatherMain = this.weatherData.weather[0].main.toLowerCase();
        const isNight = this.isNightTime();
        
        // Remove existing weather classes
        body.classList.remove('weather-clear', 'weather-clouds', 'weather-rain', 'weather-snow', 'weather-thunder', 'weather-night');
        
        if (isNight) {
            body.classList.add('weather-night');
        } else {
            switch (weatherMain) {
                case 'clear':
                    body.classList.add('weather-clear');
                    break;
                case 'clouds':
                    body.classList.add('weather-clouds');
                    break;
                case 'rain':
                case 'drizzle':
                    body.classList.add('weather-rain');
                    break;
                case 'snow':
                    body.classList.add('weather-snow');
                    break;
                case 'thunderstorm':
                    body.classList.add('weather-thunder');
                    break;
                default:
                    body.classList.add('weather-clouds');
            }
        }
    }

    isNightTime() {
        if (!this.weatherData.sys) return false;
        
        const now = Date.now() / 1000;
        const sunrise = this.weatherData.sys.sunrise;
        const sunset = this.weatherData.sys.sunset;
        
        return now < sunrise || now > sunset;
    }

    createWeatherWidget() {
        if (!this.weatherData) return;

        // Find or create weather widget container
        let weatherWidget = document.getElementById('weather-widget');
        if (!weatherWidget) {
            weatherWidget = document.createElement('div');
            weatherWidget.id = 'weather-widget';
            weatherWidget.className = 'weather-widget';
            
            // Insert after the user header
            const userHeader = document.querySelector('.user-header');
            if (userHeader) {
                userHeader.insertAdjacentElement('afterend', weatherWidget);
            }
        }

        const temp = Math.round(this.weatherData.main.temp);
        const weather = this.weatherData.weather[0].main;
        const description = this.weatherData.weather[0].description;
        const city = this.weatherData.name;

        const weatherIcons = {
            'clear': '☀️',
            'clouds': '☁️',
            'rain': '🌧️',
            'drizzle': '🌦️',
            'snow': '❄️',
            'thunderstorm': '⛈️',
            'mist': '🌫️',
            'fog': '🌫️'
        };

        weatherWidget.innerHTML = `
            <div class="weather-info">
                <span class="weather-icon">${weatherIcons[weather.toLowerCase()] || '☁️'}</span>
                <div class="weather-details">
                    <span class="temperature">${temp}°C</span>
                    <span class="weather-desc">${description}</span>
                </div>
                <span class="location">${city}</span>
            </div>
            <div class="weather-controls">
                <button class="weather-toggle" onclick="window.todoApp.toggleWeather()" title="Change Weather">
                    🔄
                </button>
            </div>
        `;
    }

    // Manual weather toggle for demonstration
    toggleWeather() {
        const weatherTypes = ['clear', 'clouds', 'rain', 'snow', 'thunder'];
        const currentIndex = weatherTypes.findIndex(type => 
            document.body.classList.contains(`weather-${type}`)
        );
        const nextIndex = (currentIndex + 1) % weatherTypes.length;
        const nextWeather = weatherTypes[nextIndex];

        // Update weather data
        this.weatherData.weather[0].main = nextWeather;
        this.weatherData.weather[0].description = `${nextWeather} sky`;

        // Update background and particles
        this.setWeatherBasedBackground();
        this.createWeatherWidget();
        this.addWeatherParticles();
    }

    addWeatherParticles() {
        if (!this.weatherData) return;

        const weatherMain = this.weatherData.weather[0].main.toLowerCase();
        
        // Remove existing particles
        const existingParticles = document.querySelector('.weather-particles');
        if (existingParticles) {
            existingParticles.remove();
        }

        const particleContainer = document.createElement('div');
        particleContainer.className = 'weather-particles';
        document.body.appendChild(particleContainer);

        switch (weatherMain) {
            case 'rain':
            case 'drizzle':
                this.createRainParticles(particleContainer);
                break;
            case 'snow':
                this.createSnowParticles(particleContainer);
                break;
        }
    }

    createRainParticles(container) {
        for (let i = 0; i < 50; i++) {
            const raindrop = document.createElement('div');
            raindrop.className = 'raindrop';
            raindrop.style.left = `${Math.random() * 100}vw`;
            raindrop.style.animationDelay = `${Math.random() * 2}s`;
            raindrop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
            container.appendChild(raindrop);
        }
    }

    createSnowParticles(container) {
        for (let i = 0; i < 30; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.style.left = `${Math.random() * 100}vw`;
            snowflake.style.animationDelay = `${Math.random() * 3}s`;
            snowflake.style.animationDuration = `${3 + Math.random() * 2}s`;
            snowflake.innerHTML = '❄';
            container.appendChild(snowflake);
        }
    }

    // Data persistence methods
    saveUserTasks() {
        const userData = {
            userId: this.currentUser.id,
            tasks: this.tasks,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(`dailyTasks_userData_${this.currentUser.id}`, JSON.stringify(userData));
    }

    loadUserTasks() {
        const savedData = localStorage.getItem(`dailyTasks_userData_${this.currentUser.id}`);
        if (savedData) {
            const userData = JSON.parse(savedData);
            this.tasks = userData.tasks || [];
        } else {
            this.tasks = [];
        }
        this.renderTasks();
    }

    saveUserProgress(total, completed, percentage) {
        const progressData = {
            total,
            completed,
            percentage,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(`dailyTasks_progress_${this.currentUser.id}`, JSON.stringify(progressData));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new DailyTasksApp();
});
