const express = require('express');
const router = express.Router();
const { calculateDailyTrends, calculateCategoryDistribution } = require('../utils/calculateTrends');
const { protect } = require('../middleware/authMiddleware');

router.get('/overview', protect, async (req, res) => {
    try {
        // Default to last 30 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);

        // Allow doctor to view specific patient's data
        const targetUserId = req.query.userId || req.user.id;

        const trends = await calculateDailyTrends(startDate, endDate, targetUserId);
        const categoryDistribution = await calculateCategoryDistribution(startDate, endDate, targetUserId);

        // Calculate aggregated insights for the cards
        const totalEntries = trends.reduce((sum, day) => sum + day.totalEntries, 0);
        const averageMood = totalEntries > 0
            ? (trends.reduce((sum, day) => sum + (day.averageMood * day.totalEntries), 0) / totalEntries).toFixed(1)
            : 0;

        // Simple variance calculation
        const moodScores = trends.map(t => t.averageMood);
        const variance = moodScores.length > 1
            ? (Math.max(...moodScores) - Math.min(...moodScores)).toFixed(1)
            : 0;

        res.json({
            trends, // Daily data for the chart
            categoryDistribution, // Data for Pie Chart
            insights: {
                currentMoodScore: averageMood,
                weeklyVariance: variance,
                predictedTrend: averageMood > 5 ? 'Stable' : 'Needs Attention' // Dummy logic for now
            }
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
