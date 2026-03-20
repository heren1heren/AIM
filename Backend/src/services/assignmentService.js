import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createAssignment = async (data) => {
    try {
        return await prisma.assignment.create({ data });
    } catch (error) {
        console.error('Error creating assignment:', error);
        throw new Error('Failed to create assignment');
    }
};

const getAllAssignments = async () => {
    try {
        return await prisma.assignment.findMany({
            include: { class: true },
        });
    } catch (error) {
        console.error('Error fetching all assignments:', error);
        throw new Error('Failed to fetch assignments');
    }
};

const getAssignmentById = async (id) => {
    try {
        return await prisma.assignment.findUnique({
            where: { id: parseInt(id) },
            include: { class: true },
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
        });
    } catch (error) {
        console.error(`Error deleting assignment with ID ${id}:`, error);
        throw new Error('Failed to delete assignment');
    }
};

export default {
    createAssignment,
    getAllAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
};