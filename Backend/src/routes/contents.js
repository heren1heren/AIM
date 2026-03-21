import express from 'express';
import contentController from '../controllers/contentController.js';

const router = express.Router();

router.post('/', contentController.createContent);
router.get('/', contentController.getAllContent);
router.get('/class/:classId', contentController.getContentsByClassId);

router.get('/:id', contentController.getContentById);
router.put('/:id', contentController.updateContent);
router.delete('/:id', contentController.deleteContent);

export default router;