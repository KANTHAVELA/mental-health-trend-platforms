const express = require('express');
const router = express.Router();
const MoodEntry = require('../models/MoodEntry');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
    try {
        const { emotion, keywords, category } = req.body;

        const newEntry = new MoodEntry({
            user: req.user.id,
            emotion,
            keywords,
            category
        });

        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        console.error('Entry Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/entry - Get recent entries
router.get('/', protect, async (req, res) => {
    try {
        // Fetch ALL entries for the Doctor view, populated with user details
        const entries = await MoodEntry.find()
            .populate('user', 'username email')
            .sort({ timestamp: -1 })
            .limit(100); // Increased limit for report view

        res.json(entries);
    } catch (error) {
        console.error('Fetch Entries Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST /api/entry/manual - Create manual entry for a patient (Doctor adds entry)
router.post('/manual', protect, async (req, res) => {
    try {
        const { userId, emotion, keywords, category, notes, timestamp } = req.body;

        // Validate required fields
        if (!userId || !emotion) {
            return res.status(400).json({ message: 'userId and emotion are required' });
        }

        const newEntry = new MoodEntry({
            user: userId,
            emotion,
            keywords: keywords || [],
            category: category || 'General',
            notes: notes || '',
            timestamp: timestamp || new Date()
        });

        await newEntry.save();

        // Populate user details before sending response
        await newEntry.populate('user', 'username email');

        res.status(201).json(newEntry);
    } catch (error) {
        console.error('Manual Entry Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
