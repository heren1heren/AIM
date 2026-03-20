import express from 'express';
import fileController from '../controllers/fileController.js';

const router = express.Router();

router.post('/', fileController.uploadFile); // Upload a file
router.get('/', fileController.getAllFiles); // Get all files
router.get('/:id', fileController.getFileById); // Get a file by ID
router.delete('/:id', fileController.deleteFile); // Delete a file

export default router;