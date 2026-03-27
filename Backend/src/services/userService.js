import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

const createUser = async ({ name, username, password, isAdmin, isTeacher, isStudent, avatarUrl, bias }) => {
    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    const userData = {
        name,
        username,
        password_hash, // Store the hashed password
        created_at: new Date(),
        avatarUrl,
        bias,
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

const updateUser = async (id, { name, addRole, removeRole, password, avatarUrl, bias, ...userData }) => {

    if (password) {
        const password_hash = await bcrypt.hash(password, 10);
        userData.password_hash = password_hash;
    }

    // Update the user details
    const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: userData,
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

    // Fetch the user's role
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }, // Only fetch the role field
    });

    if (!user) {
        throw new Error(`User with ID ${userId} not found`);
    }

    // Delete role-specific records based on the user's role
    if (user.role === 'student') {
        await prisma.student.deleteMany({ where: { user_id: userId } });
    } else if (user.role === 'teacher') {
        await prisma.teacher.deleteMany({ where: { user_id: userId } });
    } else if (user.role === 'admin') {
        await prisma.admin.deleteMany({ where: { user_id: userId } });
    }

    // Finally, delete the user
    return await prisma.user.delete({ where: { id: userId } });
};

export default {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};