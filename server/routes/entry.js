const express = require('express');

const MoodEntry = require('../models/MoodEntry');
const { protect } = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');
const { validateMoodEntryPayload } = require('../utils/validation');

const router = express.Router();

router.post('/', protect, async (req, res) => {
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
