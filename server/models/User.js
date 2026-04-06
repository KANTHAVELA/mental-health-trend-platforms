const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Basic authentication fields
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['patient', 'psychologist', 'admin'],
        default: 'patient'
    },

    // Patient identification
    patientId: {
        type: String,
        unique: true,
        sparse: true // Allows null values while maintaining uniqueness
    },

    // Demographics
    dateOfBirth: {
        type: Date
    },
    age: {
        type: Number
    },
    sex: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say']
    },

    // Contact information
    phone: {
        type: String
    },
    bio: {
        type: String,
        default: ''
    },
    settings: {
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            weeklyReports: { type: Boolean, default: true },
            patientAlerts: { type: Boolean, default: true },
            systemUpdates: { type: Boolean, default: false }
        },
        appearance: {
            theme: { type: String, default: 'auto' },
            colorScheme: { type: String, default: 'blue' },
            fontSize: { type: String, default: 'medium' }
        }
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: {
            type: String,
            default: 'India'
        }
    },

    // Medical information
    bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown', '']
    },
    allergies: [{
        type: String
    }],
    medicalHistory: [{
        type: String
    }],

    // Mental health information
    mentalHealth: {
        currentStatus: {
            type: String,
            enum: ['Stable', 'Mild Symptoms', 'Moderate Symptoms', 'Severe Symptoms', 'In Crisis', '']
        },
        previousDiagnoses: [{
            type: String
        }],
        currentMedications: [{
            type: String
        }],
        therapyHistory: {
            type: String,
            enum: ['Never', 'Past', 'Current', 'Hospitalized', '']
        },
        riskAssessment: {
            type: String,
            enum: ['No', 'Passive', 'Active', 'Recent Attempt', '']
        }
    },

    // Profile image (base64 encoded)
    profileImage: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook to auto-generate patientId
userSchema.pre('save', function (next) {
    if (!this.patientId && this.isNew) {
        // Generate unique patient ID: PT + timestamp + random string
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.random().toString(36).substr(2, 5).toUpperCase();
        this.patientId = `PT${timestamp}${random}`;
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
