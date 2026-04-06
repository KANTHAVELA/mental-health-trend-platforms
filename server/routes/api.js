const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

/**
 * @route   GET /api/patient/me
 * @desc    Get patient profile (Restricted to Patients)
 * @access  Private (Patient only)
 */
router.get('/patient/me', requireAuth, requireRole(['patient']), (req, res) => {
    res.json({
        message: 'Patient profile access granted',
        user: {
            id: req.user.id,
            role: req.user.role,
            accessLevel: 'Patient'
        }
    });
});

/**
 * @route   GET /api/provider/dashboard-analytics
 * @desc    Get provider analytics (Restricted to Psychologists)
 * @access  Private (Psychologist only)
 */
router.get('/provider/dashboard-analytics', requireAuth, requireRole(['psychologist', 'admin']), (req, res) => {
    res.json({
        message: 'Provider analytics access granted',
        data: {
            totalPatients: 15,
            criticalCases: 2,
            averageMoodScore: 6.5
        }
    });
});

module.exports = router;
