import { validationResult, body, param } from 'express-validator';
import { uploadToWasabi, generateSignedUrl } from '../config/fileConfig.js';
import notificationService from '../services/notificationService.js';
import fileService from '../services/fileService.js';
import multer from 'multer';

const notificationUpload = multer({ storage: multer.memoryStorage() });

// Create a notification
const createNotification = [
    notificationUpload.single('file'), // Handle file upload
    // Validation rules
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('message').isString().notEmpty().withMessage('Message is required'),
    body('created_by').isInt().withMessage('Created by must be a valid user ID'),
    body('class_ids').optional().isArray().withMessage('class_ids must be an array of integers'),
    body('class_ids.*').optional().isInt().withMessage('Each class_id must be a valid integer'),
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

        const { title, message, created_by, class_ids, is_for_students, is_for_teachers, is_global } = req.body;

        try {
            let fileKey = null;
            let signedFileUrl = null;

            // If a file is uploaded, handle the file upload
            if (req.file) {
                fileKey = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
                console.log('Generated fileKey:', fileKey);

                // Upload the file to Wasabi
                await uploadToWasabi({ file: req.file, fileKey });

                // Save the file metadata in the database
                const savedFile = await fileService.uploadNotificationFile({
                    key: fileKey,
                    filename: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                });

                console.log('Saved file metadata:', savedFile);

                // Generate the signed URL for the file
                signedFileUrl = await generateSignedUrl(fileKey);
            }

            // Create the notification
            const notification = await notificationService.createNotification({
                title,
                message,
                created_by,
                class_ids: class_ids ? class_ids.map((id) => parseInt(id)) : [],
                is_for_students,
                is_for_teachers,
                is_global,
                fileKey, // Attach the file key to the notification
            });

            res.status(201).json({
                ...notification,
                fileUrl: signedFileUrl, // Include the signed file URL in the response
            });
        } catch (error) {
            console.error('Error creating notification:', error);
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
        console.error('Error fetching notifications:', error);
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
            console.error('Error fetching notification:', error);
            res.status(500).json({ error: 'Failed to fetch notification' });
        }
    },
];


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
            console.error('Error deleting notification:', error);
            res.status(500).json({ error: 'Failed to delete notification' });
        }
    },
];

// Get notifications by User ID
const getNotificationsByUserId = [
    // Validation rules
    param('userId').isInt().withMessage('User ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId } = req.params;

        try {
            const notifications = await notificationService.getNotificationsByUserId(parseInt(userId));
            res.status(200).json(notifications);
        } catch (error) {
            console.error('Error fetching notifications for user:', error);
            res.status(500).json({ error: 'Failed to fetch notifications for user' });
        }
    },
];

// Mark a notification as read
const markNotificationAsRead = [
    // Validation rules
    param('id').isInt().withMessage('Notification ID must be a valid integer'),
    body('userId').isInt().withMessage('User ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { userId } = req.body;

        try {
            const updatedNotification = await notificationService.markNotificationAsRead(id, userId);
            res.status(200).json(updatedNotification);
        } catch (error) {
            console.error('Error marking notification as read:', error);
            res.status(500).json({ error: 'Failed to mark notification as read' });
        }
    },
];

// Export all controllers
export default {
    createNotification,
    getAllNotifications,
    getNotificationById,
    deleteNotification,
    getNotificationsByUserId,
    markNotificationAsRead,
};