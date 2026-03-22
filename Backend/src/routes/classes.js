import express from 'express';
import passport from 'passport';
import classController from '../controllers/classController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();


router.use(passport.authenticate('jwt', { session: false }));

router.post('/', authorize(['admin', 'teacher']), classController.createClass); // Only admin and teacher can create a class
router.get('/', authorize(['admin', 'teacher']), classController.getAllClasses); // Only admin and teacher can view all classes
router.get('/:id', authorize(['admin', 'teacher', 'student']), classController.getClassById); // Admin, teacher, and student can view a specific class
router.put('/:id', authorize(['admin', 'teacher']), classController.updateClass); // Only admin and teacher can update a class
router.delete('/:id', authorize(['admin']), classController.deleteClass); // Only admin can delete a class
router.put('/transfer', authorize(['admin']), classController.transferDataClass); // Only admin can transfer class data

export default router;