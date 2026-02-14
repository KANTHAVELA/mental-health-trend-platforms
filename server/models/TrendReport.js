const mongoose = require('mongoose');

const trendReportSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    averageMood: {
        type: Number,
        required: true
    },
    topKeywords: [{
        keyword: String,
        count: Number
    }],
    totalEntries: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('TrendReport', trendReportSchema);
