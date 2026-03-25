import authService from '../services/authService.js';

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verify user credentials
        const { user, roles } = await authService.verifyCredentials(username, password);


        const accessToken = authService.generateToken(user, roles, 1800, "30m"); // E

        const refreshToken = authService.generateToken(user, roles, "7d"); // Expires in 7 days

        console.log('Tokens generated for:', user.username);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // Use secure cookies in production
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });


        res.status(200).json({ message: "Login successful", accessToken, roles });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(401).json({ error: error.message });
    }
};

const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ error: "Unauthorized: No refresh token provided" });
    }

    try {
        // Verify the refresh token
        const decoded = authService.verifyToken(refreshToken);

        // Generate a new access token
        const accessToken = authService.generateToken(
            { id: decoded.id }, // Pass only the user object
            decoded.roles, // Pass roles separately
            '30m' // Expires in 30 minutes
        );

        res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Error during token refresh:', error.message);
        res.status(401).json({ error: "Unauthorized: Invalid or expired refresh token" });
    }
};

const logout = (req, res) => {
    // Clear the refresh token cookie to log out the user
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
};

export default {
    login,
    refreshAccessToken,
    logout,
};