import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import userProfileService from './userProfileService.js';

const prisma = new PrismaClient();

const createUser = async ({ username, password, isAdmin, isTeacher, isStudent, profile }) => {
    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    const userData = {
        username,
        password_hash, // Store the hashed password
        created_at: new Date(),
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

    // Create the user profile (if profile data is provided)
    const userProfile = await userProfileService.createUserProfile({
        user_id: user.id,
        nickname: profile?.nickname || null,
        avatar: profile?.avatar || null,
        bias: profile?.bias || null,
    });

    return { user, profile: userProfile };
};

const getAllUsers = async () => {
    return await prisma.user.findMany({
        include: {
            admin: true,
            teacher: true,
            student: true,
            profile: true,
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
            profile: true,
        }, // Include the user profile in the result
    });
};

const updateUser = async (id, { addRole, removeRole, ...userData }) => {
    // Update the user details
    const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: userData,
    });

    // Add a role
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

    // Remove a role
    if (removeRole === 'admin') {
        await prisma.admin.deleteMany({ where: { user_id: id } });
    } else if (removeRole === 'teacher') {
        await prisma.teacher.deleteMany({ where: { user_id: id } });
    }

    return updatedUser;
};

const deleteUser = async (id) => {

    await userProfileService.deleteUserProfile(id);
    await prisma.student.deleteMany({ where: { user_id: id } });
    await prisma.teacher.deleteMany({ where: { user_id: id } });
    await prisma.admin.deleteMany({ where: { user_id: id } });

    return await prisma.user.delete({ where: { id: parseInt(id) } });
};

export default {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};