import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createSubmission = async (data) => {
    try {
        // Fetch the assignment to get its class_id
        const assignment = await prisma.assignment.findUnique({
            where: { id: data.assignment_id },
        });

        if (!assignment) {
            throw new Error(`Assignment with ID ${data.assignment_id} does not exist`);
        }

        // Check if the student is assigned to the class for this assignment
        const student = await prisma.student.findUnique({
            where: { id: data.student_id },
        });

        if (!student || student.class_id !== assignment.class_id) {
            throw new Error('Student is not assigned to the class for this assignment');
        }

        // Create the submission
        return await prisma.submission.create({
            data: {
                assignment_id: data.assignment_id,
                student_id: data.student_id,
                content: data.content,
            },
        });
    } catch (error) {
        console.error('Error creating submission:', error);
        throw new Error('Failed to create submission');
    }
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

const getSubmissionsByStudentId = async (student_id) => {
    try {
        return await prisma.submission.findMany({
            where: { student_id },
            include: { assignment: true }, // Include assignment details
        });
    } catch (error) {
        console.error(`Error fetching submissions for student ID ${student_id}:`, error);
        throw new Error('Failed to fetch submissions for the student');
    }
};

const getSubmissionsByAssignmentId = async (assignment_id) => {
    try {
        return await prisma.submission.findMany({
            where: { assignment_id },
            include: { student: true }, // Include student details
        });
    } catch (error) {
        console.error(`Error fetching submissions for assignment ID ${assignment_id}:`, error);
        throw new Error('Failed to fetch submissions for the assignment');
    }
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