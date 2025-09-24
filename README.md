# 🎯 Daily Tasks - Aplicación de Gestión de Tareas

![Demo Desktop](./images/Todoapp.gif)

Una aplicación moderna y completa para la gestión de tareas diarias con sistema de autenticación, desarrollada con **HTML5, CSS3 y JavaScript Vanilla**. Perfecta para aprender desarrollo web o como base para proyectos más avanzados.

## 📱 Vista Móvil

<img src="https://github.com/user-attachments/assets/42ed17fe-04a5-4597-88ac-d88dfa2dab0b" alt="Mobile View" width="300">

*La aplicación es completamente responsive y funciona perfectamente en dispositivos móviles.*

## ✨ Características Principales

### 🔐 Sistema de Autenticación Completo
- **Login seguro** con validación de credenciales
- **Registro de usuarios** con verificación de email
- **Recuperación de contraseña** (simulación demo)
- **Sesiones persistentes** con expiración automática
- **Logout seguro** con limpieza de datos

### 📝 Gestión Avanzada de Tareas
- **Crear tareas** con nombre, fecha y categorías emoji
- **Marcar como completadas** con animaciones suaves
- **Eliminar tareas** con confirmación
- **Organización automática** en secciones pendientes/completadas
- **Contador de tareas** en tiempo real

### 📊 Seguimiento de Progreso
- **Barra de progreso visual** con porcentajes
- **Estadísticas detalladas** (total, pendientes, completadas)
- **Mensajes motivacionales** basados en progreso
- **Animaciones de confetti** al completar tareas

### 🎨 Diseño Moderno
- **Tema oscuro elegante** con gradientes
- **Interfaz responsive** para móvil y desktop
- **Animaciones CSS** fluidas y atractivas
- **Iconos Font Awesome** para mejor UX
- **Modal intuitivo** para crear tareas

### 💾 Persistencia de Datos
- **LocalStorage** para guardar datos del usuario
- **Sesiones persistentes** entre navegadores
- **Datos específicos por usuario**
- **Backup automático** de progreso

---

## 🚀 Demo en Vivo

Prueba la aplicación directamente:

- **🏠 [Demo Principal](demo.html)** - Página de inicio con información
- **🔐 [Sistema Completo](auth.html)** - Con autenticación completa  
- **📱 [Modo Demo](app.html)** - Acceso directo sin login

---

## 📸 Screenshots

### Página Principal
![Landing Page](./docs/screenshots/demo-page.png)

### Sistema de Autenticación  
![Auth System](./docs/screenshots/auth-system.png)

### Aplicación Principal
![Main App](./docs/screenshots/main-app.png)

### Modal de Nueva Tarea
![Task Modal](./docs/screenshots/task-modal.png)

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **HTML5** | - | Estructura y semántica |
| **CSS3** | - | Estilos, animaciones y responsive |
| **JavaScript** | ES6+ | Lógica de aplicación y DOM |
| **Font Awesome** | 7.0.1 | Iconografía |
| **LocalStorage** | - | Persistencia de datos |

### Características Técnicas
- ✅ **Vanilla JavaScript** - Sin frameworks, código puro
- ✅ **ES6+ Features** - Clases, arrow functions, async/await
- ✅ **CSS Grid & Flexbox** - Layout moderno
- ✅ **CSS Variables** - Tema personalizable
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Accessible** - Semántica correcta y navegación por teclado

---

## 📥 Instalación y Uso

### Instalación Rápida

```bash
# Clonar repositorio
git clone https://github.com/ByCulichi/Todo-App-Culichi.git

# Navegar al directorio
cd Todo-App-Culichi

# Ejecutar servidor local
python -m http.server 3000

# Abrir navegador
open http://localhost:3000/demo.html
```

### Requisitos
- Navegador moderno (Chrome 90+, Firefox 88+, Safari 14+)
- Servidor local (Python, Node.js, Live Server, etc.)

### Métodos de Ejecución

#### 1. Visual Studio Code + Live Server
```bash
# Instalar extensión Live Server
# Click derecho en demo.html → "Open with Live Server"
```

#### 2. Python (Recomendado)
```bash
python -m http.server 3000
```

#### 3. Node.js
```bash
npx http-server -p 3000
```

---

## 📚 Documentación

### Para Principiantes
- 📖 **[Guía para Principiantes](docs/BEGINNER_GUIDE.md)** - Aprende paso a paso
- 🏗️ **[Arquitectura del Proyecto](docs/ARCHITECTURE.md)** - Cómo está construido
- 🚀 **[Guía de Configuración](docs/SETUP.md)** - Setup detallado
- 📋 **[Documentación API](docs/API.md)** - Métodos y funciones

### Estructura del Proyecto

