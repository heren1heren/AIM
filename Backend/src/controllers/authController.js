import authService from '../services/authService.js';

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log('Attempting login for:', username);

        // Verify user credentials
        const { user, roles } = await authService.verifyCredentials(username, password);

        console.log('User verified:', user.username);

        // Generate a JWT token
        const token = authService.generateToken(user, roles);

        console.log('Token generated for:', user.username);

        res.status(200).json({ token, roles });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(401).json({ error: error.message });
    }
};

const logout = (req, res) => {
    // Since JWTs are stateless, logout is handled on the client side by removing the token.
    res.status(200).json({ message: 'Logged out successfully' });
};

export default {
    login,
    logout,
};