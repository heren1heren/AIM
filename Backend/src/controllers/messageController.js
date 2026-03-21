import { validationResult, body, param } from 'express-validator';
import messageService from '../services/messageService.js';

// Create a message
const createMessage = [
    // Validation rules
    body('conversation_id').isInt().withMessage('Conversation ID must be a valid integer'),
    body('sender_id').isInt().withMessage('Sender ID must be a valid integer'),
    body('content').isString().notEmpty().withMessage('Content is required'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { conversation_id, sender_id, content } = req.body;

        try {
            const message = await messageService.createMessage({
                conversation_id,
                sender_id,
                content,
            });

            res.status(201).json(message);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create message' });
        }
    },
];

// Get all messages
const getAllMessages = async (req, res) => {
    try {
        const messages = await messageService.getAllMessages();
        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

// Get a message by ID
const getMessageById = [
    // Validation rules
    param('id').isInt().withMessage('Message ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const message = await messageService.getMessageById(parseInt(id));
            if (!message) {
                return res.status(404).json({ error: 'Message not found' });
            }

            res.status(200).json(message);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch message' });
        }
    },
];

// Get messages by conversation ID
const getMessagesByConversationId = [
    // Validation rules
    param('conversationId').isInt().withMessage('Conversation ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { conversationId } = req.params;

        try {
            const messages = await messageService.getMessagesByConversationId(parseInt(conversationId));
            res.status(200).json(messages);
        } catch (error) {
            console.error('Error fetching messages by conversation ID:', error);
            res.status(500).json({ error: 'Failed to fetch messages' });
        }
    },
];

// Update a message
const updateMessage = [
    // Validation rules
    param('id').isInt().withMessage('Message ID must be a valid integer'),
    body('content').optional().isString().notEmpty().withMessage('Content must be a non-empty string'),

    // Controller logic
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { content } = req.body;

        try {
            const updatedMessage = await messageService.updateMessage(parseInt(id), { content });

            if (!updatedMessage) {
                return res.status(404).json({ error: 'Message not found' });
            }

            res.status(200).json(updatedMessage);
        } catch (error) {
            console.error('Error updating message:', error);
            res.status(500).json({ error: 'Failed to update message' });
        }
    },
];

// Delete a message
const deleteMessage = [
    // Validation rules
    param('id').isInt().withMessage('Message ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const deletedMessage = await messageService.deleteMessage(parseInt(id));
            if (!deletedMessage) {
                return res.status(404).json({ error: 'Message not found' });
            }

            res.status(204).send(); // No content response
        } catch (error) {
            console.error('Error deleting message:', error);
            res.status(500).json({ error: 'Failed to delete message' });
        }
    },
];

export default {
    createMessage,
    getAllMessages,
    getMessageById,
    getMessagesByConversationId,
    updateMessage, // Export the new controller
    deleteMessage,
};