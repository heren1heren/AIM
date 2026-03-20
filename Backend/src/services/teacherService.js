import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all teachers
const getAllTeachers = async () => {
    return await prisma.user.findMany({
        where: { role: 'teacher' },
        include: { teacher: true },
    });
};

// Get a teacher by ID
const getTeacherById = async (id) => {
    return await prisma.user.findUnique({
        where: { user_id: parseInt(id) },
        include: { teacher: true },
    });
};

// Create a teacher
const createTeacher = async (user_id) => {
    // Check if the user exists and has the role of "teacher"
    const user = await prisma.user.findUnique({ where: { id: user_id } });
    if (!user) {
        throw new Error('User not found');
    }
    if (user.role !== 'teacher') {
        throw new Error('User must have the role of teacher');
    }

    // Check if the teacher already exists
    const existingTeacher = await prisma.teacher.findUnique({ where: { user_id } });
    if (existingTeacher) {
        throw new Error('Teacher already exists for this user');
    }

    // Create the teacher
    return await prisma.teacher.create({
        data: {
            user_id,
        },
    });
};

// Update a teacher
const updateTeacher = async (id, data) => {
    // Update the teacher
    return await prisma.teacher.update({
        where: { id: parseInt(id) },
        data,
    });
};

// Delete a teacher
const deleteTeacher = async (id) => {
    // Delete the teacher
    return await prisma.teacher.delete({
        where: { id: parseInt(id) },
    });
};

export default {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher,
};