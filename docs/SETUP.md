# 🚀 Guía de Configuración - Daily Tasks

Esta guía te ayudará a configurar y ejecutar la aplicación Daily Tasks en tu entorno local.

## 📋 Requisitos Previos

### Herramientas Esenciales

- **Navegador Web Moderno**
  - Chrome 90+ (Recomendado)
  - Firefox 88+
  - Safari 14+
  - Edge 90+

- **Editor de Código** (Elige uno)
  - [Visual Studio Code](https://code.visualstudio.com/) (Recomendado)
  - [Sublime Text](https://www.sublimetext.com/)
  - [Atom](https://atom.io/)
  - [WebStorm](https://www.jetbrains.com/webstorm/)

### Herramientas Opcionales

- **Git** - Para control de versiones
- **Node.js** - Para servidor local avanzado (opcional)
- **Python 3** - Para servidor HTTP simple (incluido en Windows 10+/macOS/Linux)

## 📥 Descarga e Instalación

### Opción 1: Clonar con Git (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/ByCulichi/Todo-App-Culichi.git

# Navegar al directorio
cd Todo-App-Culichi
```

### Opción 2: Descarga Directa

1. Ve a [GitHub Repository](https://github.com/ByCulichi/Todo-App-Culichi)
2. Click en "Code" → "Download ZIP"
3. Extrae el archivo ZIP
4. Navega a la carpeta extraída

## 🔧 Configuración del Entorno

### Visual Studio Code (Recomendado)

#### Extensiones Recomendadas

Abre VS Code y ve a Extensions (Ctrl+Shift+X), busca e instala:

```json
{
  "extensiones": [
    "ritwickdey.liveserver",      // Live Server
    "esbenp.prettier-vscode",     // Prettier - Code formatter  
    "formulahendry.auto-rename-tag", // Auto Rename Tag
    "bradlc.vscode-tailwindcss",  // IntelliSense for CSS
    "ms-vscode.vscode-json",      // JSON Language Features
    "firefox-devtools.vscode-firefox-debug" // Firefox Debugger
  ]
}
```

#### Configuración Recomendada

Crea `.vscode/settings.json` en la raíz del proyecto:

```json
{
  "liveServer.settings.port": 3000,
  "liveServer.settings.CustomBrowser": "chrome",
  "liveServer.settings.donotShowInfoMsg": true,
  "prettier.singleQuote": true,
  "prettier.tabWidth": 2,
  "prettier.useTabs": false,
  "files.associations": {
    "*.html": "html",
    "*.css": "css",
    "*.js": "javascript"
  }
}
```

## 🌐 Ejecutar la Aplicación

### Método 1: Live Server (VS Code)

1. Abre el proyecto en VS Code
2. Click derecho en `demo.html`
3. Selecciona "Open with Live Server"
4. Tu navegador abrirá automáticamente en `http://localhost:3000`

### Método 2: Python HTTP Server

```bash
# Python 3
python -m http.server 3000

# O Python 2
python -m SimpleHTTPServer 3000
```

Luego abre `http://localhost:3000/demo.html`

### Método 3: Node.js HTTP Server

```bash
# Instalar servidor global
npm install -g http-server

# Ejecutar servidor
http-server -p 3000

# O usar npx (sin instalación global)
npx http-server -p 3000
```

### Método 4: Abrir Directamente (Limitado)

⚠️ **Limitación**: Algunas características pueden no funcionar due a CORS policies.

- Simplemente abre `demo.html` en tu navegador
- Funciona para pruebas básicas

## 📂 Estructura del Proyecto

```
Todo-App-Culichi/
│
├── 📁 src/                    # Código fuente
│   ├── 📁 js/                 # JavaScript
│   │   ├── 📄 auth.js         # Sistema autenticación
│   │   └── 📄 script.js       # Lógica principal
│   └── 📁 styles/             # Hojas de estilo
│       ├── 📄 style.css       # Estilos base
│       ├── 📄 auth-styles.css # Estilos auth
│       └── 📄 task-styles.css # Estilos tareas
│
├── 📁 images/                 # Recursos gráficos
│   ├── 🖼️ background-image.jpg
│   └── 🖼️ empety.jpg
│
├── 📁 docs/                   # Documentación
│   ├── 📄 BEGINNER_GUIDE.md   # Guía principiantes
│   ├── 📄 ARCHITECTURE.md     # Arquitectura
│   ├── 📄 API.md              # Documentación API
│   └── 📄 SETUP.md            # Esta guía
│
├── 📄 demo.html              # 🏠 Página principal
├── 📄 auth.html              # 🔐 Autenticación
├── 📄 app.html               # 📱 App (modo demo)
├── 📄 index.html             # 📝 App completa
├── 📄 README.md              # Información proyecto
└── 📄 package.json           # Configuración
```

## 🎯 Puntos de Entrada

### 1. demo.html - Landing Page
**URL**: `http://localhost:3000/demo.html`
- Página principal con información del proyecto
- Enlaces a diferentes modos de la aplicación
- Ideal para mostrar el proyecto

### 2. auth.html - Sistema Completo
**URL**: `http://localhost:3000/auth.html`  
- Sistema completo con autenticación
- Login, registro, recuperación de contraseña
- Datos persistentes entre sesiones

### 3. app.html - Modo Demo
**URL**: `http://localhost:3000/app.html`
- Acceso directo a la aplicación
- Sin sistema de autenticación
- Ideal para pruebas rápidas

### 4. index.html - App Principal
**URL**: `http://localhost:3000/index.html`
- Requiere login previo desde auth.html
- Funcionalidad completa
- Datos persistentes por usuario

## 🧪 Probar la Aplicación

### Flujo Recomendado de Pruebas

1. **Explorar Demo**
   ```
   http://localhost:3000/demo.html
   ```

2. **Probar Modo Demo**
   ```
   http://localhost:3000/app.html
   ```
   - Agrega algunas tareas
   - Prueba marcar como completadas
   - Observa las animaciones y progreso

3. **Sistema Completo**
   ```
   http://localhost:3000/auth.html
   ```
   - Registra una cuenta nueva
   - Prueba login/logout
   - Agrega tareas personales

### Credenciales de Prueba

El sistema permite cualquier combinación email/contraseña para demo:

```
Email: test@dailytasks.com
Password: 123456

Email: demo@example.com  
Password: password

Email: usuario@prueba.com
Password: prueba123
```

## 🔧 Personalización

### Cambiar Colores

Edita variables CSS en `src/styles/style.css`:

```css
:root {
  /* Colores principales */
  --primary-color: #4facfe;     /* Azul principal */
  --secondary-color: #00f2fe;   /* Azul secundario */
  
  /* Fondo y superficies */
  --background: #1a1a2e;        /* Fondo oscuro */
  --surface: #16213e;           /* Tarjetas */
  --surface-light: #2a3f5f;     /* Hover states */
  
  /* Texto */
  --text-primary: #ffffff;      /* Texto principal */
  --text-secondary: #b8c1ec;    /* Texto secundario */
  --text-muted: #8892b0;        /* Texto apagado */
  
  /* Estados */
  --success-color: #04fc57;     /* Verde éxito */
  --error-color: #ff6b6b;       /* Rojo error */
  --warning-color: #ffeaa7;     /* Amarillo advertencia */
}
```

### Modificar Textos

Los textos principales están en los archivos HTML:

- `demo.html` - Página principal
- `auth.html` - Formularios de autenticación  
- `index.html` / `app.html` - Aplicación

### Agregar Emojis/Categorías

En `index.html` y `app.html`, busca el select de emojis:

```html
<select id="task-emoji">
    <option value="">Sin emoji</option>
    <option value="📝">📝 Notas</option>
    <option value="💼">💼 Trabajo</option>
    <!-- Agregar nuevas opciones aquí -->
    <option value="🎵">🎵 Música</option>
    <option value="🍕">🍕 Comida</option>
</select>
```

## 🚨 Solución de Problemas

### La aplicación no carga

**Síntomas**: Página en blanco o errores 404

**Soluciones**:
1. Asegúrate de usar un servidor local (no file://)
2. Verifica que el puerto no esté ocupado
3. Intenta un puerto diferente (3001, 8080, etc.)

### CSS no se aplica

**Síntomas**: Página sin estilos o mal formateada

**Soluciones**:
1. Verifica que los archivos CSS estén en `src/styles/`
2. Comprueba las rutas en archivos HTML
3. Refresca con Ctrl+F5 (fuerza recarga)

### JavaScript no funciona  

**Síntomas**: Botones no responden, formularios no envían

**Soluciones**:
1. Abre DevTools (F12) y revisa Console tab
2. Verifica que archivos JS estén en `src/js/`
3. Comprueba errores de sintaxis

### LocalStorage no persiste

**Síntomas**: Datos se pierden al cerrar navegador

**Soluciones**:
1. No uses modo incógnito/privado
2. Verifica que localStorage esté habilitado
3. Limpia cache si hay conflictos

### Problemas con Live Server

**Soluciones**:
1. Reinstala extensión Live Server
2. Cambia puerto en configuración
3. Usa método alternativo (Python/Node.js)

## 🔍 Debugging

### DevTools (F12)

#### Console Tab
```javascript
// Ver usuarios registrados
console.log(localStorage.getItem('dailyTasks_users'));

// Ver sesión actual  
console.log(localStorage.getItem('dailyTasks_session'));

// Limpiar datos
localStorage.clear();
```

#### Network Tab
- Verifica que CSS y JS se cargan correctamente
- Busca errores 404 o 403

#### Application Tab
- Ve a Storage → Local Storage
- Inspecciona datos guardados
- Limpia storage si es necesario

### Logs en Código

Agrega console.log para debugging:

```javascript
// En auth.js
console.log('Usuario logueado:', this.currentUser);

// En script.js  
console.log('Tareas cargadas:', this.tasks);
```

## 📦 Configuración Avanzada

### Package.json

Crea `package.json` para gestión de dependencias:

```json
{
  "name": "daily-tasks",
  "version": "1.0.0",
  "description": "Aplicación de gestión de tareas diarias",
  "main": "demo.html",
  "scripts": {
    "start": "http-server -p 3000",
    "dev": "http-server -p 3000 -o",
    "format": "prettier --write ."
  },
  "dependencies": {},
  "devDependencies": {
    "http-server": "^14.1.1",
    "prettier": "^2.8.0"
  }
}
```

Luego instala:
```bash
npm install
npm run start
```

### .gitignore

```gitignore
# Dependencias
node_modules/
npm-debug.log*

# Build
dist/
build/

# IDE
.vscode/settings.json
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Runtime
.env
.env.local
```

## 🚀 Despliegue

### GitHub Pages

1. Sube el proyecto a GitHub
2. Ve a Settings → Pages
3. Selecciona source: Deploy from branch
4. Branch: main, folder: / (root)
5. Tu app estará en `https://usuario.github.io/Todo-App-Culichi`

### Netlify

1. Conecta tu repo de GitHub a Netlify
2. Build settings: ninguno (es estático)
3. Publish directory: / (root)
4. Deploy automático en cada push

### Vercel

1. Conecta repo a Vercel
2. Framework Preset: Other
3. Build Command: ninguno
4. Output Directory: ./
5. Deploy automático

## 📚 Siguientes Pasos

1. **Lee la documentación**:
   - [Guía para Principiantes](BEGINNER_GUIDE.md)
   - [Arquitectura](ARCHITECTURE.md)  
   - [API Documentation](API.md)

2. **Experimenta**:
   - Modifica estilos y colores
   - Agrega nuevas categorías
   - Cambia textos y mensajes

3. **Extiende funcionalidades**:
   - Filtros por categoría
   - Fechas límite
   - Notificaciones
   - Modo claro/oscuro

¡Feliz desarrollo! 🎉