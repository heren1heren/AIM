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

export default {
    createMessage,
    getAllMessages,
    getMessageById,
};