const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const requireAuth = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);

            req.user = decoded;
            return next();
        } catch (error) {
            console.error('Not authorized, token failed:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    return res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = requireAuth;
