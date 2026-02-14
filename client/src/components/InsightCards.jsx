import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { clsx } from 'clsx';

const Card = ({ title, value, subtext, trend }) => {
    const isPositive = trend === 'up';

    return (
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <span className="text-muted-foreground text-sm font-medium">{title}</span>
                <div className={clsx(
                    "p-2 rounded-lg",
                    isPositive ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                )}>
                    {isPositive ? <TrendingUp size={16} /> : <Activity size={16} />}
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-3xl font-bold text-foreground mb-1 group-hover:scale-105 transition-transform origin-left">
                    {value}
                </span>
                <span className="text-xs text-muted-foreground">{subtext}</span>
            </div>
        </div>
    );
};

const InsightCards = ({ data }) => {
    if (!data) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
                title="Current Mood Score"
                value={data.currentMoodScore}
                subtext="Average over last 30 days"
                trend="neutral"
            />
            <Card
                title="Weekly Variance"
                value={data.weeklyVariance}
                subtext="Fluctuation analysis"
                trend="down"
            />
            <Card
                title="Predicted Trend"
                value={data.predictedTrend}
                subtext="Based on recent patterns"
                trend="up"
            />
        </div>
    );
};

export default InsightCards;
