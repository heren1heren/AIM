import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import fileService from './fileService.js';

const prisma = new PrismaClient();

const createUser = async ({ name, username, password, isAdmin, isTeacher, isStudent, avatarKey, bio }) => {
    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    const userData = {
        name,
        username,
        password_hash, // Store the hashed password
        created_at: new Date(),
        avatarKey, // Use avatarKey instead of avatarUrl
        bio,
    };

    // Create the user
    const user = await prisma.user.create({ data: userData });

    // Handle role-specific relationships
    if (isAdmin) {
        await prisma.admin.create({ data: { user_id: user.id } });
    }
    if (isTeacher) {
        await prisma.teacher.create({ data: { user_id: user.id } });
    }
    if (isStudent) {
        await prisma.student.create({ data: { user_id: user.id } });
    }

    return { user };
};

const getAllUsers = async () => {
    return await prisma.user.findMany({
        where: {
            admin: null, // Exclude users with the admin role
        },
        include: {
            teacher: true,
            student: true,
        },
    });
};

const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: {
            admin: true,
            teacher: true,
            student: true,
        },
    });
};

const updateUser = async (id, { name, addRole, removeRole, password, avatarKey, bio, ...userData }) => {
    if (password) {
        const password_hash = await bcrypt.hash(password, 10);
        userData.password_hash = password_hash;
    }

    // Update the user details
    const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
            name,
            avatarKey, // Update avatarKey instead of avatarUrl
            bio,
            ...userData,
            updated_at: new Date(),
        },
    });

    if (addRole === 'admin') {
        const existingAdmin = await prisma.admin.findUnique({
            where: { user_id: id },
        });
        if (!existingAdmin) {
            await prisma.admin.create({ data: { user_id: id } });
        }
    } else if (addRole === 'teacher') {
        const existingTeacher = await prisma.teacher.findUnique({
            where: { user_id: id },
        });
        if (!existingTeacher) {
            await prisma.teacher.create({ data: { user_id: id } });
        }
    }

    // dependencies are also needed to be deleted
    if (removeRole === 'admin') {
        await prisma.admin.deleteMany({ where: { user_id: id } });
    } else if (removeRole === 'teacher') {
        await prisma.teacher.deleteMany({ where: { user_id: id } });
    }

    return updatedUser;
};

const deleteUser = async (id) => {
    const userId = parseInt(id);

    // Fetch the user's role based on relations
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            admin: true, // Check if the user is an admin
            teacher: true, // Check if the user is a teacher
            student: true, // Check if the user is a student
        },
    });

    if (!user) {
        throw new Error(`User with ID ${userId} not found`);
    }

    // Determine the user's role based on the relations
    if (user.admin) {
        // Delete admin-specific records
        await prisma.admin.deleteMany({ where: { user_id: userId } });
    } else if (user.teacher) {
        // Delete teacher-specific records
        await prisma.teacher.deleteMany({ where: { user_id: userId } });
    } else if (user.student) {
        // Delete student-specific records
        await prisma.student.deleteMany({ where: { user_id: userId } });
    }

    // Finally, delete the user
    return await prisma.user.delete({ where: { id: userId } });
};

// Get user profile by ID
const getUserProfileById = async (id) => {
    return await prisma.user.findUnique({
        where: { id: parseInt(id) },
        select: {
            id: true,
            name: true,
            username: true,
            avatarKey: true, // Return avatarKey instead of avatarUrl
            bio: true,
            created_at: true,
            updated_at: true,
        },
    });
};

// Update user profile
const updateUserProfile = async (id, { name, avatarKey, bio }) => {
    return await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
            name,
            avatarKey, // Update avatarKey instead of avatarUrl
            bio,
            updated_at: new Date(),
        },
    });
};


export default {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserProfileById,
    updateUserProfile,

};