const test = require('node:test');
const assert = require('node:assert/strict');

const MoodEntry = require('../models/MoodEntry');
const {
    calculateDailyTrends,
    calculateCategoryDistribution,
} = require('../utils/calculateTrends');

test('calculateDailyTrends flattens keywords and computes daily averages', async () => {
    const originalAggregate = MoodEntry.aggregate;

    MoodEntry.aggregate = async () => ([
        {
            _id: '2026-04-01',
            averageMood: 6,
            keywords: [['calm', 'sleep'], ['calm']],
            count: 2,
        },
        {
            _id: '2026-04-02',
            averageMood: 4.5,
            keywords: [['stress'], ['stress', 'focus']],
            count: 2,
        },
    ]);

    try {
        const trends = await calculateDailyTrends(new Date('2026-04-01'), new Date('2026-04-02'), null);

        assert.deepEqual(trends, [
            {
                date: '2026-04-01',
                averageMood: 6,
                topKeywords: [
                    { keyword: 'calm', count: 2 },
                    { keyword: 'sleep', count: 1 },
                ],
                totalEntries: 2,
            },
            {
                date: '2026-04-02',
                averageMood: 4.5,
                topKeywords: [
                    { keyword: 'stress', count: 2 },
                    { keyword: 'focus', count: 1 },
                ],
                totalEntries: 2,
            },
        ]);
    } finally {
        MoodEntry.aggregate = originalAggregate;
    }
});

test('calculateCategoryDistribution maps aggregate output for chart consumption', async () => {
    const originalAggregate = MoodEntry.aggregate;

    MoodEntry.aggregate = async () => ([
        { _id: 'Work', count: 4 },
        { _id: 'Health', count: 2 },
        { _id: null, count: 1 },
    ]);

    try {
        const categories = await calculateCategoryDistribution(new Date('2026-04-01'), new Date('2026-04-02'), null);

        assert.deepEqual(categories, [
            { name: 'Work', value: 4 },
            { name: 'Health', value: 2 },
            { name: 'Uncategorized', value: 1 },
        ]);
    } finally {
        MoodEntry.aggregate = originalAggregate;
    }
});
