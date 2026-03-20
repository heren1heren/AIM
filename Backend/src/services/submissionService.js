import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createSubmission = async ({ assignment_id, student_id, content }) => {
    // Validate that the assignment exists
    const assignment = await prisma.assignment.findUnique({
        where: { id: assignment_id },
        include: { class: true }, // Include the class to validate the student
    });
    if (!assignment) {
        throw new Error('Assignment not found');
    }

    // Validate that the student exists
    const student = await prisma.student.findUnique({
        where: { id: student_id },
        include: { user: true }, // Include the user for additional validation if needed
    });
    if (!student) {
        throw new Error('Student not found');
    }

    // Validate that the student is part of the class associated with the assignment
    const isStudentInClass = await prisma.class.findFirst({
        where: {
            id: assignment.class_id,
            students: {
                some: { id: student_id }, // Check if the student is part of the class
            },
        },
    });
    if (!isStudentInClass) {
        throw new Error('Student is not assigned to the class for this assignment');
    }

    // Create the submission
    return await prisma.submission.create({
        data: {
            assignment_id,
            student_id,
            content,
        },
    });
};

const getAllSubmissions = async () => {
    return await prisma.submission.findMany({
        include: { assignment: true, student: true },
    });
};

const getSubmissionById = async (id) => {
    return await prisma.submission.findUnique({
        where: { id: parseInt(id) },
        include: { assignment: true, student: true },
    });
};

const updateSubmission = async (id, data) => {
    return await prisma.submission.update({
        where: { id: parseInt(id) },
        data,
    });
};

const deleteSubmission = async (id) => {
    return await prisma.submission.delete({ where: { id: parseInt(id) } });
};

export default {
    createSubmission,
    getAllSubmissions,
    getSubmissionById,
    updateSubmission,
    deleteSubmission,
};