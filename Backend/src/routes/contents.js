import express from 'express';
import contentController from '../controllers/contentController.js';

const router = express.Router();

router.post('/', contentController.createContent); // Create content
router.get('/', contentController.getAllContent); // Get all content
router.get('/:id', contentController.getContentById); // Get content by ID
router.put('/:id', contentController.updateContent); // Update content
router.delete('/:id', contentController.deleteContent); // Delete content

export default router;