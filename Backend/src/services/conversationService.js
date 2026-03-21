import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a conversation
const createConversation = async (data) => {
    try {
        return await prisma.conversation.create({
            data: {
                type: data.type,
                users: {
                    connect: data.user_ids.map((id) => ({ id })), // Connect existing users by their IDs
                },
            },
            include: {
                users: true, // Include users in the response
                messages: true, // Include messages in the response
            },
        });
    } catch (error) {
        console.error('Error creating conversation:', error);
        throw new Error('Failed to create conversation');
    }
};

// Get all conversations
const getAllConversations = async () => {
    try {
        return await prisma.conversation.findMany({
            include: {
                users: true, // Include users in the response
                messages: true, // Include messages in the response
            },
        });
    } catch (error) {
        console.error('Error fetching all conversations:', error);
        throw new Error('Failed to fetch conversations');
    }
};

// Get a conversation by ID
const getConversationById = async (id) => {
    try {
        return await prisma.conversation.findUnique({
            where: { id: parseInt(id) },
            include: {
                users: true, // Include users in the response
                messages: true, // Include messages in the response
            },
        });
    } catch (error) {
        console.error(`Error fetching conversation with ID ${id}:`, error);
        throw new Error('Failed to fetch conversation');
    }
};

// Delete a conversation
const deleteConversation = async (id) => {
    try {
        return await prisma.conversation.delete({
            where: { id: parseInt(id) },
        });
    } catch (error) {
        console.error(`Error deleting conversation with ID ${id}:`, error);
        throw new Error('Failed to delete conversation');
    }
};

// Update a conversation (e.g., add or remove users)
const updateConversation = async (id, data) => {
    try {
        return await prisma.conversation.update({
            where: { id: parseInt(id) },
            data: {
                users: {
                    set: data.user_ids.map((id) => ({ id })), // Replace the existing users with the new ones
                },
            },
            include: {
                users: true, // Include updated users in the response
            },
        });
    } catch (error) {
        console.error(`Error updating conversation with ID ${id}:`, error);
        throw new Error('Failed to update conversation');
    }
};

// Get conversations by a specific user ID
const getConversationsByUserId = async (user_id) => {
    try {
        return await prisma.conversation.findMany({
            where: {
                users: {
                    some: { id: user_id }, // Check if the user is part of the conversation
                },
            },
            include: {
                users: true, // Include users in the response
                messages: {
                    orderBy: { created_at: 'desc' }, // Include messages sorted by creation date
                },
            },
        });
    } catch (error) {
        console.error(`Error fetching conversations for user ID ${user_id}:`, error);
        throw new Error('Failed to fetch conversations');
    }
};

export default {
    createConversation,
    getAllConversations,
    getConversationById,
    deleteConversation,
    updateConversation,
    getConversationsByUserId,
};