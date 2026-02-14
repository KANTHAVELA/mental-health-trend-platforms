const mongoose = require('mongoose');
const User = require('../models/User');
const MoodEntry = require('../models/MoodEntry');
require('dotenv').config();

const seedSpecificUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mental-health-analytics');
        console.log('MongoDB Connected');

        // Target the user seen in the screenshot "9361521695"
        // It might be the username or part of the email.
        const searchTerm = "9361521695";

        let user = await User.findOne({
            $or: [
                { username: searchTerm },
                { email: { $regex: searchTerm, $options: 'i' } }
            ]
        });

        if (!user) {
            console.log(`User '${searchTerm}' not found. Seeding the most recent user instead.`);
            user = await User.findOne().sort({ createdAt: -1 });
        }

        if (!user) {
            console.log('No users found in database.');
            process.exit(1);
        }

        console.log(`Seeding data for: ${user.username} (${user.email})`);

        // Clear existing entries to avoid duplicates if re-running
        await MoodEntry.deleteMany({ user: user._id });

        const entries = [];
        const emotions = [
            { score: 3, keywords: ['stress', 'work', 'deadline'] },
            { score: 5, keywords: ['neutral', 'routine', 'tired'] },
            { score: 7, keywords: ['happy', 'social', 'relax'] },
            { score: 8, keywords: ['excited', 'achievement', 'energy'] },
            { score: 4, keywords: ['anxiety', 'uncertainty', 'waiting'] },
            { score: 6, keywords: ['calm', 'focus', 'learning'] },
            { score: 2, keywords: ['bad', 'sad', 'loss'] },
            { score: 9, keywords: ['joy', 'celebration', 'love'] }
        ];

        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            const mood = emotions[Math.floor(Math.random() * emotions.length)];
            // Variate score slightly
            const score = Math.max(1, Math.min(10, mood.score + Math.floor(Math.random() * 3) - 1));

            entries.push({
                user: user._id,
                emotion: score,
                keywords: mood.keywords,
                category: ['Work', 'Social', 'Personal'][Math.floor(Math.random() * 3)],
                note: `Auto-generated entry for ${date.toLocaleDateString()}`,
                timestamp: date
            });
        }

        await MoodEntry.insertMany(entries);
        console.log(`✅ Successfully seeded 30 entries for ${user.username}`);
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedSpecificUser();
