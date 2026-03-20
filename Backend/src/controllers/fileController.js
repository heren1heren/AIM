import { validationResult, body, param } from 'express-validator';
import fileService from '../services/fileService.js';

// Upload a file
const uploadFile = [
    // Validation rules
    body('url').isString().notEmpty().withMessage('File URL is required'),
    body('uploaded_by').isInt().withMessage('Uploader ID must be a valid integer'),
    body('filename').optional().isString().withMessage('Filename must be a string'),
    body('mimetype').optional().isString().withMessage('MIME type must be a string'),
    body('size').optional().isInt().withMessage('File size must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { url, uploaded_by, filename, mimetype, size, submission_id, assignment_id, class_id, notification_id } = req.body;

        try {
            const file = await fileService.uploadFile({
                url,
                uploaded_by,
                filename,
                mimetype,
                size,
                submission_id,
                assignment_id,
                class_id,
                notification_id,
            });

            res.status(201).json(file);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to upload file' });
        }
    },
];

// Get all files
const getAllFiles = async (req, res) => {
    try {
        const files = await fileService.getAllFiles();
        res.status(200).json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
};

// Get a file by ID
const getFileById = [
    // Validation rules
    param('id').isInt().withMessage('File ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const file = await fileService.getFileById(parseInt(id));
            if (!file) {
                return res.status(404).json({ error: 'File not found' });
            }

            res.status(200).json(file);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch file' });
        }
    },
];

// Delete a file
const deleteFile = [
    // Validation rules
    param('id').isInt().withMessage('File ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            await fileService.deleteFile(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete file' });
        }
    },
];

export default {
    uploadFile,
    getAllFiles,
    getFileById,
    deleteFile,
};