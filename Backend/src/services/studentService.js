import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all students
const getAllStudents = async () => {
    return await prisma.student.findMany({
        include: {
            user: true, // Include the related user data
        },
    });
};

// Get a student by ID
const getStudentById = async (id) => {
    return await prisma.student.findUnique({
        where: { user_id: parseInt(id) }, // Query the student table using user_id
        include: {
            user: true,
            class: true,// Include the related user data
        },
    });
};

// Create a student
const createStudent = async (user_id) => {
    // Check if the user exists and has the role of "student"
    const user = await prisma.user.findUnique({ where: { id: user_id } });
    if (!user) {
        throw new Error('User not found');
    }
    if (user.role !== 'student') {
        throw new Error('User must have the role of student');
    }

    // Check if the student already exists
    const existingStudent = await prisma.student.findUnique({ where: { user_id } });
    if (existingStudent) {
        throw new Error('Student already exists for this user');
    }

    // Create the student
    return await prisma.student.create({
        data: {
            user_id,
        },
    });
};

// Update a student
const updateStudent = async (id, data) => {
    // Update the student
    return await prisma.student.update({
        where: { id: parseInt(id) },
        data,
    });
};

// Delete a student
const deleteStudent = async (id) => {
    // Delete the student
    return await prisma.student.delete({
        where: { id: parseInt(id) },
    });
};

export default {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
};