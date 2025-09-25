// ============================================================
// script.js
// ============================================================
// Lógica principal de la aplicación Daily Tasks.
// Este archivo gestiona la interfaz, las tareas del usuario, 
// la persistencia de datos, el sistema de clima y los efectos visuales.
// Incluye autenticación, creación, edición, eliminación y completado de tareas.
// También maneja la barra de progreso, animaciones y fondo dinámico.
// ============================================================

/**
 * Clase principal de la aplicación DailyTasksApp.
 * Controla toda la lógica de tareas, usuario, clima y UI.
 */
class DailyTasksApp {
    constructor() {
        // Usuario autenticado actualmente
        this.currentUser = null;

        // Lista de tareas del usuario
        this.tasks = [];

        // Datos del clima actual
        this.weatherData = null;

        // Inicializa la aplicación
        this.init();
    }

    /**
     * Inicializa la app:
     * - Verifica autenticación
     * - Inicializa elementos del DOM
     * - Configura eventos
     * - Carga tareas del usuario
     * - Inicializa clima y fondo dinámico
     * - Actualiza la UI
     */
    init() {
        // Verifica si el usuario está autenticado
        this.currentUser = AuthManager.getCurrentUser();
        if (!this.currentUser) {
            window.location.href = 'auth.html';
            return;
        }

        // Inicializa referencias a elementos del DOM
        this.initializeElements();

        // Configura los listeners de eventos
        this.setupEventListeners();

        // Carga las tareas del usuario desde localStorage
        this.loadUserTasks();

        // Inicializa el sistema de clima y fondo dinámico
        this.initWeatherBackground();

        // Actualiza la UI con los datos actuales
        this.updateUserDisplay();
        this.updateTaskCounts();
        this.updateEmptyState();
    }

    /**
     * Obtiene y guarda referencias a los elementos del DOM usados en la app.
     */
    initializeElements() {
        // Elementos de usuario
        this.userNameElement = document.getElementById('user-name');
        this.logoutBtn = document.getElementById('logout-btn');

        // Listas de tareas
        this.pendingTasksList = document.getElementById('pending-tasks');
        this.completedTasksList = document.getElementById('completed-tasks');
        this.emptyState = document.getElementById('empty-state');

        // Contadores de tareas
        this.pendingCount = document.getElementById('pending-count');
        this.completedCount = document.getElementById('completed-count');

        // Barra de progreso y mensajes
        this.progressBar = document.getElementById('progress');
        this.progressNumbers = document.getElementById('numbers');
        this.progressMessage = document.getElementById('progress-message');

        // Elementos del modal para agregar/editar tareas
        this.floatingBtn = document.getElementById('floating-add-btn');
        this.taskModal = document.getElementById('task-modal');
        this.modalOverlay = document.getElementById('modal-overlay');
        this.closeModalBtn = document.getElementById('close-modal');
        this.taskForm = document.getElementById('task-form');
        this.cancelBtn = document.getElementById('cancel-task');

        // Inputs del formulario de tareas
        this.taskNameInput = document.getElementById('task-name');
        this.taskDateInput = document.getElementById('task-date');
        this.taskEmojiSelect = document.getElementById('task-emoji');

        // Por defecto, la fecha es hoy
        this.taskDateInput.value = new Date().toISOString().split('T')[0];
    }

