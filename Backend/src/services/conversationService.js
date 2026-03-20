import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createConversation = async (data) => {
    return await prisma.conversation.create({
        data,
        include: { participants: true, messages: true },
    });
};

const getAllConversations = async () => {
    return await prisma.conversation.findMany({
        include: { participants: true, messages: true },
    });
};

const getConversationById = async (id) => {
    return await prisma.conversation.findUnique({
        where: { id: parseInt(id) },
        include: { participants: true, messages: true },
    });
};

export default {
    createConversation,
    getAllConversations,
    getConversationById,
};