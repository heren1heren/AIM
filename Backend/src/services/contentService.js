import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createContent = async (data) => {
    return await prisma.content.create({ data });
};

const getAllContent = async () => {
    return await prisma.content.findMany({
        include: { class: true, files: true },
    });
};

const getContentById = async (id) => {
    return await prisma.content.findUnique({
        where: { id: parseInt(id) },
        include: { class: true, files: true },
    });
};

const updateContent = async (id, data) => {
    return await prisma.content.update({
        where: { id: parseInt(id) },
        data,
    });
};

const deleteContent = async (id) => {
    return await prisma.content.delete({
        where: { id: parseInt(id) },
    });
};

export default {
    createContent,
    getAllContent,
    getContentById,
    updateContent,
    deleteContent,
};