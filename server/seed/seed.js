require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const MoodEntry = require('../models/MoodEntry');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mental-health-analytics';

const emotions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const keywordsList = ['Anxiety', 'Burnout', 'Calm', 'Stressed', 'Happy', 'Focus', 'Tired', 'Energetic', 'Lonely', 'Social'];
const categories = ['Work', 'Personal', 'Social'];

async function seedData() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding');

        // Create a dummy user if not exists
        let user = await User.findOne({ email: 'demo@example.com' });
        if (!user) {
            user = await User.create({
                username: 'DemoUser',
                email: 'demo@example.com',
                password: 'hashedpassword123'
            });
            console.log('Created Demo User');
        }

        // Clear existing entries
        await MoodEntry.deleteMany({ user: user._id });
        console.log('Cleared existing entries');

        const entries = [];
        const today = new Date();

        // Generate data for past 30 days
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            // Random number of entries per day (1-3)
            const entriesPerDay = Math.floor(Math.random() * 3) + 1;

            for (let j = 0; j < entriesPerDay; j++) {
                const entryDate = new Date(date);
                // Random time during the day
                entryDate.setHours(Math.floor(Math.random() * 24));

                // Random selection
                const emotion = emotions[Math.floor(Math.random() * emotions.length)];
                const category = categories[Math.floor(Math.random() * categories.length)];

                // Pick 1-2 random keywords
                const entryKeywords = [];
                const numKeywords = Math.floor(Math.random() * 2) + 1;
                for (let k = 0; k < numKeywords; k++) {
                    entryKeywords.push(keywordsList[Math.floor(Math.random() * keywordsList.length)]);
                }

                entries.push({
                    user: user._id,
                    emotion,
                    category,
                    keywords: entryKeywords,
                    timestamp: entryDate
                });
            }
        }

        await MoodEntry.insertMany(entries);
        console.log(`Seeded ${entries.length} mood entries for the past 30 days.`);

        mongoose.disconnect();
        console.log('Seeding complete');

    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seedData();
