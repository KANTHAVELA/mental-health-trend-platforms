require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const MoodEntry = require('../models/MoodEntry');
const TrendReport = require('../models/TrendReport');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mental-health-analytics';

const englishPatients = [
    { 
        username: 'Kathir', 
        email: 'kathir@example.com', 
        patientId: 'PT2024001',
        bio: 'Joined for mental health improvement.',
        allergies: ['Dust', 'Peanut'],
        medicalHistory: ['Blood pressure'],
        mentalHealth: {
            currentStatus: 'Stable',
            therapyHistory: 'Current'
        }
    },
    { 
        username: 'Iniya', 
        email: 'iniya@example.com', 
        patientId: 'PT2024002',
        bio: 'Likes peaceful environment.',
        allergies: ['Dairy products'],
        medicalHistory: ['Diabetes'],
        mentalHealth: {
            currentStatus: 'Mild Symptoms',
            therapyHistory: 'Past'
        }
    },
    { 
        username: 'Kani', 
        email: 'kani@example.com', 
        patientId: 'PT2024003',
        bio: 'Art enthusiast.',
        allergies: [],
        medicalHistory: [],
        mentalHealth: {
            currentStatus: 'Stable',
            therapyHistory: 'Never'
        }
    },
    { 
        username: 'Ponni', 
        email: 'ponni@example.com', 
        patientId: 'PT2024004',
        bio: 'Expecting new changes.',
        allergies: ['Seafood'],
        medicalHistory: ['Asthma'],
        mentalHealth: {
            currentStatus: 'Moderate Symptoms',
            therapyHistory: 'Current'
        }
    },
    { 
        username: 'Naveen', 
        email: 'naveen_english@example.com', 
        patientId: 'PT2024005',
        bio: 'Software engineer.',
        allergies: [],
        medicalHistory: [],
        mentalHealth: {
            currentStatus: 'Stable',
            therapyHistory: 'Past'
        }
    },
    { 
        username: 'Selvi', 
        email: 'selvi@example.com', 
        patientId: 'PT2024006',
        bio: 'Working as a teacher.',
        allergies: ['Penicillin'],
        medicalHistory: ['Thyroid'],
        mentalHealth: {
            currentStatus: 'Mild Symptoms',
            therapyHistory: 'Current'
        }
    },
    {
        username: 'Arun',
        email: 'arun@example.com',
        patientId: 'PT2024007',
        bio: 'Sports enthusiast.',
        allergies: [],
        medicalHistory: [],
        mentalHealth: { currentStatus: 'Stable', therapyHistory: 'Never' }
    },
    {
        username: 'Priya',
        email: 'priya@example.com',
        patientId: 'PT2024008',
        bio: 'Yoga practitioner.',
        allergies: ['Dust'],
        medicalHistory: [],
        mentalHealth: { currentStatus: 'Stable', therapyHistory: 'Past' }
    },
    {
        username: 'Vijay',
        email: 'vijay@example.com',
        patientId: 'PT2024009',
        bio: 'Entrepreneur.',
        allergies: [],
        medicalHistory: ['Frequent headaches'],
        mentalHealth: { currentStatus: 'Moderate Symptoms', therapyHistory: 'Current' }
    }
];

const keywords = ['Happiness', 'Peace', 'Worry', 'Tiredness', 'Enthusiasm', 'Fear', 'Relief', 'Stress', 'Hope', 'Anger'];
const categories = ['Work', 'Personal', 'Social', 'Health', 'Family'];

async function seedEnglishPatients() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for English patients seeding');

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        // Delete existing English patients to re-seed with full data
        const emails = englishPatients.map(p => p.email);
        await User.deleteMany({ email: { $in: emails } });

        for (const patient of englishPatients) {
            const user = await User.create({
                username: patient.username,
                email: patient.email,
                password: password,
                role: 'patient',
                patientId: patient.patientId,
                age: Math.floor(Math.random() * 40) + 18,
                sex: Math.random() > 0.5 ? 'Male' : 'Female',
                bio: patient.bio,
                allergies: patient.allergies,
                medicalHistory: patient.medicalHistory,
                mentalHealth: patient.mentalHealth
            });
            console.log(`Created patient: ${patient.username}`);

            // Create Mood Entries
            await MoodEntry.deleteMany({ user: user._id });
            const entries = [];
            const today = new Date();

            // Seed more history - 14 days
            for (let i = 0; i < 14; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);

                // Random number of entries per day (1-2)
                const entriesCount = Math.floor(Math.random() * 2) + 1;
                
                for (let j = 0; j < entriesCount; j++) {
                    const entryDate = new Date(date);
                    entryDate.setHours(Math.floor(Math.random() * 24));
                    
                    const emotion = Math.floor(Math.random() * 10) + 1;
                    const kw = [keywords[Math.floor(Math.random() * keywords.length)]];
                    
                    entries.push({
                        user: user._id,
                        emotion,
                        keywords: kw,
                        category: categories[Math.floor(Math.random() * categories.length)],
                        notes: 'Mood record.',
                        timestamp: entryDate
                    });
                }
            }
            await MoodEntry.insertMany(entries);
            console.log(`Seeded ${entries.length} entries for ${patient.username}`);
        }

        // Create sample Trend Reports for the last 30 days for broader dashboard view
        await TrendReport.deleteMany({});
        for (let i = 0; i < 30; i++) {
            const reportDate = new Date();
            reportDate.setDate(reportDate.getDate() - i);
            
            await TrendReport.create({
                date: reportDate,
                averageMood: (Math.random() * 4 + 5).toFixed(1), // Random mood between 5.0 and 9.0
                topKeywords: [
                    { keyword: keywords[Math.floor(Math.random() * keywords.length)], count: Math.floor(Math.random() * 15) + 5 },
                    { keyword: keywords[Math.floor(Math.random() * keywords.length)], count: Math.floor(Math.random() * 10) + 3 },
                    { keyword: keywords[Math.floor(Math.random() * keywords.length)], count: Math.floor(Math.random() * 8) + 1 }
                ],
                totalEntries: Math.floor(Math.random() * 30) + 20
            });
        }
        console.log('Seeded 30 historical Trend Reports');

        console.log('Seeding complete');
        mongoose.disconnect();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seedEnglishPatients();
