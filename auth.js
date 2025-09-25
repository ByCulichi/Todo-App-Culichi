    // ============================================================
    // auth.js
    // ============================================================
    // Sistema de autenticación para la app Daily Tasks.
    // Este archivo gestiona el registro, inicio de sesión, recuperación
    // de contraseña y manejo de sesiones de usuario usando localStorage.
    // Incluye validaciones, mensajes de error/éxito y navegación entre
    // pantallas de autenticación.
    // ============================================================

    /**
     * Clase principal para gestionar la autenticación de usuarios.
     * Maneja el registro, login, recuperación de contraseña y sesión.
     */
    class AuthManager {
        constructor() {
            // Usuario actualmente autenticado (null si no hay sesión)
            this.currentUser = null;

            // Lista de usuarios registrados (se almacena en localStorage)
            this.users = JSON.parse(localStorage.getItem('dailyTasks_users') || '[]');

            // Inicializa el sistema de autenticación
            this.init();
        }

        /**
         * Inicializa la autenticación:
         * - Verifica si hay una sesión guardada y válida.
         * - Si hay sesión, redirige a la app principal.
         * - Si no, muestra la pantalla de login y configura los eventos.
         */
        init() {
            // Verifica si hay sesión guardada en localStorage
            const savedSession = localStorage.getItem('dailyTasks_session');
            if (savedSession) {
                const sessionData = JSON.parse(savedSession);
                if (this.isValidSession(sessionData)) {
                    this.currentUser = sessionData.user;
                    this.redirectToApp();
                    return;
                }
            }

            // Si no hay sesión válida, configura los eventos y muestra login
            this.setupEventListeners();
            this.showScreen('login');
        }

        /**
         * Configura los listeners para navegación y formularios.
         * Permite cambiar entre login, registro y recuperación.
         */
        setupEventListeners() {
            // Navegación entre pantallas
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

            // Envío de formularios
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

        /**
         * Muestra la pantalla de autenticación indicada (login, register, recovery).
         * Oculta las demás pantallas.
         * @param {string} screenName - Nombre de la pantalla a mostrar.
         */
        showScreen(screenName) {
            // Oculta todas las pantallas de autenticación
            document.querySelectorAll('.auth-container').forEach(screen => {
                screen.classList.add('hidden');
            });

            // Muestra la pantalla seleccionada
            document.getElementById(`${screenName}-screen`).classList.remove('hidden');

            // Limpia mensajes anteriores
            this.clearMessages();
        }

        /**
         * Muestra un mensaje de error o éxito en el formulario activo.
         * @param {string} message - Texto del mensaje.
         * @param {string} type - Tipo de mensaje ('error' o 'success').
         */
        showMessage(message, type = 'error') {
            this.clearMessages();

            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            messageDiv.innerHTML = `
                <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i>
                ${message}
            `;

            // Inserta el mensaje al inicio del formulario activo
            const activeForm = document.querySelector('.auth-container:not(.hidden) .auth-form');
            activeForm.insertBefore(messageDiv, activeForm.firstChild);
        }

        /**
         * Elimina todos los mensajes de error/éxito de los formularios.
         */
        clearMessages() {
            document.querySelectorAll('.message').forEach(msg => msg.remove());
        }

        /**
         * Maneja el proceso de inicio de sesión.
         * Valida los campos, muestra mensajes y guarda la sesión si es correcto.
         */
        async handleLogin() {
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            // Validación de email
            if (!this.validateEmail(email)) {
                this.showMessage('Por favor ingresa una dirección de correo electrónico válida');
                return;
            }

            // Validación de longitud de contraseña
            if (password.length < 6) {
                this.showMessage('La contraseña debe tener al menos 6 caracteres');
                return;
            }

            // Muestra estado de carga en el botón
            const submitBtn = document.querySelector('#login-form .auth-btn');
            this.setLoading(submitBtn, true);

            // Simula retardo de red (como si fuera una petición real)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Busca el usuario (en una app real sería en el servidor)
            const user = this.users.find(u => u.email === email);

            // Verifica credenciales
            if (!user || user.password !== password) {
                this.showMessage('Correo electrónico o contraseña inválidos');
                this.setLoading(submitBtn, false);
                return;
            }

            // Login exitoso: guarda usuario y sesión
            this.currentUser = { ...user };
            delete this.currentUser.password; // No guardar contraseña en sesión

            // Guarda la sesión en localStorage (expira en 7 días)
            const sessionData = {
                user: this.currentUser,
                timestamp: Date.now(),
                expires: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 días
            };
            localStorage.setItem('dailyTasks_session', JSON.stringify(sessionData));

            this.setLoading(submitBtn, false);
            this.showMessage('¡Bienvenido de nuevo! Redirigiendo...', 'success');

            // Redirige a la app principal después de un segundo
            setTimeout(() => {
                this.redirectToApp();
            }, 1000);
        }

        /**
         * Maneja el proceso de registro de usuario.
         * Valida los campos, muestra mensajes y guarda el usuario si es correcto.
         */
        async handleRegister() {
            const name = document.getElementById('register-name').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm').value;

            // Validación de nombre
            if (!name || name.length < 2) {
                this.showMessage('Por favor ingresa tu nombre completo (mínimo 2 caracteres)');
                return;
            }

            // Validación de email
            if (!this.validateEmail(email)) {
                this.showMessage('Por favor ingresa una dirección de correo electrónico válida');
                return;
            }

            // Validación de longitud de contraseña
            if (password.length < 6) {
                this.showMessage('La contraseña debe tener al menos 6 caracteres');
                return;
            }

            // Validación de coincidencia de contraseñas
            if (password !== confirmPassword) {
                this.showMessage('Las contraseñas no coinciden');
                return;
            }

            // Verifica si el usuario ya existe
            if (this.users.some(u => u.email === email)) {
                this.showMessage('Ya existe una cuenta con este correo electrónico');
                return;
            }

            // Muestra estado de carga en el botón
            const submitBtn = document.querySelector('#register-form .auth-btn');
            this.setLoading(submitBtn, true);

            // Simula retardo de red
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Crea el nuevo usuario (en una app real, la contraseña se debe hashear)
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password,
                createdAt: new Date().toISOString(),
                tasks: []
            };

            // Agrega el usuario a la lista y guarda en localStorage
            this.users.push(newUser);
            localStorage.setItem('dailyTasks_users', JSON.stringify(this.users));

            this.setLoading(submitBtn, false);
            this.showMessage('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.', 'success');

            // Cambia a la pantalla de login después de 2 segundos y autocompleta el email
            setTimeout(() => {
                this.showScreen('login');
                document.getElementById('login-email').value = email;
            }, 2000);
        }

        /**
         * Maneja el proceso de recuperación de contraseña.
         * Valida el email y muestra un mensaje simulando el envío.
         */
        async handlePasswordRecovery() {
            const email = document.getElementById('recovery-email').value.trim();

            // Validación de email
            if (!this.validateEmail(email)) {
                this.showMessage('Por favor ingresa una dirección de correo electrónico válida');
                return;
            }

            // Muestra estado de carga en el botón
            const submitBtn = document.querySelector('#recovery-form .auth-btn');
            this.setLoading(submitBtn, true);

            // Simula retardo de red
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Verifica si el usuario existe (en una app real, siempre se muestra éxito por seguridad)
            const userExists = this.users.some(u => u.email === email);

            this.setLoading(submitBtn, false);

            if (userExists) {
                this.showMessage('Las instrucciones para restablecer la contraseña han sido enviadas a tu correo electrónico.', 'success');
            } else {
                this.showMessage('Si existe una cuenta con este correo electrónico, recibirás instrucciones para restablecerla.', 'success');
            }

            // Nota: En una app real, aquí se enviaría un correo con el enlace de recuperación
        }

        /**
         * Valida el formato de un email usando una expresión regular.
         * @param {string} email - Email a validar.
         * @returns {boolean} - true si es válido, false si no.
         */
        validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        /**
         * Cambia el estado de carga de un botón (muestra spinner y deshabilita).
         * @param {HTMLElement} button - Botón a modificar.
         * @param {boolean} isLoading - true para activar loading, false para restaurar.
         */
        setLoading(button, isLoading) {
            const icon = button.querySelector('i');

            if (isLoading) {
                button.classList.add('loading');
                button.disabled = true;
                icon.className = 'fas fa-spinner';
            } else {
                button.classList.remove('loading');
                button.disabled = false;
                // Restaura el icono original según el formulario
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

        /**
         * Verifica si una sesión guardada es válida (no expirada y con usuario).
         * @param {object} sessionData - Datos de la sesión.
         * @returns {boolean} - true si la sesión es válida.
         */
        isValidSession(sessionData) {
            return sessionData &&
                sessionData.user &&
                sessionData.expires > Date.now();
        }

        /**
         * Redirige a la app principal (index.html) tras login exitoso.
         */
        redirectToApp() {
            window.location.href = 'index.html';
        }

        /**
         * Método estático para obtener el usuario actual desde la sesión.
         * Se usa en la app principal para saber quién está logueado.
         * @returns {object|null} - Usuario actual o null si no hay sesión válida.
         */
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

        /**
         * Método estático para cerrar sesión y volver a la pantalla de login.
         */
        static logout() {
            localStorage.removeItem('dailyTasks_session');
            window.location.href = 'auth.html';
        }
    }

    // ============================================================
    // Inicializa el sistema de autenticación cuando el DOM está listo
    // ============================================================
    document.addEventListener('DOMContentLoaded', () => {
        new AuthManager();
    });

    // ============================================================
    // Exporta AuthManager para que pueda usarse en otros módulos
    // ============================================================
    window.AuthManager = AuthManager;