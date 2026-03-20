import { validationResult, body, param } from 'express-validator';
import notificationService from '../services/notificationService.js';

// Create a notification
const createNotification = [
    // Validation rules
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('message').isString().notEmpty().withMessage('Message is required'),
    body('created_by').isInt().withMessage('Created by must be a valid user ID'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, message, created_by, notification_targets } = req.body;

        try {
            const notification = await notificationService.createNotification({
                title,
                message,
                created_by,
                notification_targets, // Optional: Include targets if provided
            });

            res.status(201).json(notification);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create notification' });
        }
    },
];

// Get all notifications
const getAllNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getAllNotifications();
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

// Get a notification by ID
const getNotificationById = [
    // Validation rules
    param('id').isInt().withMessage('Notification ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const notification = await notificationService.getNotificationById(parseInt(id));
            if (!notification) {
                return res.status(404).json({ error: 'Notification not found' });
            }

            res.status(200).json(notification);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch notification' });
        }
    },
];

// Delete a notification
const deleteNotification = [
    // Validation rules
    param('id').isInt().withMessage('Notification ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            await notificationService.deleteNotification(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete notification' });
        }
    },
];

export default {
    createNotification,
    getAllNotifications,
    getNotificationById,
    deleteNotification,
};