import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Gamepad2, Brain, Activity, Heart, Sparkles } from 'lucide-react';

import InsightCards from '../components/InsightCards';
import TrendWave from '../components/TrendWave';
import KeywordCloud from '../components/KeywordCloud';
import MoodPieChart from '../components/MoodPieChart';
import StateFlowChart from '../components/StateFlowChart';
import { Skeleton } from '../components/Skeleton';
import useAuthStore from '../store/useAuthStore';

const Dashboard = () => {
    const user = useAuthStore((state) => state.user);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 800));
                const response = await axios.get('/api/analytics/overview');
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                toast.error('Failed to load dashboard data.', {
                    description: 'Check your network connection.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <>
                <header className="mb-8">
                    <Skeleton className="h-10 w-64 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Skeleton className="h-32 rounded-2xl" />
                    <Skeleton className="h-32 rounded-2xl" />
                    <Skeleton className="h-32 rounded-2xl" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Skeleton className="h-[400px] rounded-3xl" />
                    </div>
                    <div>
                        <Skeleton className="h-[400px] rounded-3xl" />
                    </div>
                </div>
            </>
        );
    }

    const isPatient = user?.role === 'patient';

    return (
        <>
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                        {isPatient ? 'Your Wellbeing Hub' : 'Doctor Dashboard'}
                    </h2>
                    <p className="text-muted-foreground">
                        Welcome back, {isPatient ? user.username : `Dr. ${user.username}`}.
                    </p>
                </div>
            </header>

            {isPatient ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                                <Sparkles size={120} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-2">Feeling Stressed?</h3>
                                <p className="mb-6 text-indigo-100 max-w-sm">Take a moment for yourself. Try our breathing exercises or play a quick relaxing game to reset your focus.</p>
                                <Link to="/games" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg">
                                    <Gamepad2 size={20} />
                                    Play Stress-Free Games
                                </Link>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                                <Brain size={120} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-2">Track Your Progress</h3>
                                <p className="mb-6 text-emerald-100 max-w-sm">Log your daily thoughts and review your emotional journey over time in your private journal.</p>
                                <Link to="/personal" className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg">
                                    <Heart size={20} />
                                    Open Personal Vault
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl flex items-center gap-2 font-bold mb-4 text-foreground">
                            <Activity className="text-primary" /> Recent Insights
                        </h3>
                        {!data || (!data.insights && !data.trends) ? (
                            <div className="p-8 text-center bg-card border border-border rounded-3xl shadow-sm">
                                <p className="text-muted-foreground mb-6">You haven&apos;t logged any recent activities. Start tracking to see your insights here.</p>
                            </div>
                        ) : (
                            <InsightCards data={data?.insights} />
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {!data || (!data.insights && !data.trends) ? (
                        <div className="p-8 text-center bg-card border border-border rounded-3xl shadow-sm">
                            <h3 className="text-xl font-bold text-foreground mb-2">Welcome to MindFlow!</h3>
                            <p className="text-muted-foreground mb-6">You don&apos;t have any mood entries yet. As you log your daily moods, your insights will appear here.</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-50 pointer-events-none filter blur-sm select-none">
                                <InsightCards data={{ currentMoodScore: 0, weeklyVariance: 0, predictedTrend: 'Stable' }} />
                            </div>
                        </div>
                    ) : (
                        <>
                            <InsightCards data={data?.insights} />

                            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <TrendWave data={data?.trends} />
                                </div>
                                <div>
                                    <MoodPieChart data={data?.categoryDistribution} />
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <StateFlowChart />
                                </div>
                                <div>
                                    <KeywordCloud data={data?.trends} />
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default Dashboard;
