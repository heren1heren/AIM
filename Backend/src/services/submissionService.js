import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createSubmission = async (data) => {
    const { assignment_id, student_id, content, files } = data;

    const assignment = await prisma.assignment.findUnique({
        where: { id: assignment_id },
    });

    if (!assignment) {
        throw new Error(`Assignment with ID ${assignment_id} does not exist`);
    }

    const student = await prisma.student.findUnique({
        where: { id: student_id },
    });

    if (!student || student.class_id !== assignment.class_id) {
        throw new Error('Student is not assigned to the class for this assignment');
    }

    return await prisma.submission.create({
        data: {
            assignment_id,
            student_id,
            content,
            files: {
                connect: files,
            },
        },
        include: {
            files: true, // Include files in the response
            assignment: true, // Include assignment details in the response
        },
    });
};

const getAllSubmissions = async () => {
    return await prisma.submission.findMany({
        include: {
            files: true,
            assignment: true,
        },
    });
};

const getSubmissionById = async (id) => {
    return await prisma.submission.findUnique({
        where: { id: parseInt(id) },
        include: {
            files: true,
            assignment: true,
        },
    });
};

const updateSubmission = async (id, data) => {
    return await prisma.submission.update({
        where: { id: parseInt(id) },
        data,
        include: {
            files: true,
            assignment: true,
        },
    });
};

const deleteSubmission = async (id) => {
    return await prisma.submission.delete({
        where: { id: parseInt(id) },
        include: {
            files: true,
            assignment: true,
        },
    });
};

const getSubmissionsByStudentId = async (student_id) => {
    return await prisma.submission.findMany({
        where: { student_id },
        include: {
            files: true,
            assignment: true,
        },
    });
};

const getSubmissionsByAssignmentId = async (assignment_id) => {
    return await prisma.submission.findMany({
        where: { assignment_id },
        include: {
            files: true,
            student: true,
        },
    });
};

export default {
    createSubmission,
    getAllSubmissions,
    getSubmissionById,
    updateSubmission,
    deleteSubmission,
    getSubmissionsByStudentId,
    getSubmissionsByAssignmentId,
};