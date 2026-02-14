const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mental-health-analytics')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

const analyticsRoutes = require('./routes/analytics');
const entryRoutes = require('./routes/entry');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');

// Routes
app.use('/api/analytics', analyticsRoutes);
app.use('/api/entry', entryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

app.get('/', (req, res) => {
    res.send('Mental Health Analytics API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
