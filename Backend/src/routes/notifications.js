import express from 'express';
import notificationController from '../controllers/notificationController.js';

const router = express.Router();

router.post('/', notificationController.createNotification); // Create a notification
router.get('/', notificationController.getAllNotifications); // Get all notifications
router.get('/:id', notificationController.getNotificationById); // Get a notification by ID
router.delete('/:id', notificationController.deleteNotification); // Delete a notification

export default router;