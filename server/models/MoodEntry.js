const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    emotion: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    keywords: [{
        type: String
    }],
    category: {
        type: String,
        enum: ['General', 'Work', 'Social', 'Health', 'Family', 'Personal'],
        default: 'General'
    },
    notes: {
        type: String,
        default: ''
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

moodEntrySchema.index({ user: 1, timestamp: -1 });

module.exports = mongoose.model('MoodEntry', moodEntrySchema);
