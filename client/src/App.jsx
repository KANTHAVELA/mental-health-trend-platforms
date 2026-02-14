import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PatientList from './pages/PatientList';
import PatientDetail from './pages/PatientDetail';
import Settings from './pages/Settings';
import useAuthStore from './store/useAuthStore';
import { Toaster } from 'sonner';

// Protected Route Wrapper
const RequireAuth = ({ children }) => {
    const user = useAuthStore((state) => state.user);
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Public Route Wrapper (redirect to dashboard if already logged in)
const PublicOnly = ({ children }) => {
    const user = useAuthStore((state) => state.user);
    if (user) {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <Toaster position="top-right" theme="dark" />
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
                <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />

                {/* Protected Routes (wrapped in Layout) */}
                <Route path="/*" element={
                    <RequireAuth>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/reports" element={<Reports />} />
                                <Route path="/patients" element={<PatientList />} />
                                <Route path="/patients/:id" element={<PatientDetail />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </Layout>
                    </RequireAuth>
                } />
            </Routes>
        </Router>
    );
}

export default App;
