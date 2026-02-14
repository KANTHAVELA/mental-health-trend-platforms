import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Activity, User } from 'lucide-react';
import { clsx } from 'clsx';
import useAuthStore from '../store/useAuthStore';

const SidebarItem = ({ icon: Icon, label, to }) => (
    <NavLink
        to={to}
        className={({ isActive }) => clsx(
            "flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300",
            isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </NavLink>
);

const Sidebar = () => {
    const user = useAuthStore((state) => state.user);

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
                <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" />
                <SidebarItem icon={User} label="Patients" to="/patients" />
                <SidebarItem icon={FileText} label="Reports" to="/reports" />
                <SidebarItem icon={Settings} label="Settings" to="/settings" />
            </nav>

            <div className="mt-auto pt-6 border-t border-border">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">{user?.username || 'User'}</span>
                            <span className="text-xs text-muted-foreground">Doctor Account</span>
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
