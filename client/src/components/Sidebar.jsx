
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Activity, User, ShieldAlert, ShieldCheck, Gamepad2 } from 'lucide-react';
import { clsx } from 'clsx';
import useAuthStore from '../store/useAuthStore';

const SidebarItem = ({ icon: Icon, label, to, activeColor = "primary" }) => {
    const colorClasses = {
        primary: {
            active: "bg-primary/10 text-primary",
            hover: "hover:bg-muted hover:text-foreground"
        },
        blue: {
            active: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
            hover: "hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-700"
        },
        red: {
            active: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
            hover: "hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-700"
        },
        indigo: {
            active: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
            hover: "hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-indigo-700"
        },
        purple: {
            active: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
            hover: "hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:text-purple-700"
        },
        emerald: {
            active: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
            hover: "hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-700"
        }
    };

    const colors = colorClasses[activeColor] || colorClasses.primary;

    return (
        <NavLink
            to={to}
            className={({ isActive }) => clsx(
                "flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300",
                isActive ? `${colors.active} font-semibold` : `text-muted-foreground ${colors.hover}`
            )}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </NavLink>
    );
};

const Sidebar = () => {
    const user = useAuthStore((state) => state.user);

    const isDoctor = user?.role === 'psychologist' || user?.role === 'admin';

    return (
        <div className="w-64 h-screen fixed left-0 top-0 p-6 flex flex-col border-r border-border bg-card/80 backdrop-blur-xl">
            {/* ... header ... */}
            <div className="flex items-center space-x-2 mb-10 px-2">
                <Activity className="text-primary" size={28} />
                <h1 className="text-xl font-bold text-foreground">
                    MindFlow
                </h1>
            </div>

            <nav className="space-y-2 flex-1">
                <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" activeColor="primary" />
                
                {isDoctor && (
                    <>
                        <SidebarItem icon={User} label="Patients" to="/patients" activeColor="blue" />
                        <SidebarItem icon={FileText} label="Reports" to="/reports" activeColor="purple" />
                    </>
                )}
                
                <SidebarItem icon={ShieldCheck} label="Personal Space" to="/personal" activeColor="emerald" />
                <SidebarItem icon={Gamepad2} label="Stress Relief" to="/games" activeColor="blue" />
                <SidebarItem icon={ShieldAlert} label="Emergency Support" to="/emergency" activeColor="red" />
                <SidebarItem icon={Settings} label="Settings" to="/settings" activeColor="indigo" />
            </nav>

            <div className="mt-auto pt-6 border-t border-border">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">{user?.username || 'User'}</span>
                            <span className="text-xs text-muted-foreground capitalize">{user?.role || 'Patient'} Account</span>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                        }}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="Logout"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
