import { validationResult, body, param } from 'express-validator';
import userProfileService from '../services/userProfileService.js';

// Create a user profile
const createUserProfile = [
    // Validation rules
    body('user_id').isInt().withMessage('User ID must be a valid integer'),
    body('nickname').optional().isString().withMessage('Nickname must be a string'),
    body('avatar').optional().isString().withMessage('Avatar must be a string'),
    body('bias').optional().isString().withMessage('Bias must be a string'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { user_id, nickname, avatar, bias } = req.body;

        try {
            const userProfile = await userProfileService.createUserProfile({ user_id, nickname, avatar, bias });
            res.status(201).json(userProfile);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create user profile' });
        }
    },
];

// Get a user profile by ID
const getUserProfileByUserId = [
    // Validation rules
    param('id').isInt().withMessage('Profile ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const userProfile = await userProfileService.getUserProfileByUserId(parseInt(id));
            if (!userProfile) {
                return res.status(404).json({ error: 'User profile not found' });
            }
            res.status(200).json(userProfile);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch user profile' });
        }
    },
];

// Update a user profile
const updateUserProfile = [
    // Validation rules
    param('id').isInt().withMessage('Profile ID must be a valid integer'),
    body('nickname').optional().isString().withMessage('Nickname must be a string'),
    body('avatar').optional().isString().withMessage('Avatar must be a string'),
    body('bias').optional().isString().withMessage('Bias must be a string'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { nickname, avatar, bias } = req.body;

        try {
            const updatedUserProfile = await userProfileService.updateUserProfile(parseInt(id), { nickname, avatar, bias });
            res.status(200).json(updatedUserProfile);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update user profile' });
        }
    },
];

// Delete a user profile
const deleteUserProfile = [
    // Validation rules
    param('id').isInt().withMessage('Profile ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            await userProfileService.deleteUserProfile(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete user profile' });
        }
    },
];

export default {
    createUserProfile,
    getUserProfileByUserId,
    updateUserProfile,
    deleteUserProfile,
};