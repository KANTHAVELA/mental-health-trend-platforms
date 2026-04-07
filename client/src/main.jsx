import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary';
import useThemeStore from './store/useThemeStore';
import axios from 'axios';

// Set global base URL for production REST APIs
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '';

// Initialize theme before rendering
useThemeStore.getState().initializeTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
)
