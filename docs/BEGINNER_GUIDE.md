# 📚 Guía para Principiantes - Daily Tasks

¡Bienvenido/a! Esta guía te ayudará a entender cómo funciona la aplicación Daily Tasks paso a paso.

## 🎯 ¿Qué es Daily Tasks?

Daily Tasks es una aplicación web para gestionar tareas diarias. Permite:
- **Crear una cuenta** y hacer login de forma segura
- **Agregar tareas** con nombre, fecha y categorías con emojis
- **Marcar tareas como completadas**
- **Ver progreso** con barras visuales y estadísticas
- **Organizar tareas** en pendientes y completadas

## 🏗️ Arquitectura del Proyecto

### Estructura de Archivos

```
Todo-App-Culichi/
├── src/                    # Código fuente
│   ├── js/                # JavaScript (lógica de la app)
│   │   ├── auth.js        # Sistema de autenticación
│   │   └── script.js      # Lógica principal de tareas
│   └── styles/            # Hojas de estilo CSS
│       ├── style.css      # Estilos principales
│       ├── task-styles.css # Estilos específicos de tareas
│       └── auth-styles.css # Estilos de autenticación
├── images/                # Imágenes de la aplicación
├── docs/                  # Documentación
├── *.html                 # Páginas web
├── demo.html             # Página de demostración
├── auth.html             # Página de login/registro
├── app.html              # Aplicación principal (modo demo)
└── index.html            # Aplicación principal (con auth)
```

### Páginas HTML

1. **demo.html** - Página de inicio con información y enlaces
2. **auth.html** - Sistema de autenticación (login/registro)
3. **app.html** - Aplicación directa (modo demo sin autenticación)
4. **index.html** - Aplicación completa con autenticación

## 🧠 Conceptos Clave de JavaScript

### 1. Clases y Objetos

```javascript
// Una clase es como un molde para crear objetos
class AuthManager {
    constructor() {
        // Se ejecuta al crear el objeto
        this.currentUser = null; // Propiedad del objeto
    }
    
    // Método (función dentro de la clase)
    login() {
        // Lógica de login
    }
}

// Crear una instancia (objeto) de la clase
const auth = new AuthManager();
```

### 2. DOM Manipulation

```javascript
// Buscar elementos en la página
const button = document.getElementById('my-button');
const allDivs = document.querySelectorAll('div');

// Modificar elementos
button.textContent = 'Nuevo texto';
button.classList.add('active');
button.style.color = 'red';

// Crear nuevos elementos
const newDiv = document.createElement('div');
newDiv.innerHTML = '<p>Hola mundo</p>';
document.body.appendChild(newDiv);
```

### 3. Event Listeners

```javascript
// Escuchar eventos (clicks, envío de formularios, etc.)
button.addEventListener('click', function() {
    alert('¡Botón clickeado!');
});

// Con arrow function (más moderna)
button.addEventListener('click', () => {
    alert('¡Botón clickeado!');
});

// Prevenir comportamiento por defecto
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que se recargue la página
    // Tu lógica aquí
});
```

### 4. LocalStorage

```javascript
// Guardar datos en el navegador
localStorage.setItem('nombre', 'Juan');
localStorage.setItem('usuario', JSON.stringify({id: 1, name: 'Ana'}));

// Obtener datos guardados
const nombre = localStorage.getItem('nombre');
const usuario = JSON.parse(localStorage.getItem('usuario'));

// Eliminar datos
localStorage.removeItem('nombre');
localStorage.clear(); // Elimina todo
```

### 5. Async/Await y Promises

```javascript
// Para operaciones que toman tiempo (como simular network)
async function login() {
    // Simular retraso de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Continúa después de 1 segundo
    console.log('Login completado');
}

// También se puede usar con .then()
fetch('/api/users')
    .then(response => response.json())
    .then(data => console.log(data));
```

## 🔍 Cómo Funciona Cada Parte

### Sistema de Autenticación (`auth.js`)

1. **Inicialización**
   - Verifica si hay sesión activa
   - Configura event listeners
   - Muestra pantalla de login

2. **Login**
   - Valida email y contraseña
   - Busca usuario en localStorage
   - Crea sesión y redirige

3. **Registro**
   - Valida datos del formulario
   - Verifica que el email no exista
   - Crea nuevo usuario y lo guarda

### Sistema de Tareas (`script.js`)

1. **Inicialización**
   - Verifica autenticación
   - Carga tareas del usuario
   - Actualiza contadores

2. **Crear Tarea**
   - Abre modal
   - Valida datos
   - Guarda en localStorage
   - Actualiza interfaz

3. **Completar Tarea**
   - Cambia estado
   - Mueve a sección completadas
   - Actualiza progreso

## 🎨 Cómo Funciona el CSS

### Sistema de Grid y Flexbox

```css
/* Grid para layout principal */
.container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

/* Flexbox para alinear elementos */
.task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

### Variables CSS

```css
:root {
    --primary-color: #4facfe;
    --background: #1a1a2e;
    --text-color: #ffffff;
}

.button {
    background: var(--primary-color);
    color: var(--text-color);
}
```

### Responsive Design

```css
/* Para pantallas pequeñas */
@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
}
```

## 🚀 Empezando a Programar

### 1. Herramientas Necesarias

- **Editor de código**: VS Code, Sublime Text, o Atom
- **Navegador web**: Chrome, Firefox, o Safari
- **Extensiones útiles**: Live Server, Prettier, Auto Rename Tag

### 2. Abriendo el Proyecto

1. Descarga o clona el repositorio
2. Abre la carpeta en tu editor
3. Instala Live Server en VS Code
4. Click derecho en `demo.html` → "Open with Live Server"

### 3. Experimentando

1. **Modifica texto**: Cambia títulos en los archivos HTML
2. **Cambia colores**: Modifica variables CSS
3. **Agrega console.log**: Para ver qué está pasando
4. **Crea nuevas funciones**: Empieza con algo simple

### Ejemplo de modificación simple

```javascript
// En auth.js, agrega esto para ver qué usuarios hay:
init() {
    console.log('Usuarios registrados:', this.users);
    // ... resto del código
}
```

## 📖 Siguientes Pasos

1. **Lee el código** comentado en `src/js/`
2. **Experimenta** haciendo pequeños cambios
3. **Consulta** `docs/API.md` para detalles técnicos
4. **Revisa** `docs/ARCHITECTURE.md` para entender el diseño

## 🆘 Preguntas Frecuentes

**P: ¿Por qué usar clases en JavaScript?**
R: Las clases organizan el código de manera más limpia y reutilizable.

**P: ¿Qué es localStorage?**
R: Es una forma de guardar datos en el navegador del usuario.

**P: ¿Cómo depuro mi código?**
R: Usa `console.log()`, las DevTools del navegador, y el debugger.

**P: ¿Por qué async/await?**
R: Para manejar operaciones que toman tiempo sin bloquear la interfaz.

---

**¡Feliz programación!** 🎉

Recuerda: todos los programadores empezaron como principiantes. La clave es practicar y no tener miedo a experimentar.