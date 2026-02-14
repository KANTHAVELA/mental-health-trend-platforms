const mongoose = require('mongoose');
const MoodEntry = require('../models/MoodEntry');

/**
 * Aggregates MoodEntry data to find daily trends.
 * @param {Date} startDate - The start date for aggregation.
 * @param {Date} endDate - The end date for aggregation.
 * @param {string} userId - The user ID to filter by.
 * @returns {Promise<Array>} - Array of daily trend objects.
 */
async function calculateDailyTrends(startDate, endDate, userId) {
    const pipeline = [
        {
            $match: {
                timestamp: { $gte: startDate, $lte: endDate },
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                averageMood: { $avg: "$emotion" },
                keywords: { $push: "$keywords" },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 } // Sort by date ascending
        }
    ];

    const dailyStats = await MoodEntry.aggregate(pipeline);

    // Post-process to flatten keywords and find top 3 per day
    return dailyStats.map(day => {
        const allKeywords = day.keywords.flat();
        const keywordCounts = {};
        allKeywords.forEach(k => {
            keywordCounts[k] = (keywordCounts[k] || 0) + 1;
        });

        const topKeywords = Object.entries(keywordCounts)
            .sort((a, b) => b[1] - a[1]) // Sort by count desc
            .slice(0, 3)
            .map(([keyword, count]) => ({ keyword, count }));

        return {
            date: day._id,
            averageMood: parseFloat(day.averageMood.toFixed(2)),
            topKeywords,
            totalEntries: day.count
        };
    });
}



/**
 * Aggregates MoodEntry data to find category distribution.
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @param {string} userId 
 */
async function calculateCategoryDistribution(startDate, endDate, userId) {
    const pipeline = [
        {
            $match: {
                timestamp: { $gte: startDate, $lte: endDate },
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 }
            }
        }
    ];

    const stats = await MoodEntry.aggregate(pipeline);

    // Format for Recharts { name: 'Work', value: 10 }
    return stats.map(s => ({
        name: s._id || 'Uncategorized',
        value: s.count
    }));
}

module.exports = { calculateDailyTrends, calculateCategoryDistribution };
