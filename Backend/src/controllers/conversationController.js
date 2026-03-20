import { validationResult, body, param } from 'express-validator';
import conversationService from '../services/conversationService.js';

// Create a conversation
const createConversation = [
    // Validation rules
    body('type').isString().isIn(['private', 'group', 'class']).withMessage('Type must be one of: private, group, class'),
    body('participants').isArray().withMessage('Participants must be an array of user IDs'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { type, participants } = req.body;

        try {
            const conversation = await conversationService.createConversation({
                type,
                participants: {
                    create: participants.map((user_id) => ({ user_id })),
                },
            });

            res.status(201).json(conversation);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create conversation' });
        }
    },
];

// Get all conversations
const getAllConversations = async (req, res) => {
    try {
        const conversations = await conversationService.getAllConversations();
        res.status(200).json(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
};

// Get a conversation by ID
const getConversationById = [
    // Validation rules
    param('id').isInt().withMessage('Conversation ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const conversation = await conversationService.getConversationById(parseInt(id));
            if (!conversation) {
                return res.status(404).json({ error: 'Conversation not found' });
            }

            res.status(200).json(conversation);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch conversation' });
        }
    },
];

export default {
    createConversation,
    getAllConversations,
    getConversationById,
};