require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const MoodEntry = require('../models/MoodEntry');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mental-health-analytics';

const emotions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const keywordsList = ['Anxiety', 'Burnout', 'Calm', 'Stressed', 'Happy', 'Focus', 'Tired', 'Energetic', 'Lonely', 'Social'];
const categories = ['Work', 'Personal', 'Social'];

const bcrypt = require('bcryptjs');

async function seedUser(email, username, password) {
    let user = await User.findOne({ email });
    if (!user) {
        if (password.startsWith('$2a$') || password.startsWith('$2b$')) {
            user = await User.create({ username, email, password });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user = await User.create({ username, email, password: hashedPassword });
        }
        console.log(`Created user: ${username}`);
    } else {
        // Update password if provided and not hashed
        if (password && !password.startsWith('$2a$') && !password.startsWith('$2b$')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            console.log(`Updated password for: ${username}`);
        }
    }
    return user;
}

async function generateEntries(user) {
    // Clear existing entries
    await MoodEntry.deleteMany({ user: user._id });
    console.log(`Cleared existing entries for ${user.username}`);

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
    return entries;
}

async function seedData() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding');

        // Seed Demo User
        const demoUser = await seedUser('demo@example.com', 'DemoUser', 'hashedpassword123');
        const demoEntries = await generateEntries(demoUser);
        await MoodEntry.insertMany(demoEntries);
        console.log(`Seeded ${demoEntries.length} entries for DemoUser`);

        // Seed Real User
        const realUser = await seedUser('kaleeswaran.ad23@bitsathy.ac.in', 'kaleeswaran', 'password123');
        const realEntries = await generateEntries(realUser);
        await MoodEntry.insertMany(realEntries);
        console.log(`Seeded ${realEntries.length} entries for kaleeswaran`);

        mongoose.disconnect();
        console.log('Seeding complete');

    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seedData();
