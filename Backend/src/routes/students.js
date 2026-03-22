import express from 'express';
import passport from 'passport';
import studentController from '../controllers/studentController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes with JWT authentication
router.use(passport.authenticate('jwt', { session: false }));

// Define routes with role-based authorization
router.get('/', authorize(['admin', 'teacher']), studentController.getAllStudents); // Only admin and teacher can get all students
router.get('/:id', authorize(['admin', 'teacher', 'student']), studentController.getStudentById); // Admin, teacher, and student can get a student by ID

export default router;