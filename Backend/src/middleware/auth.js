/**
 * Middleware to authorize users based on roles.
 * @param {Array} roles - Array of roles allowed to access the route.
 */
export const authorize = (roles) => (req, res, next) => {
    const userRoles = req.user.roles; // Roles from the JWT payload (set by Passport.js)

    // Check if the user has at least one of the required roles
    const hasRole = roles.some((role) => userRoles.includes(role));

    if (!hasRole) {
        return res.status(403).json({ error: `Access denied with role: ${userRoles} ` }); // Forbidden
    }

    next(); // User is authorized, proceed to the next middleware/controller
};