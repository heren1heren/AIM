import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createAssignment = async (data) => {
    return await prisma.assignment.create({ data });
};

const getAllAssignments = async () => {
    return await prisma.assignment.findMany({
        include: { class: true },
    });
};

const getAssignmentById = async (id) => {
    return await prisma.assignment.findUnique({
        where: { id: parseInt(id) },
        include: { class: true },
    });
};

const updateAssignment = async (id, data) => {
    return await prisma.assignment.update({
        where: { id: parseInt(id) },
        data,
    });
};

const deleteAssignment = async (id) => {
    return await prisma.assignment.delete({ where: { id: parseInt(id) } });
};

export default {
    createAssignment,
    getAllAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
};