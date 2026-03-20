import { validationResult, body, param } from 'express-validator';
import contentService from '../services/contentService.js';

// Create content
const createContent = [
    // Validation rules
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('class_id').isInt().withMessage('Class ID must be a valid integer'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('urls').optional().isArray().withMessage('URLs must be an array of strings'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, urls, class_id } = req.body;

        try {
            const content = await contentService.createContent({
                title,
                description,
                urls,
                class_id,
            });

            res.status(201).json(content);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create content' });
        }
    },
];

// Get all content
const getAllContent = async (req, res) => {
    try {
        const contents = await contentService.getAllContent();
        res.status(200).json(contents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
};

// Get content by ID
const getContentById = [
    // Validation rules
    param('id').isInt().withMessage('Content ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const content = await contentService.getContentById(parseInt(id));
            if (!content) {
                return res.status(404).json({ error: 'Content not found' });
            }

            res.status(200).json(content);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch content' });
        }
    },
];

// Update content
const updateContent = [
    // Validation rules
    param('id').isInt().withMessage('Content ID must be a valid integer'),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('urls').optional().isArray().withMessage('URLs must be an array of strings'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { title, description, urls } = req.body;

        try {
            const updatedContent = await contentService.updateContent(parseInt(id), {
                title,
                description,
                urls,
            });

            res.status(200).json(updatedContent);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update content' });
        }
    },
];

// Delete content
const deleteContent = [
    // Validation rules
    param('id').isInt().withMessage('Content ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            await contentService.deleteContent(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete content' });
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