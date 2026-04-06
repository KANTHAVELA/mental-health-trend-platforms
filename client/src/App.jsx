import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import Layout from './components/Layout';
import useAuthStore from './store/useAuthStore';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Reports = lazy(() => import('./pages/Reports'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const PatientList = lazy(() => import('./pages/PatientList'));
const PatientDetail = lazy(() => import('./pages/PatientDetail'));
const Emergency = lazy(() => import('./pages/Emergency'));
const PersonalVault = lazy(() => import('./pages/PersonalVault'));
const Settings = lazy(() => import('./pages/Settings'));
const Games = lazy(() => import('./pages/Games'));

const RouteLoader = () => (
    <div className="min-h-[40vh] flex items-center justify-center text-sm text-muted-foreground">
        Loading page...
    </div>
);

const RequireAuth = ({ children }) => {
    const user = useAuthStore((state) => state.user);
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

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
            <Toaster position="top-right" theme="light" />
            <Suspense fallback={<RouteLoader />}>
                <Routes>
                    <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
                    <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />

                    <Route
                        element={(
                            <RequireAuth>
                                <Layout />
                            </RequireAuth>
                        )}
                    >
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/patients" element={<PatientList />} />
                        <Route path="/patients/:id" element={<PatientDetail />} />
                        <Route path="/personal" element={<PersonalVault />} />
                        <Route path="/emergency" element={<Emergency />} />
                        <Route path="/games" element={<Games />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
