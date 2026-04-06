import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import useAuthStore from '../store/useAuthStore';
import { Activity } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('patient');
    const navigate = useNavigate();
    const { login, isLoading } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password, role);
            toast.success('Welcome back!');
            navigate('/');
        } catch (error) {
            toast.error('Login Failed', {
                description: error.response?.data?.message || 'Invalid credentials'
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden transition-colors duration-300">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            <div className="w-full max-w-md p-8 bg-card border border-border rounded-2xl shadow-xl relative z-10 mx-4 transition-colors duration-300">
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Activity className="text-primary" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">
                            MindFlow
                        </h1>
                    </div>
                </div>

                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome Back</h2>
                    <p className="text-muted-foreground">Sign in to access your dashboard</p>
                </div>

                <div className="flex mb-6 bg-muted/50 p-1 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setRole('patient')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'patient' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Patient
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('psychologist')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'psychologist' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Doctor
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground transition-all"
                            placeholder="demo@example.com"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-medium text-foreground">Password</label>
                            <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none mt-2"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link to="/signup" className="text-primary font-semibold hover:underline">
                        Sign up
                    </Link>
                </p>

                <div className="mt-6 pt-6 border-t border-border text-center">
                    <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Demo Account:</span> demo@example.com / hashedpassword123
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
