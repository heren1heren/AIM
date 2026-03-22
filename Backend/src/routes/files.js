import express from 'express';
import fileController from '../controllers/fileController.js';

const router = express.Router();

// File Upload and Retrieval
router.post('/', fileController.uploadFile); // Upload a file
router.get('/', fileController.getAllFiles); // Get all files
router.get('/:id', fileController.getFileById); // Get a file by ID
router.delete('/:id', fileController.deleteFile); // Delete a file

// Get Files by Entity ID
router.get('/content/:id', async (req, res) => {
    try {
        const files = await fileController.getFilesByContentId(req.params.id);
        res.status(200).json(files);
    } catch (error) {
        console.error('Error fetching files by content ID:', error);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
});

router.get('/assignment/:id', async (req, res) => {
    try {
        const files = await fileController.getFilesByAssignmentId(req.params.id);
        res.status(200).json(files);
    } catch (error) {
        console.error('Error fetching files by assignment ID:', error);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
});

router.get('/submission/:id', async (req, res) => {
    try {
        const files = await fileController.getFilesBySubmissionId(req.params.id);
        res.status(200).json(files);
    } catch (error) {
        console.error('Error fetching files by submission ID:', error);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
});

router.get('/class/:id', async (req, res) => {
    try {
        const files = await fileController.getFilesByClassId(req.params.id);
        res.status(200).json(files);
    } catch (error) {
        console.error('Error fetching files by class ID:', error);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
});

router.get('/notification/:id', async (req, res) => {
    try {
        const files = await fileController.getFilesByNotificationId(req.params.id);
        res.status(200).json(files);
    } catch (error) {
        console.error('Error fetching files by notification ID:', error);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
});

// Update Files by Entity ID
router.put('/submission/:submissionId', fileController.updateFilesBySubmissionId); // Update files by submission ID
router.put('/content/:contentId', fileController.updateFileByContentId); // Update file by content ID
router.put('/notification/:notificationId', fileController.updateFileByNotificationId); // Update file by notification ID
router.put('/assignment/:assignmentId', fileController.updateFileByAssignmentId); // Update file by assignment ID

export default router;