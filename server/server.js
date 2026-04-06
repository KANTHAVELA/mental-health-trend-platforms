const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { MONGO_URI, PORT } = require('./config');

const analyticsRoutes = require('./routes/analytics');
const entryRoutes = require('./routes/entry');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const apiRoutes = require('./routes/api');
const personalRoutes = require('./routes/personal');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

app.use(limiter);

const connectDatabase = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.warn('MongoDB not available. Running in demo mode with fallback auth data.');
        console.warn('Start MongoDB locally to enable persistent data.');
    }

    return mongoose.connection;
};

app.use('/api', apiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/entry', entryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/personal', personalRoutes);

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        databaseState: mongoose.connection.readyState,
    });
});

app.get('/', (req, res) => {
    res.send('Mental Health Analytics API is running...');
});

const startServer = async (port = PORT) => {
    await connectDatabase();

    return app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

if (require.main === module) {
    startServer().catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
}

module.exports = {
    app,
    connectDatabase,
    startServer,
};