    /**
     * Configura los listeners de eventos para la UI.
     */
    setupEventListeners() {
        // Cerrar sesión
        this.logoutBtn.addEventListener('click', () => {
            AuthManager.logout();
        });

        // Abrir y cerrar el modal de tareas
        this.floatingBtn.addEventListener('click', () => this.openTaskModal());
        this.closeModalBtn.addEventListener('click', () => this.closeTaskModal());
        this.cancelBtn.addEventListener('click', () => this.closeTaskModal());
        this.modalOverlay.addEventListener('click', () => this.closeTaskModal());

        // Envío del formulario de tareas (agregar o editar)
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Cerrar modal con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.taskModal.classList.contains('hidden')) {
                this.closeTaskModal();
            }
        });
    }

    /**
     * Muestra el nombre del usuario autenticado en la UI.
     */
    updateUserDisplay() {
        this.userNameElement.textContent = `Welcome, ${this.currentUser.name}!`;
    }

    /**
     * Abre el modal para agregar o editar una tarea.
     */
    openTaskModal() {
        this.taskModal.classList.remove('hidden');
        this.taskNameInput.focus();
        document.body.style.overflow = 'hidden';
    }

    /**
     * Cierra el modal de tareas y resetea el formulario.
     */
    closeTaskModal() {
        this.taskModal.classList.add('hidden');
        this.taskForm.reset();
        this.taskDateInput.value = new Date().toISOString().split('T')[0];
        document.body.style.overflow = 'auto';
    }

    /**
     * Agrega una nueva tarea a la lista del usuario.
     * Valida los campos y actualiza la UI y el almacenamiento.
     */
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

        this.tasks.unshift(task); // Agrega al inicio del array
        this.saveUserTasks();
        this.renderTasks();
        this.updateTaskCounts();
        this.updateEmptyState();
        this.updateProgressBar();
        this.closeTaskModal();

        // Muestra animación de éxito
        this.showTaskAddedAnimation();
    }

    /**
     * Muestra una animación temporal cuando se agrega una tarea.
     */
    showTaskAddedAnimation() {
        // Crea un mensaje de éxito temporal
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

        // Agrega animación CSS si no existe
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

    /**
     * Renderiza todas las tareas en la UI, separando pendientes y completadas.
     */
    renderTasks() {
        // Limpia las listas actuales
        this.pendingTasksList.innerHTML = '';
        this.completedTasksList.innerHTML = '';

        // Separa tareas por estado
        const pendingTasks = this.tasks.filter(task => !task.completed);
        const completedTasks = this.tasks.filter(task => task.completed);

        // Renderiza tareas pendientes
        pendingTasks.forEach(task => {
            this.pendingTasksList.appendChild(this.createTaskElement(task));
        });

        // Renderiza tareas completadas
        completedTasks.forEach(task => {
            this.completedTasksList.appendChild(this.createTaskElement(task));
        });
    }

    /**
     * Crea el elemento HTML de una tarea, con sus botones y eventos.
     * @param {object} task - Objeto de tarea.
     * @returns {HTMLElement} - Elemento <li> de la tarea.
     */
    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.taskId = task.id;

        // Formatea la fecha de la tarea
        const taskDate = new Date(task.date);
        const formattedDate = taskDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

        // Estructura HTML de la tarea
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

        // Listeners de los botones de la tarea
        const checkbox = li.querySelector('.task-checkbox');
        const editBtn = li.querySelector('.edit-task-btn');
        const deleteBtn = li.querySelector('.delete-task-btn');

        checkbox.addEventListener('change', () => this.toggleTask(task.id));
        editBtn.addEventListener('click', () => this.editTask(task.id));
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

        return li;
    }

    /**
     * Marca una tarea como completada o pendiente.
     * Actualiza la UI y muestra animación si todas están completas.
     * @param {string} taskId - ID de la tarea.
     */
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

            // Si todas las tareas están completas, muestra animación de celebración
            if (task.completed && this.tasks.filter(t => !t.completed).length === 0) {
                this.showCompletionAnimation();
            }
        }
    }

    /**
     * Permite editar una tarea pendiente.
     * Prellena el formulario y cambia el modo del modal a edición.
     * @param {string} taskId - ID de la tarea.
     */
    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && !task.completed) {
            // Prellena el formulario con los datos actuales
            this.taskNameInput.value = task.name;
            this.taskDateInput.value = task.date;
            this.taskEmojiSelect.value = task.emoji || '';

            // Cambia el formulario a modo edición
            this.taskForm.dataset.editId = taskId;
            this.taskForm.querySelector('.btn-primary').innerHTML = '<i class="fas fa-save"></i> Update Task';

            // Abre el modal
            this.openTaskModal();

            // Cambia el evento submit para actualizar la tarea
            this.taskForm.onsubmit = (e) => {
                e.preventDefault();
                this.updateTask(taskId);
            };
        }
    }

    /**
     * Actualiza una tarea existente con los nuevos datos del formulario.
     * @param {string} taskId - ID de la tarea.
     */
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

            // Restaura el formulario a modo agregar
            delete this.taskForm.dataset.editId;
            this.taskForm.querySelector('.btn-primary').innerHTML = '<i class="fas fa-plus"></i> Create Task';
            this.taskForm.onsubmit = (e) => {
                e.preventDefault();
                this.addTask();
            };
        }
    }

    /**
     * Elimina una tarea después de confirmar con el usuario.
     * @param {string} taskId - ID de la tarea.
     */
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

    /**
     * Actualiza los contadores de tareas pendientes y completadas en la UI.
     */
    updateTaskCounts() {
        const pendingCount = this.tasks.filter(t => !t.completed).length;
        const completedCount = this.tasks.filter(t => t.completed).length;

        this.pendingCount.textContent = pendingCount;
        this.completedCount.textContent = completedCount;
    }

    /**
     * Muestra u oculta el estado vacío según si hay tareas.
     */
    updateEmptyState() {
        const hasAnyTasks = this.tasks.length > 0;
        this.emptyState.classList.toggle('hidden', hasAnyTasks);
    }

    /**
     * Actualiza la barra de progreso y el mensaje según el avance.
     */
    updateProgressBar() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(t => t.completed).length;

        // Calcula el porcentaje de progreso
        const progressPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

        // Actualiza la barra y los números
        this.progressBar.style.width = `${progressPercentage}%`;
        this.progressNumbers.textContent = totalTasks === 0 ? '0/0' : `${completedTasks}/${totalTasks}`;

        // Mensaje según el avance
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

        // Guarda el progreso en localStorage
        this.saveUserProgress(totalTasks, completedTasks, progressPercentage);
    }

    /**
     * Muestra una animación de confeti cuando todas las tareas están completas.
     */
    showCompletionAnimation() {
        // Crea un contenedor de confeti
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

        // Genera partículas de confeti
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

        // Elimina el confeti después de la animación
        setTimeout(() => {
            if (confettiContainer.parentNode) {
                confettiContainer.parentNode.removeChild(confettiContainer);
            }
        }, 3000);
    }

    // =====================
    // SISTEMA DE CLIMA Y FONDO
    // =====================

    /**
     * Inicializa el sistema de clima y fondo dinámico.
     */
    async initWeatherBackground() {
        await this.getWeatherData();
        this.setWeatherBasedBackground();
        this.createWeatherWidget();
        this.addWeatherParticles();
    }

    /**
     * Obtiene los datos del clima usando la ubicación del usuario o datos de demo.
     */
    async getWeatherData() {
        try {
            // Obtiene la ubicación del usuario
            const position = await this.getUserLocation();

            // Usa la API de OpenWeatherMap (clave demo)
            const API_KEY = '8b8c3f4b5bb8e9c2e6b2c3d4e5f6a7b8'; // Demo key
            const { latitude, longitude } = position.coords;

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );

            if (response.ok) {
                this.weatherData = await response.json();
            } else {
                // Si falla, usa datos de demo
                this.weatherData = this.getFallbackWeatherData();
            }
        } catch (error) {
            console.log('Using demo weather data');
            this.weatherData = this.getFallbackWeatherData();
        }

        // Asegura que siempre haya datos de clima
        if (!this.weatherData) {
            this.weatherData = this.getFallbackWeatherData();
        }
    }

    /**
     * Obtiene la ubicación del usuario usando la API de geolocalización.
     * @returns {Promise<GeolocationPosition>}
     */
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

    /**
     * Devuelve datos de clima aleatorios para modo demo.
     */
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

    /**
     * Cambia la clase del body según el clima para mostrar el fondo adecuado.
     */
    setWeatherBasedBackground() {
        if (!this.weatherData) return;

        const body = document.body;
        const weatherMain = this.weatherData.weather[0].main.toLowerCase();
        const isNight = this.isNightTime();

        // Elimina clases anteriores
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

    /**
     * Determina si es de noche según los datos del clima.
     * @returns {boolean}
     */
    isNightTime() {
        if (!this.weatherData.sys) return false;

        const now = Date.now() / 1000;
        const sunrise = this.weatherData.sys.sunrise;
        const sunset = this.weatherData.sys.sunset;

        return now < sunrise || now > sunset;
    }

    /**
     * Crea el widget visual del clima en la interfaz.
     */
    createWeatherWidget() {
        if (!this.weatherData) return;

        // Busca o crea el contenedor del widget
        let weatherWidget = document.getElementById('weather-widget');
        if (!weatherWidget) {
            weatherWidget = document.createElement('div');
            weatherWidget.id = 'weather-widget';
            weatherWidget.className = 'weather-widget';

            // Inserta después del encabezado de usuario
            const userHeader = document.querySelector('.user-header');
            if (userHeader) {
                userHeader.insertAdjacentElement('afterend', weatherWidget);
            }
        }

        const temp = Math.round(this.weatherData.main.temp);
        const weather = this.weatherData.weather[0].main;
        const description = this.weatherData.weather[0].description;
        const city = this.weatherData.name;

        // Iconos de clima según el tipo
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

    /**
     * Permite cambiar el clima manualmente (para demo).
     */
    toggleWeather() {
        const weatherTypes = ['clear', 'clouds', 'rain', 'snow', 'thunder'];
        const currentIndex = weatherTypes.findIndex(type =>
            document.body.classList.contains(`weather-${type}`)
        );
        const nextIndex = (currentIndex + 1) % weatherTypes.length;
        const nextWeather = weatherTypes[nextIndex];

        // Actualiza los datos de clima
        this.weatherData.weather[0].main = nextWeather;
        this.weatherData.weather[0].description = `${nextWeather} sky`;

        // Actualiza fondo y partículas
        this.setWeatherBasedBackground();
        this.createWeatherWidget();
        this.addWeatherParticles();
    }

    /**
     * Agrega partículas visuales según el clima (lluvia o nieve).
     */
    addWeatherParticles() {
        if (!this.weatherData) return;

        const weatherMain = this.weatherData.weather[0].main.toLowerCase();

        // Elimina partículas anteriores
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

    /**
     * Crea partículas de lluvia animadas.
     */
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

    /**
     * Crea partículas de nieve animadas.
     */
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

    // ==========================
    // PERSISTENCIA DE DATOS
    // ==========================

    /**
     * Guarda las tareas del usuario en localStorage.
     */
    saveUserTasks() {
        const userData = {
            userId: this.currentUser.id,
            tasks: this.tasks,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(`dailyTasks_userData_${this.currentUser.id}`, JSON.stringify(userData));
    }

    /**
     * Carga las tareas del usuario desde localStorage.
     */
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

    /**
     * Guarda el progreso del usuario (para estadísticas).
     */
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

// ============================================================
// Inicializa la aplicación cuando el DOM está listo
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new DailyTasksApp();
});
