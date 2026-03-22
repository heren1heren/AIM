import express from 'express';
import passport from 'passport';
import assignmentController from '../controllers/assignmentController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes with JWT authentication
router.use(passport.authenticate('jwt', { session: false }));

// Define routes with role-based authorization
router.post('/', authorize(['admin', 'teacher']), assignmentController.createAssignment); // Only admin and teacher can create an assignment
router.get('/', authorize(['admin', 'teacher']), assignmentController.getAllAssignments); // Only admin and teacher can get all assignments
router.get('/class/:classId', authorize(['admin', 'teacher', 'student']), assignmentController.getAssignmentsByClassId); // Admin, teacher, and student can get assignments by class ID
router.get('/:id', authorize(['admin', 'teacher', 'student']), assignmentController.getAssignmentById); // Admin, teacher, and student can get an assignment by ID
router.get('/student/:studentId', authorize(['admin', 'teacher', 'student']), assignmentController.getAssignmentsByStudentId); // Admin, teacher, and student can get assignments by student ID
router.put('/:id', authorize(['admin', 'teacher']), assignmentController.updateAssignment); // Only admin and teacher can update an assignment
router.delete('/:id', authorize(['admin']), assignmentController.deleteAssignment); // Only admin can delete an assignment

export default router;