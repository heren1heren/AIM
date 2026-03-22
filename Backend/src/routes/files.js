import express from 'express';
import passport from 'passport';
import fileController from '../controllers/fileController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes with JWT authentication
router.use(passport.authenticate('jwt', { session: false }));

// Define routes with role-based authorization
router.post('/', authorize(['admin', 'teacher', 'student']), fileController.uploadFile); // Only admin and teacher can upload files
router.get('/', authorize(['admin', 'teacher']), fileController.getAllFiles); // All roles can get all files
router.get('/:id', authorize(['admin', 'teacher', 'student']), fileController.getFileById); // All roles can get a file by ID
router.delete('/:id', authorize(['admin']), fileController.deleteFile); // Only admin can delete a file

// Get Files by Entity ID
router.get('/content/:id', authorize(['admin', 'teacher', 'student']), fileController.getFilesByContentId);
router.get('/assignment/:id', authorize(['admin', 'teacher', 'student']), fileController.getFilesByAssignmentId);
router.get('/submission/:id', authorize(['admin', 'teacher', 'student']), fileController.getFilesBySubmissionId);
router.get('/class/:id', authorize(['admin', 'teacher', 'student']), fileController.getFilesByClassId);
router.get('/notification/:id', authorize(['admin', 'teacher', 'student']), fileController.getFilesByNotificationId);

// Update Files by Entity ID
router.put('/submission/:submissionId', authorize(['admin', 'teacher']), fileController.updateFilesBySubmissionId);
router.put('/content/:contentId', authorize(['admin', 'teacher']), fileController.updateFileByContentId);
router.put('/notification/:notificationId', authorize(['admin', 'teacher']), fileController.updateFileByNotificationId);


export default router;