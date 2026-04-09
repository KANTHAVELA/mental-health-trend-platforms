const express = require('express');
const mongoose = require('mongoose');
const { calculateDailyTrends, calculateCategoryDistribution } = require('../utils/calculateTrends');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
const isMongoConnected = () => mongoose.connection.readyState === 1;

router.get('/overview', protect, async (req, res) => {
    if (!isMongoConnected()) {
        return res.json({
            trends: [
                { date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], averageMood: 6.5, topKeywords: [{keyword: 'sleep', count: 2}], totalEntries: 1 },
                { date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], averageMood: 7.0, topKeywords: [], totalEntries: 1 },
                { date: new Date().toISOString().split('T')[0], averageMood: 8.0, topKeywords: [{keyword: 'happy', count: 1}], totalEntries: 1 }
            ],
            categoryDistribution: [
                { name: 'Work', value: 4 },
                { name: 'Family', value: 2 },
                { name: 'General', value: 8 }
            ],
            insights: {
                currentMoodScore: 7.2,
                weeklyVariance: 1.5,
                predictedTrend: 'Stable'
            }
        });
    }

    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);

        const isPrivilegedUser = ['psychologist', 'admin'].includes(req.user.role);
        const targetUserId = isPrivilegedUser ? (req.query.userId || null) : req.user.id;

        const trends = await calculateDailyTrends(startDate, endDate, targetUserId);
        const categoryDistribution = await calculateCategoryDistribution(startDate, endDate, targetUserId);
        const totalEntries = trends.reduce((sum, day) => sum + day.totalEntries, 0);
        const averageMood = totalEntries > 0
            ? (trends.reduce((sum, day) => sum + (day.averageMood * day.totalEntries), 0) / totalEntries).toFixed(1)
            : 0;
        const moodScores = trends.map((trend) => trend.averageMood);
        const variance = moodScores.length > 1
            ? (Math.max(...moodScores) - Math.min(...moodScores)).toFixed(1)
            : 0;

        return res.json({
            trends,
            categoryDistribution,
            insights: {
                currentMoodScore: averageMood,
                weeklyVariance: variance,
                predictedTrend: averageMood > 5 ? 'Stable' : 'Needs Attention',
            },
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
