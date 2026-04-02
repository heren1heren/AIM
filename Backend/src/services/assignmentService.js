import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createAssignment = async (data) => {
    const { files, ...rest } = data;

    try {
        return await prisma.assignment.create({
            data: {
                ...rest,
                files: {
                    connect: files.map((file) => ({ id: file.id })), // Attach files by their IDs
                },
            },
            include: {
                files: true, // Include files in the response
                submissions: true, // Include submissions in the response
            },
        });
    } catch (error) {
        console.error('Error creating assignment:', error);
        throw new Error('Failed to create assignment');
    }
};

const getAllAssignments = async () => {
    try {
        return await prisma.assignment.findMany({
            include: {
                class: true,
                files: true, // Include files in the response
                submissions: true, // Include submissions in the response
            },
        });
    } catch (error) {
        console.error('Error fetching all assignments:', error);
        throw new Error('Failed to fetch assignments');
    }
};

const getAssignmentsByClassId = async (classId) => {
    return await prisma.assignment.findMany({
        where: { class_id: parseInt(classId) },
        include: {
            files: true, // Include files in the response
            submissions: true, // Include submissions in the response
        },
    });
};

const getAssignmentsByStudentId = async (studentId) => {
    try {
        // Fetch the class_id for the student
        const student = await prisma.student.findUnique({
            where: { id: parseInt(studentId) },
            select: { class_id: true }, // Only fetch the class_id
        });

        if (!student) {
            throw new Error(`Student with ID ${studentId} not found`);
        }

        // Fetch assignments for the student's class_id
        return await prisma.assignment.findMany({
            where: { class_id: student.class_id },
            include: {
                class: true,
                files: true, // Include files in the response
                submissions: true, // Include submissions in the response
            },
        });
    } catch (error) {
        console.error(`Error fetching assignments for student ID ${studentId}:`, error);
        throw new Error('Failed to fetch assignments');
    }
};

const getAssignmentById = async (id) => {
    try {
        return await prisma.assignment.findUnique({
            where: { id: parseInt(id) },
            include: {
                class: true,
                files: true, // Include files in the response
                submissions: true, // Include submissions in the response
            },
        });
    } catch (error) {
        console.error(`Error fetching assignment with ID ${id}:`, error);
        throw new Error('Failed to fetch assignment');
    }
};

const updateAssignment = async (id, data) => {
    try {
        return await prisma.assignment.update({
            where: { id: parseInt(id) },
            data,
            include: {
                files: true, // Include files in the response
                submissions: true, // Include submissions in the response
            },
        });
    } catch (error) {
        console.error(`Error updating assignment with ID ${id}:`, error);
        throw new Error('Failed to update assignment');
    }
};

const deleteAssignment = async (id) => {
    try {
        return await prisma.assignment.delete({
            where: { id: parseInt(id) },
            include: {
                files: true, // Include files in the response
                submissions: true, // Include submissions in the response
            },
        });
    } catch (error) {
        console.error(`Error deleting assignment with ID ${id}:`, error);
        throw new Error('Failed to delete assignment');
    }
};

export default {
    createAssignment,
    getAllAssignments,
    getAssignmentsByClassId,
    getAssignmentsByStudentId,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
};