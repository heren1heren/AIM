import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createContent = async (data) => {
    try {
        return await prisma.content.create({ data });
    } catch (error) {
        console.error('Error creating content:', error);
        throw new Error('Failed to create content');
    }
};

const getAllContent = async () => {
    try {
        return await prisma.content.findMany({
            include: { class: true, files: true },
        });
    } catch (error) {
        console.error('Error fetching all content:', error);
        throw new Error('Failed to fetch content');
    }
};

const getContentById = async (id) => {
    try {
        return await prisma.content.findUnique({
            where: { id: parseInt(id) },
            include: { class: true, files: true },
        });
    } catch (error) {
        console.error(`Error fetching content with ID ${id}:`, error);
        throw new Error('Failed to fetch content');
    }
};

const updateContent = async (id, data) => {
    try {
        return await prisma.content.update({
            where: { id: parseInt(id) },
            data,
        });
    } catch (error) {
        console.error(`Error updating content with ID ${id}:`, error);
        throw new Error('Failed to update content');
    }
};

const deleteContent = async (id) => {
    try {
        return await prisma.content.delete({
            where: { id: parseInt(id) },
        });
    } catch (error) {
        console.error(`Error deleting content with ID ${id}:`, error);
        throw new Error('Failed to delete content');
    }
};

export default {
    createContent,
    getAllContent,
    getContentById,
    updateContent,
    deleteContent,
};