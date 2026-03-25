import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Verify user credentials
const verifyCredentials = async (username, password) => {
    const user = await prisma.user.findUnique({
        where: { username },
        include: { admin: true, teacher: true, student: true }, // Include roles
    });

    if (!user) {
        throw new Error('Invalid username or password');
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        throw new Error('Invalid username or password');
    }

    // Determine roles
    const roles = [];
    if (user.admin) roles.push('admin');
    if (user.teacher) roles.push('teacher');
    if (user.student) roles.push('student');

    return { user, roles };
};

// Generate JWT token
const generateToken = (user, roles, expiresIn) => {
    const payload = {
        id: user.id,
        roles,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// Verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.error('Error verifying token:', error.message);
        throw error; // Rethrow the error to be handled by the caller
    }
};

const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        console.error('No refresh token provided');
        return res.status(401).json({ error: "Unauthorized: No refresh token provided" });
    }

    try {
        console.log('Received Refresh Token:', refreshToken);

        // Verify the refresh token
        const decoded = verifyToken(refreshToken);
        console.log('Decoded Refresh Token:', decoded);

        // Generate a new access token
        const accessToken = generateToken(
            { id: decoded.id, roles: decoded.roles },
            30 * 60 // 30 minutes in seconds
        );

        res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Error during token verification:', error.message);
        res.status(401).json({ error: "Unauthorized: Invalid or expired refresh token" });
    }
};

export default {
    verifyCredentials,
    generateToken,
    verifyToken,
    refreshAccessToken,
};