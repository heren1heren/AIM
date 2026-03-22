import express from 'express';
import passport from 'passport';
import notificationController from '../controllers/notificationController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes with JWT authentication
router.use(passport.authenticate('jwt', { session: false }));

// Define routes with role-based authorization
router.post('/', authorize(['admin']), notificationController.createNotification); // Only admin and teacher can create notifications
router.get('/', authorize(['admin']), notificationController.getAllNotifications); // Only admin and teacher can get all notifications
router.get('/class/:classId', authorize(['admin', 'teacher', 'student']), notificationController.getNotificationForStudentInClassByClassId); // All roles can get notifications for a class
router.get('/students', authorize(['admin', 'teacher', 'student']), notificationController.getNotificationByIsForStudent); // Only admin and teacher can get student notifications
router.get('/teachers', authorize(['admin', 'teacher']), notificationController.getNotificationByIsForTeacher); // Only admin can get teacher notifications
router.get('/global', authorize(['admin', 'teacher', 'student']), notificationController.getNotificationByIsForGlobal); // All roles can get global notifications
router.get('/:id', authorize(['admin', 'teacher', 'student']), notificationController.getNotificationById); // All roles can get a notification by ID
router.delete('/:id', authorize(['admin']), notificationController.deleteNotification); // Only admin can delete a notification

export default router;