import express from 'express';
import passport from 'passport';
import contentController from '../controllers/contentController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes with JWT authentication
router.use(passport.authenticate('jwt', { session: false }));

// Define routes with role-based authorization
router.post('/', authorize(['admin', 'teacher']), contentController.createContent); // Only admin and teacher can create content
router.get('/', authorize(['admin', 'teacher']), contentController.getAllContent);
router.get('/class/:classId', authorize(['admin', 'teacher', 'student']), contentController.getContentsByClassId); // Admin, teacher, and student can get content by class ID
router.get('/:id', authorize(['admin', 'teacher', 'student']), contentController.getContentById); // Admin, teacher, and student can get content by ID
router.put('/:id', authorize(['admin', 'teacher']), contentController.updateContent); // Only admin and teacher can update content
router.delete('/:id', authorize(['admin']), contentController.deleteContent); // Only admin can delete content

export default router;