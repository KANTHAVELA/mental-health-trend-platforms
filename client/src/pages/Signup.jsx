import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import useAuthStore from '../store/useAuthStore';
import { Activity } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'patient' // Default role
    });
    const navigate = useNavigate();
    const { register, isLoading } = useAuthStore();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.username, formData.email, formData.password, formData.role);
            toast.success('Account created successfully!');
            navigate('/');
        } catch (error) {
            toast.error('Registration Failed', {
                description: error.response?.data?.message || 'Could not create account'
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
                    <h2 className="text-2xl font-semibold text-foreground mb-2">Create Account</h2>
                    <p className="text-muted-foreground">Join MindFlow to start tracking</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
                        <input
                            type="text"
                            name="username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground transition-all"
                            placeholder="johndoe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground transition-all"
                            placeholder="john@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3">I am a...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${formData.role === 'patient' ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-input text-foreground hover:bg-muted'}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="patient"
                                    checked={formData.role === 'patient'}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <span className="font-medium">Patient</span>
                            </label>
                            <label className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${formData.role === 'psychologist' ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-input text-foreground hover:bg-muted'}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="psychologist"
                                    checked={formData.role === 'psychologist'}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <span className="font-medium">Doctor</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none mt-2"
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
