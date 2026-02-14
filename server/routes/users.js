const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const MoodEntry = require('../models/MoodEntry');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/users
// @desc    Get all users (simulated "Doctor" view)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        // Enhance with last check-in date
        const enhancedUsers = await Promise.all(users.map(async (user) => {
            const lastEntry = await MoodEntry.findOne({ user: user._id }).sort({ timestamp: -1 });
            return {
                ...user.toObject(),
                lastCheckIn: lastEntry ? lastEntry.timestamp : null,
                status: lastEntry && lastEntry.emotion < 4 ? 'Risk' : 'Stable' // Simple risk logic
            };
        }));

        res.json(enhancedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/users/create
// @desc    Create a new user (Doctor adds patient)
// @access  Private
router.post('/create', protect, async (req, res) => {
    try {
        const {
            username, email, password,
            dateOfBirth, sex, phone,
            address, bloodType, allergies, medicalHistory,
            profileImage, mentalHealth
        } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Calculate age from dateOfBirth if provided
        let age = null;
        if (dateOfBirth) {
            const birthDate = new Date(dateOfBirth);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username,
            email,
            password: hashedPassword,
            dateOfBirth,
            age,
            sex,
            phone,
            address,
            bloodType,
            allergies: allergies || [],
            medicalHistory: medicalHistory || [],
            mentalHealth: mentalHealth || {},
            profileImage
        });

        await user.save();

        res.status(201).json({
            _id: user._id,
            patientId: user.patientId,
            username: user.username,
            email: user.email,
            age: user.age,
            sex: user.sex,
            profileImage: user.profileImage
        });
    } catch (error) {
        console.error('Create User Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   GET /api/users/:id/details
// @desc    Get detailed patient information
// @access  Private
router.get('/:id/details', protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get User Details Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.username = req.body.fullName || user.username;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            user.bio = req.body.bio || user.bio;
            user.profileImage = req.body.profileImage || user.profileImage;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                bio: updatedUser.bio,
                profileImage: updatedUser.profileImage,
                settings: updatedUser.settings,
                token: req.headers.authorization.split(' ')[1] // Reuse existing token
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   PUT /api/users/password
// @desc    Change user password
// @access  Private
router.put('/password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (user && (await bcrypt.compare(currentPassword, user.password))) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Invalid current password' });
        }
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/users/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            if (req.body.notifications) {
                user.settings.notifications = { ...user.settings.notifications, ...req.body.notifications };
            }
            if (req.body.appearance) {
                user.settings.appearance = { ...user.settings.appearance, ...req.body.appearance };
            }

            const updatedUser = await user.save();
            res.json(updatedUser.settings);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update Settings Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
