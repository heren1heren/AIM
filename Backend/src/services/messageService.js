import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createMessage = async (data) => {
    try {
        // Validate conversation existence
        const conversationExists = await prisma.conversation.findUnique({
            where: { id: data.conversation_id },
        });

        if (!conversationExists) {
            throw new Error(`Conversation with ID ${data.conversation_id} does not exist`);
        }

        // Create the message
        return await prisma.message.create({
            data: {
                conversation_id: data.conversation_id,
                sender_id: data.sender_id,
                recipient_id: data.recipient_id || null, // Allow null for group messages
                content: data.content,
            },
        });
    } catch (error) {
        console.error('Error creating message:', error);
        throw new Error('Failed to create message');
    }
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

const getMessagesByConversationId = async (conversationId) => {
    try {
        return await prisma.message.findMany({
            where: { conversation_id: conversationId },
            include: { sender: true }, // Include sender details if needed
        });
    } catch (error) {
        console.error(`Error fetching messages for conversation ID ${conversationId}:`, error);
        throw new Error('Failed to fetch messages');
    }
};

const deleteMessage = async (id) => {
    try {
        return await prisma.message.delete({
            where: { id: parseInt(id) },
        });
    } catch (error) {
        console.error(`Error deleting message with ID ${id}:`, error);
        throw new Error('Failed to delete message');
    }
};

const updateMessage = async (id, data) => {
    try {
        return await prisma.message.update({
            where: { id: parseInt(id) },
            data: {
                content: data.content, // Update only the content field
            },
        });
    } catch (error) {
        console.error(`Error updating message with ID ${id}:`, error);
        throw new Error('Failed to update message');
    }
};

export default {
    createMessage,
    getAllMessages,
    getMessageById,
    getMessagesByConversationId,
    updateMessage,
    deleteMessage,
};