// ============================================================
// Sistema de Autenticación - Daily Tasks
// ============================================================

/**
 * Clase AuthManager - Maneja toda la autenticación de usuarios
 * 
 * Esta clase es responsable de:
 * - Iniciar sesión de usuarios
 * - Registrar nuevos usuarios  
 * - Recuperación de contraseñas
 * - Gestionar sesiones activas
 * - Validar datos de entrada
 * 
 * Para principiantes:
 * - Una clase es como un molde para crear objetos
 * - Los métodos son funciones dentro de una clase
 * - 'this' se refiere al objeto actual de la clase
 */
class AuthManager {
    /**
     * Constructor - Se ejecuta cuando se crea una nueva instancia de AuthManager
     * Aquí inicializamos las propiedades (variables) de la clase
     */
    constructor() {
        // currentUser: almacena información del usuario que está logueado
        this.currentUser = null;
        
        // users: obtiene la lista de usuarios guardados en localStorage
        // localStorage es como una "base de datos" en el navegador
        // JSON.parse convierte texto en objeto JavaScript
        this.users = JSON.parse(localStorage.getItem('dailyTasks_users') || '[]');
        
        // Inicializar la aplicación
        this.init();
    }

    /**
     * Método init - Inicializa la aplicación de autenticación
     * 
     * Este método:
     * 1. Verifica si hay una sesión activa guardada
     * 2. Si la sesión es válida, redirige a la app principal
     * 3. Si no hay sesión, configura los eventos y muestra login
     */
    init() {
        // Verificar si el usuario ya está logueado
        // localStorage.getItem busca un dato guardado por su nombre
        const savedSession = localStorage.getItem('dailyTasks_session');
        
        if (savedSession) {
            // JSON.parse convierte el texto guardado de vuelta a objeto
            const sessionData = JSON.parse(savedSession);
            
            // Verificar si la sesión aún es válida
            if (this.isValidSession(sessionData)) {
                this.currentUser = sessionData.user;
                this.redirectToApp(); // Ir directamente a la aplicación
                return; // Salir de la función aquí
            }
        }

        // Si no hay sesión válida, configurar la página de login
        this.setupEventListeners(); // Configurar botones y formularios
        this.showScreen('login');   // Mostrar pantalla de login
    }

    /**
     * setupEventListeners - Configura todos los eventos (clics, envío de formularios)
     * 
     * ¿Qué son los Event Listeners?
     * - Son "escuchadores" que esperan acciones del usuario (click, submit, etc.)
     * - Cuando ocurre la acción, ejecutan una función
     * - addEventListener('click', función) = "cuando hagan click, ejecuta esta función"
     */
    setupEventListeners() {
        // Navegación entre pantallas (login, registro, recuperación)
        
        // Botón "Crear cuenta" - va de login a registro
        document.getElementById('show-register').addEventListener('click', (e) => {
            e.preventDefault(); // Evita que el enlace recargue la página
            this.showScreen('register'); // Cambia a pantalla de registro
        });

        // Botón "Ya tengo cuenta" - va de registro a login  
        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showScreen('login');
        });

        // Enlace "¿Olvidaste tu contraseña?" - va a recuperación
        document.getElementById('forgot-password-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.showScreen('recovery');
        });

        // Botón "Volver al login" - regresa desde recuperación
        document.getElementById('back-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showScreen('login');
        });

        // Envío de formularios
        // 'submit' se activa cuando se envía un formulario (botón submit o Enter)
        
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault(); // Evita que la página se recargue
            this.handleLogin(); // Procesa el login
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(); // Procesa el registro
        });

        document.getElementById('recovery-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePasswordRecovery(); // Procesa la recuperación
        });
    }

    /**
     * showScreen - Cambia entre diferentes pantallas (login, registro, recuperación)
     * 
     * @param {string} screenName - Nombre de la pantalla a mostrar ('login', 'register', 'recovery')
     * 
     * Concepto clave: Manipulación del DOM
     * - DOM = Document Object Model = estructura HTML de la página
     * - classList.add/remove = agregar/quitar clases CSS
     * - querySelector = buscar elementos en la página
     */
    showScreen(screenName) {
        // Ocultar todas las pantallas agregándoles la clase 'hidden'
        // querySelectorAll encuentra TODOS los elementos con esa clase
        document.querySelectorAll('.auth-container').forEach(screen => {
            screen.classList.add('hidden'); // Agrega la clase 'hidden' para ocultar
        });

        // Mostrar solo la pantalla seleccionada quitándole 'hidden'
        // getElementById busca UN elemento por su ID único
        document.getElementById(`${screenName}-screen`).classList.remove('hidden');

        // Limpiar mensajes de error/éxito anteriores
        this.clearMessages();
    }

    /**
     * showMessage - Muestra mensajes de error o éxito al usuario
     * 
     * @param {string} message - El mensaje a mostrar
     * @param {string} type - Tipo de mensaje: 'error' (rojo) o 'success' (verde)
     * 
     * Conceptos clave:
     * - createElement() = crear nuevos elementos HTML
     * - innerHTML = contenido HTML interno de un elemento
     * - querySelector = buscar UN elemento con selector CSS
     * - insertBefore = insertar elemento antes de otro
     */
    showMessage(message, type = 'error') {
        this.clearMessages(); // Limpiar mensajes anteriores
        
        // Crear nuevo div para el mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`; // Agregar clases CSS
        
        // Contenido HTML con icono y mensaje
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i>
            ${message}
        `;

        // Buscar el formulario activo (que no está oculto)
        const activeForm = document.querySelector('.auth-container:not(.hidden) .auth-form');
        // Insertar mensaje al inicio del formulario
        activeForm.insertBefore(messageDiv, activeForm.firstChild);
    }

    /**
     * clearMessages - Elimina todos los mensajes visibles
     * 
     * Concepto clave:
     * - querySelectorAll = busca TODOS los elementos que coincidan
     * - forEach = ejecuta una función para cada elemento encontrado
     * - remove() = elimina el elemento del DOM
     */
    clearMessages() {
        document.querySelectorAll('.message').forEach(msg => msg.remove());
    }

    /**
     * handleLogin - Procesa el intento de inicio de sesión
     * 
     * Este método hace lo siguiente:
     * 1. Obtiene email y contraseña del formulario
     * 2. Valida que los datos sean correctos
     * 3. Busca el usuario en la lista de usuarios registrados
     * 4. Si encuentra coincidencia, crea sesión y redirige
     * 5. Si no, muestra mensaje de error
     * 
     * Conceptos clave:
     * - async/await = para operaciones que toman tiempo
     * - trim() = quita espacios al inicio y final del texto  
     * - find() = busca un elemento en array que cumpla condición
     */
    async handleLogin() {
        // Obtener valores de los campos del formulario
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        // Validación 1: Verificar que el email sea válido
        if (!this.validateEmail(email)) {
            this.showMessage('Por favor ingresa un email válido');
            return; // Salir de la función si hay error
        }

        // Validación 2: Verificar longitud mínima de contraseña
        if (password.length < 6) {
            this.showMessage('La contraseña debe tener al menos 6 caracteres');
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