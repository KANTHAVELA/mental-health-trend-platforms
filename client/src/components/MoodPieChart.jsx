import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b']; // Primary, Pink, Emerald, Amber

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card border border-border p-3 rounded-xl shadow-xl">
                <p className="text-foreground font-medium">{payload[0].name}</p>
                <p className="text-muted-foreground text-sm">
                    {payload[0].value} Entries
                </p>
            </div>
        );
    }
    return null;
};

const MoodPieChart = ({ data }) => {
    // Expect data to be an array of category counts, e.g., [{ name: 'Work', value: 10 }, ...]
    // If not provided, use default empty state
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [
            { name: 'No Data', value: 1 }
        ];
        return data;
    }, [data]);

    const isEmpty = !data || data.length === 0;

    return (
        <div className="h-[400px] w-full bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold text-foreground mb-4">Mood Distribution</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={isEmpty ? '#334155' : COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span className="text-gray-400 text-sm ml-1">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MoodPieChart;
