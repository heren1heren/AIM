import { validationResult, body, param } from 'express-validator';
import conversationParticipantService from '../services/conversationParticipantService.js';

// Add a participant to a conversation
const addParticipant = [
    // Validation rules
    body('conversation_id').isInt().withMessage('Conversation ID must be a valid integer'),
    body('user_id').isInt().withMessage('User ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { conversation_id, user_id } = req.body;

        try {
            const participant = await conversationParticipantService.addParticipant({
                conversation_id,
                user_id,
            });

            res.status(201).json(participant);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to add participant' });
        }
    },
];

// Remove a participant from a conversation
const removeParticipant = [
    // Validation rules
    param('id').isInt().withMessage('Participant ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            await conversationParticipantService.removeParticipant(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to remove participant' });
        }
    },
];

// Get participants by conversation ID
const getParticipantsByConversationId = [
    // Validation rules
    param('conversation_id').isInt().withMessage('Conversation ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { conversation_id } = req.params;

        try {
            const participants = await conversationParticipantService.getParticipantsByConversationId(
                parseInt(conversation_id)
            );

            res.status(200).json(participants);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch participants' });
        }
    },
];

export default {
    addParticipant,
    removeParticipant,
    getParticipantsByConversationId,
};