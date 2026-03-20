import { validationResult, body, param } from 'express-validator';
import notificationService from '../services/notificationService.js';

// Create a notification
const createNotification = [
    // Validation rules
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('message').isString().notEmpty().withMessage('Message is required'),
    body('created_by').isInt().withMessage('Created by must be a valid user ID'),
    body('class_id').optional().isInt().withMessage('Class ID must be a valid integer'),
    body('is_for_students').optional().isBoolean().withMessage('is_for_students must be a boolean'),
    body('is_for_teachers').optional().isBoolean().withMessage('is_for_teachers must be a boolean'),
    body('is_global').optional().isBoolean().withMessage('is_global must be a boolean'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, message, created_by, class_id, is_for_students, is_for_teachers, is_global } = req.body;

        try {
            const notification = await notificationService.createNotification({
                title,
                message,
                created_by,
                class_id,
                is_for_students,
                is_for_teachers,
                is_global,
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

// Get notifications for students in a specific class
const getNotificationForStudentInClassByClassId = [
    param('classId').isInt().withMessage('Class ID must be a valid integer'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { classId } = req.params;

        try {
            const notifications = await notificationService.getNotificationForStudentInClassByClassId(classId);
            res.status(200).json(notifications);
        } catch (error) {
            console.error('Error fetching notifications for students in class:', error);
            res.status(500).json({ error: 'Failed to fetch notifications' });
        }
    },
];

// Get notifications for students
const getNotificationByIsForStudent = async (req, res) => {
    try {
        const notifications = await notificationService.getNotificationByIsForStudent();
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications for students:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

// Get notifications for teachers
const getNotificationByIsForTeacher = async (req, res) => {
    try {
        const notifications = await notificationService.getNotificationByIsForTeacher();
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications for teachers:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

// Get global notifications
const getNotificationByIsForGlobal = async (req, res) => {
    try {
        const notifications = await notificationService.getNotificationByIsForGlobal();
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching global notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

// Export all controllers
export default {
    createNotification,
    getAllNotifications,
    getNotificationById,
    deleteNotification,
    getNotificationForStudentInClassByClassId,
    getNotificationByIsForStudent,
    getNotificationByIsForTeacher,
    getNotificationByIsForGlobal,
};