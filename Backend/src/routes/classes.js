import express from 'express';
import classController from '../controllers/classController.js';

const router = express.Router();

router.post('/', classController.createClass); // Create a class
router.get('/', classController.getAllClasses); // Get all classes
router.get('/:id', classController.getClassById); // Get a class by ID
router.put('/:id', classController.updateClass); // Update a class
router.delete('/:id', classController.deleteClass); // Delete a class

export default router;