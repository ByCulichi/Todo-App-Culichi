# 🏛️ Arquitectura del Proyecto - Daily Tasks

## 📋 Visión General

Daily Tasks es una aplicación web de gestión de tareas con sistema de autenticación completo, construida con tecnologías web nativas (HTML, CSS, JavaScript). Utiliza una arquitectura modular y orientada a objetos para facilitar el mantenimiento y escalabilidad.

## 🎯 Objetivos de Diseño

- **Simplicidad**: Interfaz intuitiva y fácil de usar
- **Modularidad**: Código organizado en componentes reutilizables
- **Responsividad**: Funciona en dispositivos móviles y desktop
- **Persistencia**: Datos guardados localmente en el navegador
- **Seguridad**: Validación de datos y manejo de sesiones

## 🏗️ Estructura de Archivos

```
📦 Todo-App-Culichi
├── 📁 src/                     # Código fuente principal
│   ├── 📁 js/                  # Lógica JavaScript
│   │   ├── 📄 auth.js          # Sistema de autenticación
│   │   └── 📄 script.js        # Lógica principal de tareas
│   └── 📁 styles/              # Hojas de estilo
│       ├── 📄 style.css        # Estilos base y layout
│       ├── 📄 auth-styles.css  # Estilos de autenticación
│       └── 📄 task-styles.css  # Estilos específicos de tareas
├── 📁 images/                  # Recursos gráficos
│   ├── 🖼️ background-image.jpg
│   └── 🖼️ empety.jpg
├── 📁 docs/                    # Documentación
│   ├── 📄 BEGINNER_GUIDE.md
│   ├── 📄 ARCHITECTURE.md
│   ├── 📄 API.md
│   └── 📄 SETUP.md
├── 📄 demo.html               # Página de demostración
├── 📄 auth.html               # Página de autenticación
├── 📄 app.html                # App principal (modo demo)
├── 📄 index.html              # App principal (con auth)
├── 📄 README.md               # Documentación principal
└── 📄 package.json            # Configuración del proyecto
```

## 🧱 Arquitectura de Componentes

### Capa de Presentación (HTML)

#### 1. **demo.html** - Landing Page
```html
<!-- Página de entrada con información del proyecto -->
- Descripción de características
- Enlaces a diferentes modos de la aplicación  
- Información de demo
```

#### 2. **auth.html** - Sistema de Autenticación
```html
<!-- Interfaz de login, registro y recuperación -->
- Formulario de login
- Formulario de registro  
- Formulario de recuperación de contraseña
- Navegación entre pantallas
```

#### 3. **index.html** - Aplicación Principal
```html
<!-- App completa con autenticación -->
- Header con información de usuario
- Estadísticas y barra de progreso
- Listas de tareas (pendientes/completadas)
- Modal para crear tareas
- Botón flotante de agregar
```

#### 4. **app.html** - Modo Demo
```html
<!-- Misma funcionalidad sin autenticación -->
- Usuario demo predefinido
- Todas las funcionalidades de tareas
- Sin persistencia entre sesiones
```

### Capa de Lógica (JavaScript)

#### 1. **AuthManager Class** (`auth.js`)

```javascript
class AuthManager {
    // Propiedades
    currentUser: null | User        // Usuario activo
    users: User[]                   // Array de usuarios registrados
    
    // Métodos principales
    init()                          // Inicialización
    setupEventListeners()          // Configurar eventos
    handleLogin()                   // Procesar login
    handleRegister()                // Procesar registro
    handlePasswordRecovery()        // Recuperación de contraseña
    
    // Métodos auxiliares
    showScreen(screenName)          // Cambiar pantallas
    showMessage(message, type)      // Mostrar mensajes
    validateEmail(email)            // Validar email
    isValidSession(sessionData)     // Validar sesión
    redirectToApp()                 // Redirigir a app
    
    // Métodos estáticos
    static getCurrentUser()         // Obtener usuario actual
    static logout()                 // Cerrar sesión
}
```

**Responsabilidades:**
- Gestión de usuarios y sesiones
- Validación de formularios
- Navegación entre pantallas de auth
- Almacenamiento en localStorage
- Redirección post-autenticación

#### 2. **DailyTasksApp Class** (`script.js`)

```javascript
class DailyTasksApp {
    // Propiedades
    currentUser: User               // Usuario logueado
    tasks: Task[]                   // Array de tareas del usuario
    
    // Elementos DOM cacheados
    userNameElement: HTMLElement
    pendingTasksList: HTMLElement
    completedTasksList: HTMLElement
    // ... más elementos
    
    // Métodos principales
    init()                          // Inicialización
    initializeElements()            // Cachear elementos DOM
    setupEventListeners()          // Configurar eventos
    
    // Gestión de tareas
    addTask()                       // Agregar nueva tarea
    completeTask(taskId)           // Marcar como completada
    deleteTask(taskId)             // Eliminar tarea
    
    // Actualización de UI
    updateTaskCounts()             // Actualizar contadores
    updateProgressBar()            // Actualizar barra progreso
    updateEmptyState()             // Mostrar/ocultar estado vacío
    
    // Persistencia de datos
    saveUserTasks()                // Guardar en localStorage
    loadUserTasks()                // Cargar desde localStorage
}
```

**Responsabilidades:**
- Gestión de tareas del usuario
- Actualización de la interfaz
- Persistencia de datos
- Cálculo de estadísticas
- Animaciones y efectos visuales

### Capa de Presentación (CSS)

#### 1. **style.css** - Estilos Base
```css
/* Variables CSS globales */
:root {
    --primary-color: #4facfe;
    --background: #1a1a2e;
    --surface: #16213e;
    /* ... más variables */
}

/* Reset y estilos base */
/* Layout principal */
/* Componentes reutilizables */
/* Responsive design */
```

