import express from 'express';
import passport from 'passport';
import submissionController from '../controllers/submissionController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes with JWT authentication
router.use(passport.authenticate('jwt', { session: false }));

// Define routes with role-based authorization
router.post('/', authorize(['admin', 'teacher', 'student']), submissionController.createSubmission); // All roles can create a submission
router.get('/', authorize(['admin', 'teacher']), submissionController.getAllSubmissions); // Only admin and teacher can get all submissions
router.get('/:id', authorize(['admin', 'teacher', 'student']), submissionController.getSubmissionById); // All roles can get a submission by ID
router.put('/:id', authorize(['admin', 'teacher']), submissionController.updateSubmission); // Only admin and teacher can update a submission
router.delete('/:id', authorize(['admin']), submissionController.deleteSubmission); // Only admin can delete a submission
router.get('/student/:studentId', authorize(['admin', 'teacher', 'student']), submissionController.getSubmissionsByStudentId); // All roles can get submissions by student ID
router.get('/assignment/:assignmentId', authorize(['admin', 'teacher', 'student']), submissionController.getSubmissionsByAssignmentId); // All roles can get submissions by assignment ID

export default router;