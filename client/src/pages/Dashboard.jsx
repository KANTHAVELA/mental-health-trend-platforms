import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import InsightCards from '../components/InsightCards';
import TrendWave from '../components/TrendWave';
import KeywordCloud from '../components/KeywordCloud';
import MoodPieChart from '../components/MoodPieChart';
import StateFlowChart from '../components/StateFlowChart';
import { Skeleton } from '../components/Skeleton';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Imitate delay for skeleton demonstation
                await new Promise(resolve => setTimeout(resolve, 800));

                const response = await axios.get('/api/analytics/overview');
                setData(response.data);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                toast.error("Failed to load dashboard data.", {
                    description: "Check your network connection."
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

    return (
        <>
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h2>
                <p className="text-muted-foreground">Welcome back, Dr. User.</p>
            </header>

            {!data || (!data.insights && !data.trends) ? (
                <div className="p-8 text-center bg-card border border-border rounded-3xl shadow-sm">
                    <h3 className="text-xl font-bold text-foreground mb-2">Welcome to MindFlow!</h3>
                    <p className="text-muted-foreground mb-6">You don't have any mood entries yet. As you log your daily moods, your insights will appear here.</p>
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
    );
};

export default Dashboard;
