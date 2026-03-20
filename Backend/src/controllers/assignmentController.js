import { validationResult, body, param } from 'express-validator';
import assignmentService from '../services/assignmentService.js';

// Create an assignment
const createAssignment = [
    // Validation rules
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('class_id').isInt().withMessage('Class ID must be a valid integer'),
    body('due_date').isISO8601().withMessage('Due date must be a valid ISO 8601 date'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, class_id, due_date } = req.body;

        try {
            const assignment = await assignmentService.createAssignment({
                title,
                description,
                class_id,
                due_date,
            });

            res.status(201).json(assignment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create assignment' });
        }
    },
];

// Get all assignments
const getAllAssignments = async (req, res) => {
    try {
        const assignments = await assignmentService.getAllAssignments();
        res.status(200).json(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch assignments' });
    }
};

// Get an assignment by ID
const getAssignmentById = [
    // Validation rules
    param('id').isInt().withMessage('Assignment ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const assignment = await assignmentService.getAssignmentById(parseInt(id));
            if (!assignment) {
                return res.status(404).json({ error: 'Assignment not found' });
            }

            res.status(200).json(assignment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch assignment' });
        }
    },
];

// Update an assignment
const updateAssignment = [
    // Validation rules
    param('id').isInt().withMessage('Assignment ID must be a valid integer'),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('due_date').optional().isISO8601().withMessage('Due date must be a valid ISO 8601 date'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { title, description, due_date } = req.body;

        try {
            const updatedAssignment = await assignmentService.updateAssignment(parseInt(id), {
                title,
                description,
                due_date,
            });

            res.status(200).json(updatedAssignment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update assignment' });
        }
    },
];

// Delete an assignment
const deleteAssignment = [
    // Validation rules
    param('id').isInt().withMessage('Assignment ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            await assignmentService.deleteAssignment(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete assignment' });
        }
    },
];

export default {
    createAssignment,
    getAllAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
};