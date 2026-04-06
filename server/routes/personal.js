const express = require('express');

const PersonalNote = require('../models/PersonalNote');
const { protect } = require('../middleware/authMiddleware');
const { validatePersonalNotePayload } = require('../utils/validation');

const router = express.Router();

router.get('/notes', protect, async (req, res) => {
    try {
        const notes = await PersonalNote.find({ user: req.user.id }).sort({ createdAt: -1 });
        return res.json(notes);
    } catch (error) {
        console.error('Personal Notes Fetch Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/notes', protect, async (req, res) => {
    try {
        const { errors, data } = validatePersonalNotePayload(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ message: errors[0], errors });
        }

        const { title, content, category } = data;
        const newNote = await PersonalNote.create({
            user: req.user.id,
            title,
            content,
            category,
        });

        return res.status(201).json(newNote);
    } catch (error) {
        console.error('Personal Note Creation Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

router.delete('/notes/:id', protect, async (req, res) => {
    try {
        const note = await PersonalNote.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await note.deleteOne();
        return res.json({ message: 'Note removed' });
    } catch (error) {
        console.error('Personal Note Deletion Error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
