import express from 'express';
import notificationTargetController from '../controllers/notificationTargetController.js';

const router = express.Router();

router.post('/', notificationTargetController.createNotificationTarget); // Create a notification target
router.get('/', notificationTargetController.getAllNotificationTargets); // Get all notification targets
router.get('/:id', notificationTargetController.getNotificationTargetById); // Get a notification target by ID
router.delete('/:id', notificationTargetController.deleteNotificationTarget); // Delete a notification target

export default router;