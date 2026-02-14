const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

const createUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mental-health-analytics');
        console.log('MongoDB Connected');

        const email = 'kaleeswaran.m185@gmail.com';
        const password = 'password123';
        const username = 'kaleeswaran';

        // Check if exists
        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists. Updating password...');
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            console.log('Password updated.');
        } else {
            console.log('Creating new user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = await User.create({
                username,
                email,
                password: hashedPassword
            });
            console.log('User created successfully.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createUser();
