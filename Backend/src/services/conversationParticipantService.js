import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const addParticipant = async (data) => {
    return await prisma.conversationParticipant.create({ data });
};

const removeParticipant = async (id) => {
    return await prisma.conversationParticipant.delete({
        where: { id: parseInt(id) },
    });
};

const getParticipantsByConversationId = async (conversationId) => {
    return await prisma.conversationParticipant.findMany({
        where: { conversation_id: parseInt(conversationId) },
        include: { user: true },
    });
};

export default {
    addParticipant,
    removeParticipant,
    getParticipantsByConversationId,
};