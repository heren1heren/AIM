import express from 'express';
import assignmentController from '../controllers/assignmentController.js';

const router = express.Router();

router.post('/', assignmentController.createAssignment); // Create an assignment
router.get('/', assignmentController.getAllAssignments); // Get all assignments
router.get('/class/:classId', assignmentController.getAssignmentsByClassId); // Get assignments by class ID
router.get('/:id', assignmentController.getAssignmentById); // Get an assignment by ID
router.get('/student/:studentId', assignmentController.getAssignmentsByStudentId)
router.put('/:id', assignmentController.updateAssignment); // Update an assignment
router.delete('/:id', assignmentController.deleteAssignment); // Delete an assignment

export default router;