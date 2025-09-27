# Real-Time Voting Application

A modern, real-time voting application built with React, TypeScript, and WebSockets. Users can join voting sessions, cast votes, and see live results with interactive charts.

## 🚀 Features

### Core Functionality
- **User Authentication**: Simple name-based session management with cookies
- **Real-Time Voting**: Live vote casting with instant updates via WebSockets
- **Live Results**: Real-time vote count updates and percentage calculations
- **Interactive Charts**: Visual results with both bar and pie chart options
- **Session Management**: Automatic session validation and cookie-based persistence
- **Responsive Design**: Mobile-first design that works on all devices

### Technical Features
- **Conditional Socket Connection**: WebSocket connections only establish after user authentication
- **Type Safety**: Full TypeScript implementation with proper type definitions
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Smooth loading indicators for better UX
- **Route Protection**: Automatic redirects based on authentication status

## 🛠️ Technologies Used

### Frontend Framework & Build Tools
- **React 19.1.1**: Modern React with latest features and hooks
- **TypeScript 5.8.3**: Type-safe JavaScript for better development experience
- **Vite**: Fast build tool with Hot Module Replacement (HMR)
- **Rolldown**: Next-generation bundler for optimized builds

### Styling & UI
- **Tailwind CSS 4.1.13**: Utility-first CSS framework for rapid UI development
- **Chart.js 5.3.0**: Powerful charting library for data visualization
- **React Chart.js 2**: React wrapper for Chart.js integration

### Real-Time Communication
- **Socket.IO Client 4.8.1**: WebSocket client for real-time bidirectional communication
- **Custom Socket Context**: React context for managing WebSocket connections and state

### Routing & Navigation
- **React Router DOM 7.9.2**: Declarative routing for React applications
- **Protected Routes**: Authentication-based route protection

### State Management & Utilities
- **React Hooks**: useState, useEffect, useContext for state management
- **js-cookie 3.0.5**: Simple cookie management for session persistence
- **Custom Contexts**: Centralized state management for socket connections and voting data

### Development Tools
- **ESLint**: Code linting with React-specific rules
- **TypeScript ESLint**: TypeScript-aware linting rules
- **React Hooks ESLint**: Hooks-specific linting rules
- **Vite Plugin React**: React support for Vite

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Backend WebSocket server** running on `http://localhost:8000`

## 🚀 Local Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```



### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production
```bash
npm run build
# or
yarn build
```

### 6. Preview Production Build
```bash
npm run preview
# or
yarn preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── VotePage.tsx    # Main voting interface
│   │   ├── Result.tsx      # Results display page
│   │   └── Chart.tsx       # Chart visualization component
│   ├── contexts/           # React contexts
│   │   └── SocketContext.tsx # WebSocket connection management
│   ├── types/              # TypeScript type definitions
│   │   └── api.ts          # API-related types
│   ├── lib/                # Utility functions
│   ├── App.tsx             # Login/authentication page
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── tailwind.config.js      # Tailwind CSS configuration
```

## 🔄 Application Flow

### 1. User Authentication
- User enters their name on the login page (`/`)
- Name is validated (length, special characters)
- Session cookie is set with 5-minute expiration
- User is redirected to voting page

### 2. WebSocket Connection
- Socket connection is established only after authentication
- Connection is managed by `SocketContext`
- Automatic reconnection handling
- Connection status tracking

### 3. Voting Process
- User selects from three options (A, B, C)
- Vote is submitted via WebSocket
- Real-time updates received from server
- User is redirected to results page

### 4. Results Display
- Live vote counts and percentages
- Interactive chart visualization (bar/pie)
- Real-time updates as other users vote
- Option to return to voting

## 🎯 Key Components

### SocketContext
- Manages WebSocket connection lifecycle
- Handles vote submission and real-time updates
- Provides connection status and voting data
- Implements conditional connection based on authentication

### VotePage
- Protected route requiring authentication
- Radio button interface for vote selection
- Form validation and error handling
- Loading states during submission

### ResultsPage
- Real-time results display
- Interactive chart type switching
- Vote count and percentage calculations
- Navigation back to voting

### App (Login Page)
- Name-based authentication
- Client-side validation
- Cookie management
- Session checking and redirects

## 🔧 Configuration

### Socket Connection
The WebSocket connection is configured to connect to `http://localhost:8000`. Update the URL in `SocketContext.tsx` if your backend runs on a different port.

### Cookie Settings
Session cookies expire after 5 minutes. Modify the expiration time in `App.tsx`:
```typescript
const inFiveMinutes = new Date(new Date().getTime() + 5 * 60 * 1000);
Cookies.set("username", name.trim(), { expires: inFiveMinutes });
```

### Chart Configuration
Chart appearance can be customized in the `Chart.tsx` component using Chart.js options.

