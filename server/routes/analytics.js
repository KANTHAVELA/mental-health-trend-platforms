const express = require('express');
const { calculateDailyTrends, calculateCategoryDistribution } = require('../utils/calculateTrends');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/overview', protect, async (req, res) => {
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
