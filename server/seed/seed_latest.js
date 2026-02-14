const mongoose = require('mongoose');
const User = require('../models/User');
const MoodEntry = require('../models/MoodEntry');
require('dotenv').config();

const seedForLatestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mental-health-analytics');
        console.log('MongoDB Connected');

        // Find the most recently created user
        const user = await User.findOne().sort({ createdAt: -1 });

        if (!user) {
            console.log('No users found. Please sign up first.');
            process.exit(0);
        }

        console.log(`Seeding data for user: ${user.username} (${user.email})`);

        // Check if they already have entries
        const count = await MoodEntry.countDocuments({ user: user._id });
        if (count > 5) {
            console.log('User already has data. Skipping seed.');
            process.exit(0);
        }

        // Generate 30 days of data
        const entries = [];
        const emotions = [
            { score: 3, keywords: ['stress', 'deadline', 'tired'] },
            { score: 5, keywords: ['neutral', 'work', 'routine'] },
            { score: 7, keywords: ['happy', 'gym', 'social'] },
            { score: 8, keywords: ['excited', 'achievement', 'family'] },
            { score: 4, keywords: ['anxiety', 'insomnia', 'worry'] },
            { score: 6, keywords: ['calm', 'reading', 'nature'] }
        ];

        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            // Randomize mood slightly
            const baseMood = emotions[Math.floor(Math.random() * emotions.length)];
            const score = Math.max(1, Math.min(10, baseMood.score + Math.floor(Math.random() * 3) - 1));

            entries.push({
                user: user._id,
                emotion: score,
                keywords: baseMood.keywords,
                category: ['Work', 'Social', 'Personal'][Math.floor(Math.random() * 3)],
                note: `Generated entry for ${date.toDateString()}`,
                timestamp: date
            });
        }

        await MoodEntry.insertMany(entries);
        console.log(`Successfully added ${entries.length} mood entries.`);
        process.exit(0);

    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedForLatestUser();
