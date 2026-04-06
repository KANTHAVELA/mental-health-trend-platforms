const DEFAULT_PORT = 5000;
const DEFAULT_MONGO_URI = 'mongodb://localhost:27017/mental-health-analytics';
const DEFAULT_JWT_SECRET = 'mindflow_super_secret_key_2024';

module.exports = {
    PORT: Number(process.env.PORT) || DEFAULT_PORT,
    MONGO_URI: process.env.MONGO_URI || DEFAULT_MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
};