```
📦 Todo-App-Culichi/
├── 📁 src/                    # Código fuente
│   ├── 📁 js/                 # Lógica JavaScript
│   │   ├── 📄 auth.js         # Sistema autenticación (Comentado para principiantes)
│   │   └── 📄 script.js       # Lógica principal (Documentado en español)
│   └── 📁 styles/             # Hojas de estilo organizadas
│       ├── 📄 style.css       # Estilos base y layout
│       ├── 📄 auth-styles.css # Estilos de autenticación
│       └── 📄 task-styles.css # Estilos específicos de tareas
├── 📁 images/                 # Recursos gráficos
├── 📁 docs/                   # Documentación completa
├── 📄 demo.html              # 🏠 Página principal
├── 📄 auth.html              # 🔐 Sistema de autenticación  
├── 📄 app.html               # 📱 App modo demo
├── 📄 index.html             # 📝 App completa
└── 📄 README.md              # Esta documentación
```

---

## 🎮 Cómo Usar

### 1. Acceso Rápido (Modo Demo)
1. Abre `app.html`
2. Empieza a agregar tareas inmediatamente
3. Perfecto para pruebas rápidas

### 2. Sistema Completo
1. Abre `demo.html` para ver la presentación
2. Haz click en "🚀 Launch Application"
3. Regístrate con cualquier email/contraseña
4. ¡Comienza a organizar tus tareas!

### 3. Funcionalidades Clave

#### Crear Tarea
- Click en botón flotante "+"
- Llena nombre, fecha y emoji (opcional)
- Click "Create Task"

#### Completar Tarea  
- Click en checkbox de la tarea
- Disfruta la animación de confetti 🎉
- La tarea se mueve a "Completadas"

#### Progreso
- Observa la barra de progreso automática
- Lee mensajes motivacionales
- Ve estadísticas actualizadas

---

## 🎨 Personalización

### Cambiar Colores
Edita variables CSS en `src/styles/style.css`:

```css
:root {
  --primary-color: #4facfe;     /* Color principal */
  --background: #1a1a2e;        /* Fondo */
  --text-primary: #ffffff;      /* Texto */
  --success-color: #04fc57;     /* Color de éxito */
}
```

### Agregar Categorías
En archivos HTML, modifica el select de emojis:

```html
<option value="🎵">🎵 Música</option>
<option value="🍕">🍕 Comida</option>
```

### Modificar Textos
Los textos están organizados en archivos HTML separados por funcionalidad.

---

## 🧠 Para Desarrolladores

### Conceptos Aprendidos
- **Manipulación DOM** - getElementById, querySelector, classList
- **Event Listeners** - click, submit, form validation  
- **LocalStorage** - Persistencia de datos en navegador
- **Async/Await** - Manejo de operaciones asíncronas
- **CSS Grid/Flexbox** - Layout moderno y responsive
- **ES6 Classes** - Programación orientada a objetos

### Código Documentado
El código JavaScript está **completamente comentado en español** para facilitar el aprendizaje:

```javascript
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
    const savedSession = localStorage.getItem('dailyTasks_session');
    // ... más código comentado
}
```

### Arquitectura
- **Patrón MVC-like** - Separación de responsabilidades
- **Clases ES6** - Código organizado y reutilizable
- **Module Pattern** - Encapsulación de funcionalidades
- **Event-Driven** - Arquitectura basada en eventos

---

## 🚀 Extensiones Futuras

### Ideas para Mejorar (¡Perfecto para aprender!)

#### Nivel Principiante
- [ ] Modo claro/oscuro
- [ ] Más categorías de emojis
- [ ] Sonidos al completar tareas
- [ ] Cambiar colores del tema

#### Nivel Intermedio  
- [ ] Filtros por categoría
- [ ] Búsqueda de tareas
- [ ] Fechas límite con alertas
- [ ] Exportar tareas a PDF

#### Nivel Avanzado
- [ ] Backend con Node.js/Express
- [ ] Base de datos PostgreSQL/MongoDB
- [ ] PWA con notificaciones push
- [ ] Sincronización en la nube
- [ ] Colaboración en tiempo real

---

## 🤝 Contribuir

### ¿Cómo Contribuir?

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abre** un Pull Request

### Ideas de Contribución
- 🐛 Reportar bugs
- 💡 Sugerir nuevas características  
- 📝 Mejorar documentación
- 🌍 Traducir a otros idiomas
- 🎨 Mejorar diseño/UX
- ⚡ Optimizar rendimiento

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

- **GitHub**: [@ByCulichi](https://github.com/ByCulichi)
- **Proyecto**: [Todo-App-Culichi](https://github.com/ByCulichi/Todo-App-Culichi)

---

## 🙏 Agradecimientos

- **Font Awesome** por los iconos
- **Comunidad de desarrolladores** por inspiración
- **Todos los contribuidores** que han mejorado este proyecto

---

## ⭐ ¿Te gustó el proyecto?

¡Dale una estrella ⭐ al repositorio para apoyar el proyecto!

**¡Feliz programación!** 🎉

---

> **Nota para Principiantes**: Este proyecto está especialmente diseñado para aprender desarrollo web. Todo el código está comentado en español y incluye explicaciones detalladas de conceptos importantes. ¡No dudes en explorar y experimentar!
