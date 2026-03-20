import { PrismaClient } from '@prisma/client';
import userProfileService from './userProfileService.js'; // Import userProfileService

const prisma = new PrismaClient();

const createUser = async ({ username, password_hash, role, name, profile }) => {

    const userData = {
        username,
        password_hash,
        role,
        name: name || null,
        created_at: new Date(),
    };

    // Handle role-specific relationships
    if (role === 'admin') {
        userData.admin = { create: {} };
    } else if (role === 'teacher') {
        userData.teacher = { create: {} };
    } else if (role === 'student') {
        userData.student = { create: {} };
    }

    // Create the user
    const user = await prisma.user.create({ data: userData });

    // Create the user profile (if profile data is provided)
    const userProfile = await userProfileService.createUserProfile({
        user_id: user.id,
        nickname: profile?.nickname || null, // Use provided data or default to null
        avatar: profile?.avatar || null,
        bias: profile?.bias || null,
    });

    return { user, profile: userProfile };
};

const getAllUsers = async () => {
    return await prisma.user.findMany({
        include: { profile: true }, // Include the user profile in the result
    });
};

const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: { profile: true }, // Include the user profile in the result
    });
};

const updateUser = async (id, data) => {
    const { profile, ...userData } = data;

    // Update the user
    const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: userData,
    });

    // If profile data is provided, update the user profile
    let updatedProfile = null;
    if (profile) {
        updatedProfile = await userProfileService.updateUserProfile(id, profile);
    }

    return { user: updatedUser, profile: updatedProfile };
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