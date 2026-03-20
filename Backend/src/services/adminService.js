import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all admins
const getAllAdmins = async () => {
    return await prisma.user.findMany({
        where: { role: 'admin' }, // Ensure only users with the 'admin' role are fetched
        include: { admin: true }, // Include admin-specific details
    });
};

// Get an admin by ID
const getAdminById = async (id) => {
    return await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: { admin: true }, // Include admin-specific details
    });
};

// Create an admin
const createAdmin = async (data) => {
    const { user_id } = data;

    // Ensure the user exists and is not already an admin
    const user = await prisma.user.findUnique({ where: { id: user_id } });
    if (!user) {
        throw new Error('User not found');
    }
    if (user.role === 'admin') {
        throw new Error('User is already an admin');
    }

    // Update the user's role to 'admin' and create the admin record
    return await prisma.$transaction([
        prisma.user.update({
            where: { id: user_id },
            data: { role: 'admin' },
        }),
        prisma.admin.create({
            data: { user_id },
        }),
    ]);
};

// Update an admin
const updateAdmin = async (id, data) => {
    const { user_id } = data;

    // Ensure the admin exists
    const admin = await prisma.admin.findUnique({ where: { id: parseInt(id) } });
    if (!admin) {
        throw new Error('Admin not found');
    }

    // Update the admin's user_id if provided
    if (user_id) {
        const user = await prisma.user.findUnique({ where: { id: user_id } });
        if (!user) {
            throw new Error('User not found');
        }

        return await prisma.admin.update({
            where: { id: parseInt(id) },
            data: { user_id },
        });
    }

    return admin; // Return the existing admin if no updates are made
};

// Delete an admin
const deleteAdmin = async (id) => {
    // Ensure the admin exists
    const admin = await prisma.admin.findUnique({ where: { id: parseInt(id) } });
    if (!admin) {
        throw new Error('Admin not found');
    }

    // Delete the admin record and revert the user's role
    return await prisma.$transaction([
        prisma.admin.delete({ where: { id: parseInt(id) } }),
        prisma.user.update({
            where: { id: admin.user_id },
            data: { role: 'user' }, // Revert the role to 'user' or another default role
        }),
    ]);
};

export default {
    getAllAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin,
};