const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const MoodEntry = require('../models/MoodEntry');
const { protect } = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');
const { normalizeArray, normalizeEmail, normalizeString } = require('../utils/validation');

const router = express.Router();
const isMongoConnected = () => mongoose.connection.readyState === 1;

router.get('/', protect, requireRole(['psychologist', 'admin']), async (req, res) => {
    if (!isMongoConnected()) {
        return res.json([{
            _id: 'demo_user_001',
            username: 'Demo Patient',
            email: 'patient@example.com',
            age: 26,
            sex: 'male',
            role: 'patient',
            lastCheckIn: new Date(),
            status: 'Stable'
        }]);
    }

    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        // Fetch the most recent mood entry for EVERY user in one highly-optimized query
        const latestEntries = await MoodEntry.aggregate([
            { $sort: { timestamp: -1 } },
            { $group: { _id: "$user", lastEntry: { $first: "$$ROOT" } } }
        ]);

        // Map the results into a fast lookup dictionary
        const entryMap = {};
        latestEntries.forEach(entry => {
            entryMap[entry._id.toString()] = entry.lastEntry;
        });

        const enhancedUsers = users.map((user) => {
            const lastEntry = entryMap[user._id.toString()];
            return {
                ...user.toObject(),
                lastCheckIn: lastEntry ? lastEntry.timestamp : null,
                status: lastEntry && lastEntry.emotion < 4 ? 'Risk' : 'Stable',
            };
        });

        return res.json(enhancedUsers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/create', protect, requireRole(['psychologist', 'admin']), async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            dateOfBirth,
            sex,
            phone,
            address,
            bloodType,
            allergies,
            medicalHistory,
            profileImage,
            mentalHealth,
        } = req.body;

        if (!normalizeString(username) || !normalizeEmail(email) || !normalizeString(password)) {
            return res.status(400).json({ message: 'username, email and password are required' });
        }
        if (normalizeString(password).length < 8) {
            return res.status(400).json({ message: 'password must be at least 8 characters long' });
        }

        let user = await User.findOne({ email: normalizeEmail(email) });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        let age = null;
        if (dateOfBirth) {
            const birthDate = new Date(dateOfBirth);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age -= 1;
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username: normalizeString(username),
            email: normalizeEmail(email),
            password: hashedPassword,
            dateOfBirth,
            age,
            sex,
            phone: normalizeString(phone),
            address,
            bloodType,
            allergies: normalizeArray(allergies),
            medicalHistory: normalizeArray(medicalHistory),
            mentalHealth: mentalHealth || {},
            profileImage,
            role: 'patient',
        });

        await user.save();

        return res.status(201).json({
            _id: user._id,
            patientId: user.patientId,
            username: user.username,
            email: user.email,
            age: user.age,
            sex: user.sex,
            profileImage: user.profileImage,
            role: user.role,
        });
    } catch (error) {
        console.error('Create User Error:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

router.get('/:id/details', protect, requireRole(['psychologist', 'admin']), async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        return res.json(user);
    } catch (error) {
        console.error('Get User Details Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = normalizeString(req.body.fullName) || user.username;
        user.email = normalizeEmail(req.body.email) || user.email;
        user.phone = normalizeString(req.body.phone) || user.phone;
        user.address = req.body.address || user.address;
        user.bio = normalizeString(req.body.bio) || user.bio;
        user.profileImage = req.body.profileImage || user.profileImage;

        const updatedUser = await user.save();

        return res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            bio: updatedUser.bio,
            profileImage: updatedUser.profileImage,
            settings: updatedUser.settings,
            role: updatedUser.role,
            token: req.headers.authorization.split(' ')[1],
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

router.put('/password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(401).json({ message: 'Invalid current password' });
        }
        if (!normalizeString(newPassword) || normalizeString(newPassword).length < 8) {
            return res.status(400).json({ message: 'newPassword must be at least 8 characters long' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        return res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change Password Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/settings', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.body.notifications) {
            user.settings.notifications = { ...user.settings.notifications, ...req.body.notifications };
        }
        if (req.body.appearance) {
            user.settings.appearance = { ...user.settings.appearance, ...req.body.appearance };
        }

        const updatedUser = await user.save();
        return res.json(updatedUser.settings);
    } catch (error) {
        console.error('Update Settings Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
