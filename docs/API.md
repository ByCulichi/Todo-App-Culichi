# 📚 API Documentation - Daily Tasks

Esta documentación describe todos los métodos, funciones y propiedades disponibles en la aplicación Daily Tasks.

## 🔐 AuthManager Class

### Constructor

```javascript
new AuthManager()
```

**Descripción**: Crea una nueva instancia del gestor de autenticación.

**Inicialización automática**:
- Carga usuarios desde localStorage
- Verifica sesión activa
- Configura event listeners
- Muestra pantalla apropiada

---

### Propiedades

#### `currentUser`
```javascript
currentUser: User | null
```
**Tipo**: Object | null  
**Descripción**: Almacena información del usuario actualmente logueado.

#### `users`
```javascript
users: User[]
```
**Tipo**: Array  
**Descripción**: Lista de todos los usuarios registrados cargada desde localStorage.

---

### Métodos Principales

#### `init()`
```javascript
init(): void
```
**Descripción**: Inicializa el sistema de autenticación.

**Flujo**:
1. Verifica sesión existente en localStorage
2. Si hay sesión válida → redirige a app
3. Si no → configura eventos y muestra login

**Ejemplo**:
```javascript
const auth = new AuthManager();
// init() se llama automáticamente en constructor
```

---

#### `setupEventListeners()`
```javascript
setupEventListeners(): void
```
**Descripción**: Configura todos los event listeners para navegación y formularios.

**Eventos configurados**:
- Click en enlaces de navegación
- Submit de formularios (login, register, recovery)
- Prevención de comportamientos por defecto

---

#### `handleLogin()`
```javascript
async handleLogin(): Promise<void>
```
**Descripción**: Procesa el intento de inicio de sesión.

**Flujo**:
1. Obtiene datos del formulario
2. Valida email y contraseña
3. Busca usuario en localStorage
4. Si es válido → crea sesión y redirige
5. Si no → muestra mensaje de error

**Validaciones**:
- Email válido
- Contraseña no vacía
- Usuario existe
- Contraseña coincide

**Ejemplo de uso**:
```javascript
// Se llama automáticamente al enviar form de login
// No necesitas llamarlo manualmente
```

---

#### `handleRegister()`
```javascript
async handleRegister(): Promise<void>
```
**Descripción**: Procesa el registro de un nuevo usuario.

**Flujo**:
1. Obtiene y valida datos del formulario
2. Verifica que email no esté en uso
3. Crea nuevo usuario
4. Guarda en localStorage
5. Muestra mensaje de éxito

**Validaciones**:
- Nombre no vacío
- Email válido y único
- Contraseña mínimo 6 caracteres
- Contraseñas coinciden

**Estructura del nuevo usuario**:
```javascript
{
    id: "1643723400000",
    name: "Juan Pérez",
    email: "juan@email.com",
    password: "123456", // En producción sería hash
    createdAt: "2023-02-01T12:30:00.000Z",
    tasks: []
}
```

---

#### `handlePasswordRecovery()`
```javascript
async handlePasswordRecovery(): Promise<void>
```
**Descripción**: Simula proceso de recuperación de contraseña.

**Flujo**:
1. Valida email
2. Verifica que usuario existe
3. Simula envío de email
4. Muestra mensaje de confirmación

**Nota**: Es solo simulación para demo, no envía emails reales.

---

### Métodos de UI

#### `showScreen(screenName)`
```javascript
showScreen(screenName: 'login' | 'register' | 'recovery'): void
```
**Descripción**: Cambia entre diferentes pantallas de autenticación.

**Parámetros**:
- `screenName`: Nombre de la pantalla a mostrar

**Ejemplo**:
```javascript
auth.showScreen('register'); // Muestra formulario de registro
auth.showScreen('login');    // Muestra formulario de login
```

---

#### `showMessage(message, type)`
```javascript
showMessage(message: string, type: 'error' | 'success' = 'error'): void
```
**Descripción**: Muestra mensajes de error o éxito al usuario.

