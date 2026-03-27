import express from 'express';
import teacherController from '../controllers/teacherController.js';

const router = express.Router();

// router.post('/', teacherController.createTeacher); // Create a teacher
router.get('/', teacherController.getAllTeachers); // Get all teachers
router.get('/:id', teacherController.getTeacherById); // Get a teacher by ID
// router.put('/:id', teacherController.updateTeacher); // Update a teacher
// router.delete('/:id', teacherController.deleteTeacher); // Delete a teacher

// Assign a teacher to a class
router.post('/assign', teacherController.assignTeacherToClass);

export default router;