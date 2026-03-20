import { validationResult, body, param } from 'express-validator';
import notificationTargetService from '../services/notificationTargetService.js';

// Create a notification target
const createNotificationTarget = [
    // Validation rules
    body('notification_id').isInt().withMessage('Notification ID must be a valid integer'),
    body('class_id').optional().isInt().withMessage('Class ID must be a valid integer'),
    body('role').optional().isString().isIn(['all', 'students', 'teachers']).withMessage('Role must be one of: all, students, teachers'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { notification_id, class_id, role } = req.body;

        try {
            const notificationTarget = await notificationTargetService.createNotificationTarget({
                notification_id,
                class_id,
                role,
            });

            res.status(201).json(notificationTarget);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create notification target' });
        }
    },
];

// Get all notification targets
const getAllNotificationTargets = async (req, res) => {
    try {
        const notificationTargets = await notificationTargetService.getAllNotificationTargets();
        res.status(200).json(notificationTargets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch notification targets' });
    }
};

// Get a notification target by ID
const getNotificationTargetById = [
    // Validation rules
    param('id').isInt().withMessage('Notification Target ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const notificationTarget = await notificationTargetService.getNotificationTargetById(parseInt(id));
            if (!notificationTarget) {
                return res.status(404).json({ error: 'Notification target not found' });
            }

            res.status(200).json(notificationTarget);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch notification target' });
        }
    },
];

// Delete a notification target
const deleteNotificationTarget = [
    // Validation rules
    param('id').isInt().withMessage('Notification Target ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            await notificationTargetService.deleteNotificationTarget(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete notification target' });
        }
    },
];

export default {
    createNotificationTarget,
    getAllNotificationTargets,
    getNotificationTargetById,
    deleteNotificationTarget,
};