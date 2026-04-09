const express = require('express');

const MoodEntry = require('../models/MoodEntry');
const { protect } = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');
const { validateMoodEntryPayload } = require('../utils/validation');

const router = express.Router();
const mongoose = require('mongoose');
const isMongoConnected = () => mongoose.connection.readyState === 1;

router.post('/', protect, async (req, res) => {
    if (!isMongoConnected()) {
        return res.status(201).json({
            _id: `entry_${Date.now()}`,
            user: req.user.id,
            emotion: req.body.emotion,
            keywords: req.body.keywords,
            category: req.body.category,
            notes: req.body.notes,
            timestamp: req.body.timestamp || new Date()
        });
    }
    try {
        const { errors, data } = validateMoodEntryPayload(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ message: errors[0], errors });
        }

        const { emotion, keywords, category, notes, timestamp } = data;
        const newEntry = new MoodEntry({
            user: req.user.id,
            emotion,
            keywords,
            category,
            notes,
            timestamp,
        });

        await newEntry.save();
        return res.status(201).json(newEntry);
    } catch (error) {
        console.error('Entry Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/', protect, async (req, res) => {
    if (!isMongoConnected()) {
        const mockEntries = [
            { _id: 'e1', user: { username: 'Arjun Kumar', email: 'arjun@example.com' }, emotion: 7, keywords: ['sleep', 'productive'], category: 'Work', notes: 'Feeling better today', timestamp: new Date(Date.now() - 3600000) },
            { _id: 'e2', user: { username: 'Sarah Chen', email: 'sarah@example.com' }, emotion: 3, keywords: ['anxious', 'tired'], category: 'Social', notes: 'A bit overwhelmed', timestamp: new Date(Date.now() - 7200000) },
            { _id: 'e3', user: { username: 'Michael Smith', email: 'michael@example.com' }, emotion: 8, keywords: ['happy', 'energetic'], category: 'Health', notes: 'Great workout', timestamp: new Date(Date.now() - 86400000) },
            { _id: 'e4', user: { username: 'Priya Sharma', email: 'priya@example.com' }, emotion: 6, keywords: ['calm'], category: 'Personal', notes: 'Relaxing weekend', timestamp: new Date(Date.now() - 172800000) },
            { _id: 'e5', user: { username: 'Arjun Kumar', email: 'arjun@example.com' }, emotion: 5, keywords: ['focused'], category: 'Work', notes: 'Busy morning', timestamp: new Date(Date.now() - 259200000) }
        ];
        return res.json(mockEntries);
    }
    try {
        const query = req.user.role === 'patient' ? { user: req.user.id } : {};
        const entries = await MoodEntry.find(query)
            .populate('user', 'username email')
            .sort({ timestamp: -1 })
            .limit(100);

        return res.json(entries);
    } catch (error) {
        console.error('Fetch Entries Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/manual', protect, requireRole(['psychologist', 'admin']), async (req, res) => {
    try {
        const { errors, data } = validateMoodEntryPayload(req.body, { requireUserId: true });
        if (errors.length > 0) {
            return res.status(400).json({ message: errors[0], errors });
        }

        const { userId, emotion, keywords, category, notes, timestamp } = data;
        const newEntry = new MoodEntry({
            user: userId,
            emotion,
            keywords,
            category,
            notes,
            timestamp: timestamp || new Date(),
        });

        await newEntry.save();
        await newEntry.populate('user', 'username email');

        return res.status(201).json(newEntry);
    } catch (error) {
        console.error('Manual Entry Error:', error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
