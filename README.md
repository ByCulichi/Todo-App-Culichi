# 🎯 Daily Tasks - Modern Task Management Application

![Daily Tasks Demo](https://github.com/user-attachments/assets/73e02ca7-8009-4cd0-bf48-7979c09d654d)

A modern, feature-rich task management application built with vanilla HTML, CSS, and JavaScript. Daily Tasks provides a beautiful, intuitive interface for managing your daily productivity with user authentication, organized task sections, and enhanced visual features including dynamic weather backgrounds.

## 🌟 Live Demo

- **[🚀 Full Application](demo.html)** - Complete experience with authentication
- **[📱 Demo Mode](app.html)** - Quick preview without login

## ✨ Key Features

### 🔐 User Authentication System
- **Secure Login & Registration** - Complete authentication flow
- **Password Recovery** - Forgot password functionality 
- **Demo Mode** - Use any email/password combination for testing
- **Session Management** - Persistent user sessions with localStorage

### 📋 Task Management
- **Organized Sections** - Separate pending and completed task lists
- **Enhanced Task Creation** - Add tasks with names, dates, and emoji categories
- **Progress Tracking** - Visual progress bars and completion statistics
- **Floating Action Button** - Intuitive task creation with + button
- **Task Actions** - Edit, delete, and complete tasks with smooth animations

### 🎨 Modern UI/UX
- **Dark Theme Design** - Beautiful, modern dark interface
- **Dynamic Weather Backgrounds** - Background changes based on weather conditions
- **Responsive Layout** - Works perfectly on desktop and mobile devices
- **Smooth Animations** - Engaging user interactions with CSS animations
- **Weather Particles** - Animated rain/snow effects based on weather

### 🌤️ Weather Integration
- **Real-time Weather Data** - Uses OpenWeatherMap API for current conditions
- **Location-based** - Automatic location detection via geolocation
- **Weather Widget** - Displays current temperature and conditions
- **Dynamic Backgrounds** - Visual themes change with weather (clear, cloudy, rainy, snowy)
- **Fallback System** - Demo weather data when API is unavailable

### 📊 Productivity Features
- **Task Statistics** - Track completed vs total tasks
- **Progress Visualization** - Animated progress bars
- **Completion Celebrations** - Confetti animation when all tasks are done
- **User-specific Data** - Personal task storage for each authenticated user

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Icons**: Font Awesome 7.0.1
- **Storage**: LocalStorage for data persistence
- **APIs**: OpenWeatherMap API, Geolocation API
- **Architecture**: Object-oriented JavaScript with classes

## 📁 Project Structure

```
Daily-Tasks/
├── 📄 index.html          # Main authenticated application
├── 📄 app.html            # Demo mode application  
├── 📄 auth.html           # Authentication pages (login/register)
├── 📄 demo.html           # Landing page with feature overview
├── 🎨 style.css           # Main application styles
├── 🎨 task-styles.css     # Task-specific styling
├── 🎨 auth-styles.css     # Authentication page styles
├── 🧠 script.js           # Main application logic
├── 🔐 auth.js            # Authentication system
└── 🖼️  images/            # Application assets
    ├── empty.jpg          # Empty state illustration
    └── background-image.jpg # Default background
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection for weather data and CDN resources

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ByCulichi/Todo-App-Culichi.git
   cd Todo-App-Culichi
   ```

2. **Serve the files locally**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```

3. **Open in browser**
   - Navigate to `http://localhost:8000`
   - Choose your entry point:
     - `demo.html` - Feature overview and navigation
     - `auth.html` - Full authentication experience  
     - `app.html` - Direct demo mode

## 📖 Usage Guide

### Authentication Mode (`index.html` or `auth.html`)

![Authentication Screen](https://github.com/user-attachments/assets/5e13d4d1-a74b-4ada-8def-9d364aecee30)

1. **Sign Up**: Create a new account with your name, email, and password
2. **Sign In**: Login with existing credentials
3. **Demo Testing**: Use any email/password combination for testing

### Task Management

![Application Interface](https://github.com/user-attachments/assets/c68b2dcd-5a89-4b96-84b2-45f847c65387)

1. **Create Tasks**: Click the floating + button
2. **Add Details**: Enter task name, date, and optional emoji category
3. **Organize**: Tasks automatically sort into Pending/Completed sections
4. **Track Progress**: Watch the progress bar update as you complete tasks
5. **Manage Tasks**: Edit, delete, or mark tasks as complete

### Weather Features
- **Automatic Detection**: App detects your location for local weather
- **Manual Toggle**: Click weather widget to cycle through different conditions
- **Visual Effects**: Background and particles change with weather conditions

## 🎯 Core Classes & Architecture

### `DailyTasksApp` Class
- **Task Management**: Create, edit, delete, complete tasks
- **User Interface**: Dynamic UI updates and animations  
- **Weather System**: Weather data fetching and visual effects
- **Progress Tracking**: Statistics and completion monitoring

### `AuthManager` Class
- **User Registration**: Account creation and validation
- **Authentication**: Login/logout functionality
- **Session Management**: User state persistence
- **Password Recovery**: Reset password simulation

## 🌐 Browser Compatibility

- **Chrome** 60+ ✅
- **Firefox** 55+ ✅  
- **Safari** 12+ ✅
- **Edge** 79+ ✅
- **Mobile browsers** ✅

## 🔧 Configuration

### Weather API Setup
1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Replace the demo key in `script.js`:
   ```javascript
   const API_KEY = 'your-actual-api-key-here';
   ```

### Customization Options
- **Themes**: Modify CSS custom properties for different color schemes
- **Emoji Categories**: Add more options in the task creation modal
- **Weather Effects**: Customize particle animations in the weather system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**ByCulichi**
- GitHub: [@ByCulichi](https://github.com/ByCulichi)
- Project: [Daily Tasks](https://github.com/ByCulichi/Todo-App-Culichi)

## 🙏 Acknowledgments

- Font Awesome for beautiful icons
- OpenWeatherMap for weather data
- Modern CSS techniques for responsive design
- JavaScript ES6+ features for clean, maintainable code

---

⭐ **Star this repository if you found it helpful!** ⭐
