import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createMessage = async (data) => {
    return await prisma.message.create({ data });
};

const getAllMessages = async () => {
    return await prisma.message.findMany({
        include: { conversation: true, sender: true },
    });
};

const getMessageById = async (id) => {
    return await prisma.message.findUnique({
        where: { id: parseInt(id) },
        include: { conversation: true, sender: true },
    });
};

export default {
    createMessage,
    getAllMessages,
    getMessageById,
};