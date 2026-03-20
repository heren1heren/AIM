import { validationResult, body, param } from 'express-validator';
import classService from '../services/classService.js';

// Utility function to handle validation errors
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
};

// Create a class
const createClass = [
    // Validation rules
    body('name').isString().notEmpty().withMessage('Class name is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('teacher_id').isInt().withMessage('Teacher ID must be a valid integer'),
    body('start_date').isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
    body('end_date').isISO8601().withMessage('End date must be a valid ISO 8601 date'),
    body('student_ids').optional().isArray().withMessage('Student IDs must be an array of integers'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { name, description, teacher_id, start_date, end_date, student_ids } = req.body;

        try {
            const { class: newClass, invalidStudentIds } = await classService.createClass({
                name,
                description,
                teacher_id,
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                student_ids,
            });

            res.status(201).json({
                class: newClass,
                invalidStudentIds, // Return invalid student IDs
            });
        } catch (error) {
            console.error('Error creating class:', error);
            res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
    }
};

// Get a class by ID
const getClassById = [
    // Validation rules
    param('id').isInt().withMessage('Class ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { id } = req.params;

        try {
            const classData = await classService.getClassById(parseInt(id));
            if (!classData) {
                return res.status(404).json({ error: 'Class not found' });
            }

            res.status(200).json(classData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
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
    body('start_date').optional().isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
    body('end_date').optional().isISO8601().withMessage('End date must be a valid ISO 8601 date'),
    body('student_ids').optional().isArray().withMessage('Student IDs must be an array of integers'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { id } = req.params;
        const { name, description, teacher_id, start_date, end_date, student_ids } = req.body;

        try {
            const { class: updatedClass, invalidStudentIds, duplicateStudentIds } =
                await classService.updateClass(parseInt(id), {
                    name,
                    description,
                    teacher_id,
                    start_date: start_date ? new Date(start_date) : undefined,
                    end_date: end_date ? new Date(end_date) : undefined,
                    student_ids,
                });

            res.status(200).json({
                class: updatedClass,
                invalidStudentIds, // Return invalid student IDs
                duplicateStudentIds, // Return duplicate student IDs
            });
        } catch (error) {
            console.error('Error updating class:', error);
            res.status(500).json({ error: error.message });
        }
    },
];

// Delete a class
const deleteClass = [
    // Validation rules
    param('id').isInt().withMessage('Class ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { id } = req.params;

        try {
            await classService.deleteClass(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },
];

// Transfer data between classes
const transferDataClass = [
    // Validation rules
    body('sourceClassId').isInt().withMessage('Source Class ID must be a valid integer'),
    body('newClassId').isInt().withMessage('New Class ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { sourceClassId, newClassId } = req.body;

        try {
            const result = await classService.transferDataClass(sourceClassId, newClassId);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error transferring data between classes:', error);
            res.status(500).json({ error: error.message });
        }
    },
];

export default {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass,
    transferDataClass,
};