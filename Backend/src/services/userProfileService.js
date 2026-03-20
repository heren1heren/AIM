import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a user profile
const createUserProfile = async ({ user_id, nickname, avatar, bias }) => {
    try {
        const userProfile = await prisma.userProfile.create({
            data: {
                user_id, // Use the correct field name
                nickname,
                avatar,
                bias,
            },
        });
        return userProfile;
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw new Error('Failed to create user profile');
    }
};

// Get a user profile by user_id
const getUserProfileByUserId = async (user_id) => {
    try {
        const userProfile = await prisma.userProfile.findUnique({
            where: { user_id }, // Use the correct field name
        });
        return userProfile;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw new Error('Failed to fetch user profile');
    }
};

// Update a user profile
const updateUserProfile = async (id, data) => {
    try {
        const updatedUserProfile = await prisma.userProfile.update({
            where: { user_id: id },
            data,
        });
        return updatedUserProfile;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw new Error('Failed to update user profile');
    }
};

// Delete a user profile
const deleteUserProfile = async (user_id) => {
    try {
        // Check if the UserProfile exists
        const userProfile = await prisma.userProfile.findUnique({
            where: { user_id },
        });

        if (!userProfile) {
            console.warn(`No UserProfile found for user_id: ${user_id}`);
            return; // Skip deletion if no UserProfile exists
        }

        // Proceed to delete the UserProfile
        await prisma.userProfile.delete({
            where: { user_id },
        });
    } catch (error) {
        console.error('Error deleting user profile:', error);
        throw new Error('Failed to delete user profile');
    }
};

export default {
    createUserProfile,
    getUserProfileByUserId,
    updateUserProfile,
    deleteUserProfile,
};
