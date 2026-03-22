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
const generateToken = (user, roles) => {
    const payload = {
        id: user.id,
        roles,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }); // Token valid for 1 day
};

export default {
    verifyCredentials,
    generateToken,
};