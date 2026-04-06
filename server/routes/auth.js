const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../models/User');
const { JWT_SECRET } = require('../config');
const { validateAuthPayload } = require('../utils/validation');

const router = express.Router();

const generateToken = (id, role) => jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '30d' });

const DEMO_USERS = [
    {
        _id: 'demo001',
        username: 'Demo User',
        email: 'demo@example.com',
        password: '$2b$10$13j0rev3YEwc4/zJbfezY.tFePqDjHVBpg5CJMi/bw/ljCRguxlSG',
        role: 'patient',
        phone: '',
        address: {},
        bio: 'This is the demo account.',
        profileImage: null,
        settings: {
            notifications: {
                email: true,
                push: true,
                weeklyReports: true,
                patientAlerts: true,
                systemUpdates: false,
            },
            appearance: {
                theme: 'auto',
                colorScheme: 'blue',
                fontSize: 'medium',
            },
        },
    },
];

const isMongoConnected = () => mongoose.connection.readyState === 1;
const findDemoUser = (email) => DEMO_USERS.find((user) => user.email.toLowerCase() === email.toLowerCase());

const buildUserResponse = (user, tokenId) => ({
    _id: user._id || user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    address: user.address,
    bio: user.bio,
    profileImage: user.profileImage,
    settings: user.settings,
    role: user.role,
    token: generateToken(tokenId || user._id, user.role),
});

router.post('/register', async (req, res) => {
    try {
        const { errors, data } = validateAuthPayload(req.body, { requireUsername: true });

        if (errors.length > 0) {
            return res.status(400).json({ message: errors[0], errors });
        }

        const {
            username,
            email,
            password,
            role,
        } = data;

        if (!isMongoConnected()) {
            if (findDemoUser(email)) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const fakeId = `user_${Date.now()}`;
            const newUser = {
                _id: fakeId,
                username,
                email,
                password: hashedPassword,
                phone: '',
                address: {},
                bio: '',
                profileImage: null,
                settings: DEMO_USERS[0].settings,
                role,
            };

            DEMO_USERS.push(newUser);
            return res.status(201).json(buildUserResponse(newUser, fakeId));
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ username, email, password: hashedPassword, role });

        return res.status(201).json(buildUserResponse(user, user._id));
    } catch (error) {
        console.error('Register Error:', error);
        return res.status(500).json({ message: `Server Error: ${error.message}` });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { errors, data } = validateAuthPayload(req.body, { requireRole: true });

        if (errors.length > 0) {
            return res.status(400).json({ message: errors[0], errors });
        }

        const { email, password, role } = data;

        if (!isMongoConnected()) {
            const demoUser = findDemoUser(email);
            if (!demoUser) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            if (demoUser.role !== role) {
                return res.status(401).json({ message: 'Invalid role for this user' });
            }

            const isMatch = await bcrypt.compare(password, demoUser.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            return res.json(buildUserResponse(demoUser, demoUser._id));
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (user.role !== role) {
            return res.status(401).json({ message: 'Invalid role for this user' });
        }

        return res.json(buildUserResponse(user, user._id));
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: `Server Error: ${error.message}` });
    }
});

module.exports = router;
