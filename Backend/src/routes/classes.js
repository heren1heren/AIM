import express from 'express';
import classController from '../controllers/classController.js';

const router = express.Router();

router.post('/', classController.createClass);
router.get('/', classController.getAllClasses);
router.get('/:id', classController.getClassById);
router.put('/:id', classController.updateClass);
router.delete('/:id', classController.deleteClass);
router.put('/transfer', classController.transferDataClass);

export default router;