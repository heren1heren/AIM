import express from 'express';
import studentController from '../controllers/studentController.js';

const router = express.Router();

// Routes
router.post('/', studentController.createStudent); // Create a student
router.get('/', studentController.getAllStudents); // Get all students
router.get('/:id', studentController.getStudentById); // Get a student by ID
router.put('/:id', studentController.updateStudent); // Update a student
router.delete('/:id', studentController.deleteStudent); // Delete a student

export default router;