#### 2. **auth-styles.css** - Estilos de Autenticación
```css
/* Estilos específicos para auth.html */
.auth-container { /* ... */ }
.auth-card { /* ... */ }
.auth-form { /* ... */ }
.input-group { /* ... */ }
/* Estados de error y éxito */
/* Animaciones de transición */
```

#### 3. **task-styles.css** - Estilos de Tareas
```css
/* Estilos específicos para la app de tareas */
.task-item { /* ... */ }
.task-modal { /* ... */ }
.floating-add-btn { /* ... */ }
.progress-bar { /* ... */ }
/* Animaciones de tareas */
/* Responsive para tareas */
```

## 💾 Modelo de Datos

### Estructura de Usuario
```javascript
User {
    id: string              // Timestamp único
    name: string            // Nombre completo
    email: string           // Email (único)
    password: string        // Contraseña (en producción sería hash)
    createdAt: string       // ISO timestamp
    tasks: Task[]           // Array de tareas del usuario
}
```

### Estructura de Tarea
```javascript
Task {
    id: string              // Timestamp único  
    name: string            // Nombre de la tarea
    date: string            // Fecha en formato YYYY-MM-DD
    emoji: string           // Emoji opcional para categoría
    completed: boolean      // Estado de completitud
    createdAt: string       // Timestamp de creación
    completedAt: string?    // Timestamp de completado (opcional)
}
```

### Estructura de Sesión
```javascript
Session {
    user: User              // Datos del usuario
    timestamp: number       // Timestamp de inicio sesión
    expiresAt: number       // Timestamp de expiración
}
```

## 🔄 Flujo de Datos

### 1. Flujo de Autenticación

```
Usuario → auth.html → AuthManager → localStorage → Validación → Redirección
                         ↓
                   Session Storage
                         ↓
                   index.html/app.html
```

1. Usuario accede a `auth.html`
2. `AuthManager` verifica si hay sesión activa
3. Si no hay sesión, muestra formulario de login
4. Usuario llena formularios (login/register)
5. `AuthManager` valida datos contra localStorage
6. Si es válido, crea sesión y redirige a app
7. Si es inválido, muestra mensaje de error

### 2. Flujo de Gestión de Tareas

```
Usuario → Acción → DailyTasksApp → Validación → localStorage → UI Update
                                      ↓
                               Actualizar contadores
                                      ↓
                               Actualizar progreso
                                      ↓
                               Mostrar animaciones
```

1. Usuario interactúa con la interfaz (click, submit)
2. Event listener captura la acción
3. `DailyTasksApp` procesa la acción
4. Se validan los datos
5. Se actualiza localStorage
6. Se actualiza la interfaz (DOM manipulation)
7. Se muestran animaciones de feedback

## 🎨 Patrones de Diseño Utilizados

### 1. **Module Pattern**
- Cada archivo JS encapsula su funcionalidad
- Uso de clases para organizar código
- Métodos estáticos para funciones utilitarias

### 2. **Observer Pattern** (Simplified)
- Event listeners como observadores de acciones de usuario
- Callbacks para manejar eventos asincrónicos

### 3. **Singleton Pattern** (Informal)
- Una sola instancia de AuthManager y DailyTasksApp por página
- localStorage como estado global compartido

### 4. **MVC-like Pattern**
- **Model**: localStorage + estructuras de datos
- **View**: HTML + CSS + DOM manipulation
- **Controller**: Clases JavaScript (AuthManager, DailyTasksApp)

## 🔒 Consideraciones de Seguridad

### Limitaciones Actuales
- Contraseñas en texto plano (solo para demo)
- Sin validación del lado del servidor
- Datos almacenados en localStorage (visible al usuario)

### Para Producción se Recomienda
- Hash de contraseñas (bcrypt, scrypt)
- Validación en servidor
- Tokens JWT para sesiones
- HTTPS obligatorio
- Rate limiting para login attempts
- Base de datos real en lugar de localStorage

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile first approach */
@media (min-width: 768px) {
    /* Tablets */
}

@media (min-width: 1024px) {
    /* Desktop */
}

@media (min-width: 1440px) {
    /* Large screens */
}
```

### Estrategias
- **Mobile-first**: Diseño base para móviles
- **Flexbox/Grid**: Layout flexible
- **Viewport units**: Tamaños relativos a pantalla
- **Touch-friendly**: Botones grandes para móvil

## 🚀 Optimizaciones de Performance

### Técnicas Implementadas
- **Event Delegation**: Event listeners eficientes
- **DOM Caching**: Elementos DOM almacenados en variables
- **Debouncing**: Para búsquedas y validaciones
- **CSS Animations**: Mejor performance que JavaScript
- **Lazy Loading**: Carga diferida de elementos no críticos

### Métricas Objetivo
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔮 Extensibilidad Futura

### Características Potenciales
- **Backend real** con Node.js/Express
- **Base de datos** PostgreSQL/MongoDB
- **PWA** (Progressive Web App)
- **Notificaciones push**
- **Sincronización en la nube**
- **Colaboración en tiempo real**
- **Temas personalizables**
- **Categorías avanzadas**
- **Recordatorios y fechas límite**

### Arquitectura para Escalabilidad
- **Separar en módulos** (ES6 modules)
- **State management** (Redux-like)
- **Component-based** (Web Components)
- **Testing** (Jest, Cypress)
- **CI/CD pipeline**
- **Docker containerization**

---

Esta arquitectura proporciona una base sólida para una aplicación de gestión de tareas moderna, mantenible y escalable.