**Parámetros**:
- `message`: Texto del mensaje
- `type`: Tipo de mensaje ('error' o 'success')

**Ejemplo**:
```javascript
auth.showMessage('Credenciales incorrectas', 'error');
auth.showMessage('Cuenta creada exitosamente', 'success');
```

---

#### `clearMessages()`
```javascript
clearMessages(): void
```
**Descripción**: Elimina todos los mensajes visibles.

---

### Métodos de Validación

#### `validateEmail(email)`
```javascript
validateEmail(email: string): boolean
```
**Descripción**: Valida formato de email usando regex.

**Retorna**: `true` si el email es válido, `false` si no.

**Regex usado**: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

---

#### `isValidSession(sessionData)`
```javascript
isValidSession(sessionData: object): boolean
```
**Descripción**: Verifica si una sesión guardada aún es válida.

**Validaciones**:
- Tiene estructura correcta
- Usuario existe en lista de usuarios
- No ha expirado (24 horas)

---

### Métodos Auxiliares

#### `setLoading(button, isLoading)`
```javascript
setLoading(button: HTMLElement, isLoading: boolean): void
```
**Descripción**: Maneja estado de carga en botones.

**Efectos**:
- `isLoading = true`: Deshabilita botón, cambia texto
- `isLoading = false`: Habilita botón, restaura texto

---

#### `redirectToApp()`
```javascript
redirectToApp(): void
```
**Descripción**: Redirige a la página principal de la aplicación.

---

### Métodos Estáticos

#### `AuthManager.getCurrentUser()`
```javascript
static getCurrentUser(): User | null
```
**Descripción**: Obtiene el usuario actualmente logueado desde localStorage.

**Retorna**: Objeto User o null si no hay sesión.

**Ejemplo**:
```javascript
const currentUser = AuthManager.getCurrentUser();
if (currentUser) {
    console.log(`Hola ${currentUser.name}`);
}
```

---

#### `AuthManager.logout()`
```javascript
static logout(): void
```
**Descripción**: Cierra la sesión actual y limpia localStorage.

**Efectos**:
- Elimina 'dailyTasks_session'
- Redirige a auth.html

**Ejemplo**:
```javascript
// En un botón de logout
logoutBtn.addEventListener('click', () => {
    AuthManager.logout();
});
```

---

## 📝 DailyTasksApp Class

### Constructor

```javascript
new DailyTasksApp()
```

**Descripción**: Crea nueva instancia de la aplicación de tareas.

**Inicialización automática**:
- Verifica autenticación
- Inicializa elementos DOM
- Carga tareas del usuario
- Actualiza interfaz

---

### Propiedades

#### `currentUser`
```javascript
currentUser: User | null
```
**Descripción**: Usuario actualmente logueado obtenido de AuthManager.

#### `tasks`
```javascript
tasks: Task[]
```
**Descripción**: Array con todas las tareas del usuario actual.

### Elementos DOM Cacheados

```javascript
// User elements
userNameElement: HTMLElement
logoutBtn: HTMLElement

// Task lists
pendingTasksList: HTMLElement
completedTasksList: HTMLElement
emptyState: HTMLElement

// Counters
pendingCount: HTMLElement
completedCount: HTMLElement

// Progress elements
progressBar: HTMLElement
progressMessage: HTMLElement
numbersDisplay: HTMLElement

// Modal elements
taskModal: HTMLElement
taskForm: HTMLElement
modalOverlay: HTMLElement
// ... más elementos
```

---

### Métodos de Inicialización

#### `init()`
```javascript
init(): void
```
**Descripción**: Inicializa la aplicación completa.

**Flujo**:
1. Verifica autenticación
2. Inicializa elementos DOM
3. Configura event listeners
4. Carga datos del usuario
5. Actualiza interfaz

---

#### `initializeElements()`
```javascript
initializeElements(): void
```
**Descripción**: Cachea referencias a elementos DOM importantes.

**Beneficio**: Evita búsquedas repetidas en DOM (mejor performance).

---

