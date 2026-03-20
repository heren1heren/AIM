import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createClass = async (data) => {
    return await prisma.class.create({ data });
};

const getAllClasses = async () => {
    return await prisma.class.findMany({
        include: { teacher: true, students: true },
    });
};

const getClassById = async (id) => {
    return await prisma.class.findUnique({
        where: { id: parseInt(id) },
        include: { teacher: true, students: true },
    });
};

const updateClass = async (id, data) => {
    return await prisma.class.update({
        where: { id: parseInt(id) },
        data,
    });
};

const deleteClass = async (id) => {
    return await prisma.class.delete({ where: { id: parseInt(id) } });
};

export default {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass,
};