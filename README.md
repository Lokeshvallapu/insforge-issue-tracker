# 🚀 Internal Tracking System

🔗 **Live App:** [https://7zry4nmx.insforge.site](https://7zry4nmx.insforge.site)

## 📌 Overview

AI-powered internal task tracking system built using InsForge - a comprehensive project management solution with modern UI, real-time collaboration, and intelligent AI assistance.

## ✨ Features

### Core Functionality
- 🔐 **User Authentication** - Secure sign-up/sign-in with email verification
- 📋 **Task Creation & Assignment** - Create and assign tasks to team members
- 📊 **Status Tracking** - Monitor progress (Open, In Progress, Closed)
- 📈 **Dashboard View** - Comprehensive overview of projects and tasks
- 💬 **Comment System** - Threaded discussions on issues
- 🤖 **AI Assistant Integration** - Powered by OpenAI for intelligent assistance

### User Experience
- 🎨 **Modern UI/UX** - Clean, professional interface with Tailwind CSS
- 🌙 **Dark Mode** - Complete dark/light theme support
- 📱 **Responsive Design** - Optimized for all devices
- ⚡ **Real-time Updates** - Live data synchronization

## 🛠 Tech Stack

### Frontend
- **React 18** + **TypeScript** - Modern, type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### Backend & Database
- **InsForge BaaS** - Backend-as-a-Service platform
- **PostgreSQL** - Robust relational database
- **Row Level Security (RLS)** - Database-level access control

## 🤖 AI Integration

Built using AI agent-driven development with InsForge MCP (Model Context Protocol) for seamless backend integration and intelligent features.

## 📷 Screenshots

### Dashboard View
![Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Dashboard+Screenshot)

### Project Management
![Projects](https://via.placeholder.com/800x400/059669/FFFFFF?text=Projects+Screenshot)

### Issue Tracking
![Issues](https://via.placeholder.com/800x400/DC2626/FFFFFF?text=Issues+Screenshot)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-github-repo-url>
cd internal-tracking-system

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_INSFORGE_BASE_URL=your-insforge-backend-url
VITE_INSFORGE_ANON_KEY=your-anon-key
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, Theme)
├── lib/               # Utility libraries and API clients
├── pages/             # Page components
├── types/             # TypeScript type definitions
└── main.tsx           # Application entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **InsForge** - For the amazing BaaS platform
- **OpenAI** - For AI integration capabilities
- **Tailwind CSS** - For the beautiful styling system
- **React Community** - For the excellent framework and ecosystem

---

**Built with ❤️ using AI agent-driven development**
- **PostgREST** - Automatic REST API generation from PostgreSQL
- **Row Level Security** - Database-level access control policies

### AI & Integrations
- **OpenAI API** - GPT models for intelligent assistance
- **WebSocket** - Real-time communication capabilities
- **JWT Tokens** - Secure authentication tokens

### Development & Deployment
- **ESLint** - Code linting and formatting
- **Vercel** - Global CDN deployment platform
- **Git** - Version control system

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ThemeToggle.tsx  # Dark mode toggle component
├── contexts/            # React context providers
│   ├── AuthContext.tsx  # Authentication state management
│   └── ThemeContext.tsx # Theme state management
├── lib/                 # Utility libraries and configurations
│   └── insforge.ts      # InsForge SDK client configuration
├── pages/               # Main application pages
│   ├── Dashboard.tsx    # Main dashboard with project overview
│   ├── Login.tsx        # Authentication page
│   ├── Projects.tsx     # Project listing and creation
│   ├── ProjectPage.tsx  # Individual project details
│   ├── Issues.tsx       # Issue listing page
│   ├── IssuePage.tsx    # Individual issue details
│   └── AIChat.tsx       # AI assistant chat interface
├── types/               # TypeScript type definitions
└── App.tsx             # Main application component
```

## 🏗️ Architecture

### Database Schema
- **projects** - Project information and metadata
- **issues** - Issue tracking with status, priority, and assignments
- **comments** - Threaded discussions on issues
- **users** - User profiles and authentication data

### Security Model
- **Row Level Security (RLS)** - Database-level access control
- **JWT Authentication** - Secure token-based sessions
- **Input Validation** - Client and server-side validation
- **SQL Injection Protection** - Parameterized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- InsForge account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/issue-tracker.git
   cd issue-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your InsForge credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🎯 Key Features Implementation

### Authentication Flow
- Email/password authentication with InsForge
- JWT token management with automatic refresh
- Protected routes with React Router
- User session persistence

### Dark Mode System
- Context-based theme management
- localStorage persistence
- System preference detection
- Smooth theme transitions

### AI Integration
- OpenAI GPT integration via InsForge
- Context-aware issue assistance
- Intelligent suggestions and automation

### Real-time Features
- WebSocket connections for live updates
- Database triggers for automatic notifications
- Optimistic UI updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **InsForge** - Backend-as-a-Service platform
- **Vercel** - Deployment and hosting platform
- **Tailwind CSS** - Utility-first CSS framework
- **React** - UI library for building user interfaces
- **OpenAI** - AI model provider

## 📞 Contact

For questions or feedback about this project, please open an issue on GitHub.

---

**Built with ❤️ using modern web technologies**
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