#### `setupEventListeners()`
```javascript
setupEventListeners(): void
```
**Descripción**: Configura todos los event listeners de la aplicación.

**Eventos configurados**:
- Click en botón flotante (abrir modal)
- Submit de formulario de tarea
- Click en botones de tarea (completar, eliminar)
- Click en logout
- Click en overlay (cerrar modal)

---

### Métodos de Gestión de Tareas

#### `addTask()`
```javascript
addTask(): void
```
**Descripción**: Agrega una nueva tarea desde el formulario modal.

**Flujo**:
1. Obtiene datos del formulario
2. Valida datos
3. Crea objeto Task
4. Agrega a array de tareas
5. Guarda en localStorage
6. Actualiza interfaz
7. Cierra modal y muestra animación

**Estructura de Task**:
```javascript
{
    id: "1643723400000",
    name: "Comprar leche",
    date: "2023-02-01",
    emoji: "🛒",
    completed: false,
    createdAt: "2023-02-01T12:30:00.000Z"
}
```

---

#### `completeTask(taskId)`
```javascript
completeTask(taskId: string): void
```
**Descripción**: Marca una tarea como completada.

**Parámetros**:
- `taskId`: ID único de la tarea

**Efectos**:
- Cambia `completed` a `true`
- Agrega `completedAt` timestamp
- Mueve de lista pendiente a completada
- Actualiza contadores y progreso
- Muestra animación de confetti

---

#### `deleteTask(taskId)`
```javascript
deleteTask(taskId: string): void
```
**Descripción**: Elimina una tarea permanentemente.

**Parámetros**:
- `taskId`: ID único de la tarea

**Efectos**:
- Elimina del array de tareas
- Actualiza localStorage
- Remueve del DOM
- Actualiza contadores

---

#### `toggleTask(taskId)`
```javascript
toggleTask(taskId: string): void
```
**Descripción**: Cambia estado de completitud de una tarea.

**Uso**: Para tareas que se quieren "desmarcar" como completadas.

---

### Métodos de Actualización de UI

#### `updateTaskCounts()`
```javascript
updateTaskCounts(): void
```
**Descripción**: Actualiza los contadores de tareas pendientes y completadas.

**Elementos actualizados**:
- `#pending-count`
- `#completed-count`
- Badges en headers de secciones

---

#### `updateProgressBar()`
```javascript
updateProgressBar(): void
```
**Descripción**: Actualiza la barra de progreso y estadísticas.

**Cálculos**:
- Porcentaje: `(completadas / total) * 100`
- Mensaje motivacional basado en porcentaje
- Ancho de barra de progreso

**Mensajes**:
- 0%: "¡Empecemos!"
- 1-25%: "¡Buen comienzo!"
- 26-50%: "¡Vas bien!"
- 51-75%: "¡Casi ahí!"
- 76-99%: "¡Increíble progreso!"
- 100%: "¡Completado! 🎉"

---

#### `updateEmptyState()`
```javascript
updateEmptyState(): void
```
**Descripción**: Muestra/oculta mensaje cuando no hay tareas.

**Lógica**:
- Si `tasks.length === 0` → muestra imagen y mensaje
- Si hay tareas → oculta estado vacío

---

#### `updateUserDisplay()`
```javascript
updateUserDisplay(): void
```
**Descripción**: Actualiza información del usuario en header.

**Muestra**: Nombre del usuario logueado

---

### Métodos de Persistencia

#### `saveUserTasks()`
```javascript
saveUserTasks(): void
```
**Descripción**: Guarda tareas del usuario actual en localStorage.

**Storage key**: `dailyTasks_${userId}_tasks`

**Proceso**:
1. Obtiene ID del usuario actual
2. Serializa array de tareas a JSON
3. Guarda en localStorage

---

#### `loadUserTasks()`
```javascript
loadUserTasks(): void
```
**Descripción**: Carga tareas del usuario desde localStorage.

**Proceso**:
1. Obtiene ID del usuario actual
2. Busca datos en localStorage
3. Deserializa JSON a array
4. Asigna a `this.tasks`

---

