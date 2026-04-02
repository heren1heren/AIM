import express from 'express';
import passport from 'passport';
import notificationController from '../controllers/notificationController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes with JWT authentication
router.use(passport.authenticate('jwt', { session: false }));

// Define routes with role-based authorization
router.post('/', authorize(['admin']), notificationController.createNotification);
router.get('/', authorize(['admin']), notificationController.getAllNotifications);


router.get('/:id', authorize(['admin', 'teacher', 'student']), notificationController.getNotificationById);
router.delete('/:id', authorize(['admin']), notificationController.deleteNotification); // Only admin can delete a notification
router.get('/user/:userId', authorize(['admin', 'teacher', 'student']), notificationController.getNotificationsByUserId);
router.patch('/:id/read', authorize(['admin', 'teacher', 'student']), notificationController.markNotificationAsRead);

export default router;