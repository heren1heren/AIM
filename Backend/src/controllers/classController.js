import { validationResult, body, param } from 'express-validator';
import classService from '../services/classService.js';

// Create a class
const createClass = [
    // Validation rules
    body('name').isString().notEmpty().withMessage('Class name is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('teacher_id').isInt().withMessage('Teacher ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description, teacher_id } = req.body;

        try {
            const newClass = await classService.createClass({
                name,
                description,
                teacher_id,
            });

            res.status(201).json(newClass);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create class' });
        }
    },
];

// Get all classes
const getAllClasses = async (req, res) => {
    try {
        const classes = await classService.getAllClasses();
        res.status(200).json(classes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch classes' });
    }
};

// Get a class by ID
const getClassById = [
    // Validation rules
    param('id').isInt().withMessage('Class ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const classData = await classService.getClassById(parseInt(id));
            if (!classData) {
                return res.status(404).json({ error: 'Class not found' });
            }

            res.status(200).json(classData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch class' });
        }
    },
];

// Update a class
const updateClass = [
    // Validation rules
    param('id').isInt().withMessage('Class ID must be a valid integer'),
    body('name').optional().isString().withMessage('Class name must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('teacher_id').optional().isInt().withMessage('Teacher ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { name, description, teacher_id } = req.body;

        try {
            const updatedClass = await classService.updateClass(parseInt(id), {
                name,
                description,
                teacher_id,
            });

            res.status(200).json(updatedClass);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update class' });
        }
    },
];

// Delete a class
const deleteClass = [
    // Validation rules
    param('id').isInt().withMessage('Class ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            await classService.deleteClass(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete class' });
        }
    },
];

export default {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass,
};