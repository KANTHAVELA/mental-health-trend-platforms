import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const content = children ?? <Outlet />;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
            <div className="fixed inset-0 bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/30 -z-10" />

            <Sidebar />

            <main className="ml-64 p-8 min-h-screen relative z-10">
                <div className="max-w-7xl mx-auto space-y-8">
                    {content}
                </div>
            </main>
        </div>
    );
};

export default Layout;
