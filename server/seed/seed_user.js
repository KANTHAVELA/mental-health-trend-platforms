const mongoose = require('mongoose');
const User = require('../models/User');
const MoodEntry = require('../models/MoodEntry');
require('dotenv').config();

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mental-health-analytics');
        console.log('MongoDB Connected');

        const email = 'varsha@example.com'; // Adjust if needed, or I'll just find the most recent user
        // Better: Find the user "varsha" created by the user
        // The user's screenshot showed "varsha" in the bottom left. 
        // I'll try to find a user with username "varsha" or email containing "varsha".

        let user = await User.findOne({
            $or: [
                { username: 'varsha' },
                { email: /varsha/i }
            ]
        });

        if (!user) {
            console.log('User "varsha" not found. finding ANY user...');
            user = await User.findOne().sort({ createdAt: -1 });
        }

        if (!user) {
            console.log('No users found at all.');
            process.exit(1);
        }

        console.log(`Seeding data for user: ${user.username} (${user._id})`);

        // Clear existing entries for this user
        await MoodEntry.deleteMany({ user: user._id });

        const entries = [];
        const emotions = [
            { score: 2, keywords: ['anxiety', 'stress', 'deadline'] }, // rough day
            { score: 4, keywords: ['tired', 'bored', 'routine'] },
            { score: 7, keywords: ['productive', 'gym', 'focus'] },
            { score: 9, keywords: ['happy', 'social', 'achievement'] },
            { score: 6, keywords: ['calm', 'reading', 'relax'] }
        ];

        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            // Random mood
            const mood = emotions[Math.floor(Math.random() * emotions.length)];
            // Add some randomness to score
            const variedScore = Math.min(10, Math.max(1, mood.score + Math.floor(Math.random() * 3) - 1));

            entries.push({
                user: user._id,
                emotion: variedScore,
                keywords: mood.keywords,
                category: ['Work', 'Health', 'Social', 'Personal'][Math.floor(Math.random() * 4)],
                note: `Generated entry for day ${i}`,
                timestamp: date
            });
        }

        await MoodEntry.insertMany(entries);
        console.log('Data seeded successfully!');
        process.exit();

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedUser();