#### `saveUserProgress(total, completed, percentage)`
```javascript
saveUserProgress(total: number, completed: number, percentage: number): void
```
**Descripción**: Guarda estadísticas de progreso del usuario.

**Storage key**: `dailyTasks_${userId}_progress`

**Datos guardados**:
```javascript
{
    total: 10,
    completed: 7,
    percentage: 70,
    lastUpdated: "2023-02-01T12:30:00.000Z"
}
```

---

### Métodos de Animaciones

#### `showTaskAddedAnimation()`
```javascript
showTaskAddedAnimation(): void
```
**Descripción**: Muestra animación cuando se agrega una tarea.

**Efectos**:
- Mensaje de "¡Tarea agregada!" 
- Fade in/out con CSS animations
- Auto-remove después de 2 segundos

---

#### `showCompletionAnimation()`
```javascript
showCompletionAnimation(): void
```
**Descripción**: Muestra confetti cuando se completa una tarea.

**Efectos**:
- 50 partículas de confetti
- Colores aleatorios
- Animación de caída
- Auto-cleanup después de animación

---

## 🎨 Estructuras de Datos

### User Object
```javascript
{
    id: string,           // Timestamp único
    name: string,         // Nombre completo
    email: string,        // Email único
    password: string,     // Contraseña (hash en producción)
    createdAt: string,    // ISO timestamp
    tasks: Task[]         // Array de tareas del usuario
}
```

### Task Object
```javascript
{
    id: string,           // Timestamp único
    name: string,         // Nombre de la tarea
    date: string,         // Fecha YYYY-MM-DD
    emoji: string,        // Emoji de categoría (opcional)
    completed: boolean,   // Estado de completitud
    createdAt: string,    // ISO timestamp creación
    completedAt?: string  // ISO timestamp completado (opcional)
}
```

### Session Object
```javascript
{
    user: User,           // Datos completos del usuario
    timestamp: number,    // Timestamp inicio sesión
    expiresAt: number     // Timestamp expiración (24h)
}
```

---

## 🔧 Métodos Utilitarios

### Formateo de Fechas
```javascript
// Obtener fecha actual en formato YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];

// Formatear fecha para mostrar
const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-ES');
};
```

### Generación de IDs
```javascript
// ID único basado en timestamp
const generateId = () => Date.now().toString();
```

### Debounce para Búsquedas
```javascript
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
```

---

## 📱 Event Listeners Disponibles

### AuthManager Events
- `#show-register` → click → showScreen('register')
- `#show-login` → click → showScreen('login')
- `#forgot-password-link` → click → showScreen('recovery')
- `#login-form` → submit → handleLogin()
- `#register-form` → submit → handleRegister()
- `#recovery-form` → submit → handlePasswordRecovery()

### DailyTasksApp Events
- `#floating-add-btn` → click → openModal()
- `#task-form` → submit → addTask()
- `#logout-btn` → click → AuthManager.logout()
- `#modal-overlay` → click → closeModal()
- `.complete-btn` → click → completeTask(id)
- `.delete-btn` → click → deleteTask(id)

---

## 🔍 Debugging y Testing

### Console Methods
```javascript
// Ver usuarios registrados
console.log('Users:', JSON.parse(localStorage.getItem('dailyTasks_users')));

// Ver sesión actual
console.log('Session:', JSON.parse(localStorage.getItem('dailyTasks_session')));

// Ver tareas de usuario
const userId = 'USER_ID';
console.log('Tasks:', JSON.parse(localStorage.getItem(`dailyTasks_${userId}_tasks`)));
```

### Limpiar Datos
```javascript
// Limpiar toda la data
localStorage.clear();

// Limpiar solo datos de la app
localStorage.removeItem('dailyTasks_users');
localStorage.removeItem('dailyTasks_session');
// ... otros keys específicos
```

---

Esta documentación cubre todos los métodos y funcionalidades principales de la aplicación Daily Tasks. Para ejemplos de uso más avanzados, consulta la [Guía para Principiantes](BEGINNER_GUIDE.md).