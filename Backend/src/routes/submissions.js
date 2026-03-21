import express from 'express';
import submissionController from '../controllers/submissionController.js';

const router = express.Router();

router.post('/', submissionController.createSubmission); // Create a submission
router.get('/', submissionController.getAllSubmissions); // Get all submissions
router.get('/:id', submissionController.getSubmissionById); // Get a submission by ID
router.put('/:id', submissionController.updateSubmission); // Update a submission
router.delete('/:id', submissionController.deleteSubmission); // Delete a submission
router.get('/student/:studentId', submissionController.getSubmissionsByStudentId); // Get submissions by student ID
router.get('/assignment/:assignmentId', submissionController.getSubmissionsByAssignmentId); // Get submissions by assignment ID

export default router;