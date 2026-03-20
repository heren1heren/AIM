import { validationResult, body, param } from 'express-validator';
import contentService from '../services/contentService.js';

// Utility function to handle validation errors
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
};

// Create content
const createContent = [
    // Validation rules
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('urls').isArray().withMessage('URLs must be an array'),
    body('class_id').isInt().withMessage('Class ID must be a valid integer'),
    body('assignedDate').isISO8601().withMessage('Assigned date must be a valid ISO 8601 date'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { title, description, urls, class_id, assignedDate } = req.body;

        try {
            const newContent = await contentService.createContent({
                title,
                description,
                urls,
                class_id,
                assignedDate: new Date(assignedDate),
            });

            res.status(201).json(newContent);
        } catch (error) {
            console.error('Error creating content:', error);
            res.status(500).json({ error: error.message });
        }
    },
];

// Get all content
const getAllContent = async (req, res) => {
    try {
        const contents = await contentService.getAllContent();
        res.status(200).json(contents);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get content by ID
const getContentById = [
    // Validation rules
    param('id').isInt().withMessage('Content ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { id } = req.params;

        try {
            const content = await contentService.getContentById(parseInt(id));
            if (!content) {
                return res.status(404).json({ error: 'Content not found' });
            }

            res.status(200).json(content);
        } catch (error) {
            console.error('Error fetching content:', error);
            res.status(500).json({ error: error.message });
        }
    },
];

// Update content
const updateContent = [
    // Validation rules
    param('id').isInt().withMessage('Content ID must be a valid integer'),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('urls').optional().isArray().withMessage('URLs must be an array'),
    body('class_id').optional().isInt().withMessage('Class ID must be a valid integer'),
    body('assignedDate').optional().isISO8601().withMessage('Assigned date must be a valid ISO 8601 date'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { id } = req.params;
        const { title, description, urls, class_id, assignedDate } = req.body;

        try {
            const updatedContent = await contentService.updateContent(parseInt(id), {
                title,
                description,
                urls,
                class_id,
                assignedDate: assignedDate ? new Date(assignedDate) : undefined,
            });

            res.status(200).json(updatedContent);
        } catch (error) {
            console.error('Error updating content:', error);
            res.status(500).json({ error: error.message });
        }
    },
];

// Delete content
const deleteContent = [
    // Validation rules
    param('id').isInt().withMessage('Content ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { id } = req.params;

        try {
            await contentService.deleteContent(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting content:', error);
            res.status(500).json({ error: error.message });
        }
    },
];

export default {
    createContent,
    getAllContent,
    getContentById,
    updateContent,
    deleteContent,
};