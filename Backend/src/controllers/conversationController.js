import { validationResult, body, param } from 'express-validator';
import conversationService from '../services/conversationService.js';

// Create a conversation
const createConversation = [
    // Validation rules
    body('type').isString().isIn(['private', 'group', 'class']).withMessage('Type must be one of: private, group, class'),
    body('user_ids').isArray({ min: 2 }).withMessage('user_ids must be an array of at least 2 user IDs'),

    // Controller logic
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { type, user_ids } = req.body;

        try {
            // Pass user_ids to the service layer
            const conversation = await conversationService.createConversation({
                type,
                user_ids, // Pass user_ids to the service
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

// Delete a conversation
const deleteConversation = [
    // Validation rules
    param('id').isInt().withMessage('Conversation ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const deletedConversation = await conversationService.deleteConversation(parseInt(id));
            if (!deletedConversation) {
                return res.status(404).json({ error: 'Conversation not found' });
            }

            res.status(204).send(); // No content response
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete conversation' });
        }
    },
];

// Update a conversation
const updateConversation = [
    // Validation rules
    param('id').isInt().withMessage('Conversation ID must be a valid integer'),
    body('user_ids').isArray({ min: 2 }).withMessage('user_ids must be an array of at least 2 user IDs'),

    // Controller logic
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { user_ids } = req.body;

        try {
            // Pass user_ids to the service layer
            const updatedConversation = await conversationService.updateConversation(parseInt(id), { user_ids });
            if (!updatedConversation) {
                return res.status(404).json({ error: 'Conversation not found' });
            }

            res.status(200).json(updatedConversation);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update conversation' });
        }
    },
];

// Get conversations by sender ID
const getConversationsByUserId = [
    // Validation rules
    param('userId').isInt().withMessage('User ID must be a valid integer'), // Use lowercase 'userId'

    // Controller logic
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId } = req.params;

        try {
            const conversations = await conversationService.getConversationsByUserId(parseInt(userId));
            res.status(200).json(conversations);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch conversations' });
        }
    },
];

export default {
    createConversation,
    getAllConversations,
    getConversationById,
    deleteConversation,
    updateConversation,
    getConversationsByUserId, // Export the new controller
};