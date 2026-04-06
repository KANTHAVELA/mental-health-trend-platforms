const mongoose = require('mongoose');
const User = require('./models/User');
const { calculateDailyTrends } = require('./utils/calculateTrends');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mental-health-analytics';

async function runDebug() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const fs = require('fs');
        const users = await User.find({});
        const userList = users.map(u => `- ${u.username} (${u.email}) ID: ${u._id}`).join('\n');
        fs.writeFileSync('users_dump.txt', userList);
        console.log('Users dumped to users_dump.txt');

        const user = users.find(u => u.email === 'kaleeswaran.m185@gmail.com');
        if (!user) {
            console.log('Target user NOT found in list!');
            return;
        }

        console.log(`User found: ${user.username} (${user._id})`);

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);

        console.log(`Querying from ${startDate.toISOString()} to ${endDate.toISOString()}`);

        const trends = await calculateDailyTrends(startDate, endDate, user._id.toString());

        console.log('Trends count:', trends.length);
        if (trends.length > 0) {
            console.log('First entry:', JSON.stringify(trends[0], null, 2));
            console.log('Last entry:', JSON.stringify(trends[trends.length - 1], null, 2));
        } else {
            console.log('No trends found! Checking raw counts...');
            const MoodEntry = require('./models/MoodEntry');
            const count = await MoodEntry.countDocuments({ user: user._id });
            console.log(`Total MoodEntries for user in DB: ${count}`);
        }

        mongoose.disconnect();

    } catch (error) {
        console.error('Debug Error:', error);
    }
}

runDebug();
