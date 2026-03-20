import express from 'express';
import notificationController from '../controllers/notificationController.js';

const router = express.Router();

router.post('/', notificationController.createNotification); // Create a notification
router.get('/', notificationController.getAllNotifications); // Get all notifications
router.get('/class/:classId', notificationController.getNotificationForStudentInClassByClassId);

// Get notifications for students
router.get('/students', notificationController.getNotificationByIsForStudent);

// Get notifications for teachers
router.get('/teachers', notificationController.getNotificationByIsForTeacher);

// Get global notifications
router.get('/global', notificationController.getNotificationByIsForGlobal);

router.get('/:id', notificationController.getNotificationById); // Get a 
// notification by ID

router.delete('/:id', notificationController.deleteNotification); // Delete a notification

export default router;