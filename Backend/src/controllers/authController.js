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

        // Set HTTP-only cookies for token and roles
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.cookie('roles', JSON.stringify(roles), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(200).json({ message: 'Login successful', roles });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(401).json({ error: error.message });
    }
};

const logout = (req, res) => {
    // Clear the cookies to log out the user
    res.clearCookie('token');
    res.clearCookie('roles');
    res.status(200).json({ message: 'Logged out successfully' });
};

export default {
    login,
    logout,
};