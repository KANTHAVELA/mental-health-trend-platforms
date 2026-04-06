/**
 * Role Authorization Middleware
 * 
 * Restricts access to routes based on user roles.
 * 
 * Usage:
 * router.get('/admin', requireAuth, requireRole(['admin']), adminController);
 * 
 * Flow:
 * 1. Check if req.user exists (ensure requireAuth is called first)
 * 2. Check if req.user.role is in the allowedRoles array
 * 3. If allowed, proceed to next middleware
 * 4. If denied, return 403 Forbidden
 * 
 * @param {Array<string>} allowedRoles - Array of roles allowed to access the route
 */
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            console.warn(`Security Alert: User ${req.user.id} with role '${req.user.role}' attempted to access protected resource.`);
            return res.status(403).json({
                message: 'Forbidden: You do not have permission to perform this action',
                alert: 'Security violation logged'
            });
        }

        next();
    };
};

module.exports = requireRole;
