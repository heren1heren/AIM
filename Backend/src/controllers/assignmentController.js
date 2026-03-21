import { validationResult, body, param } from 'express-validator';
import assignmentService from '../services/assignmentService.js';

// Utility function to handle validation errors
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
};

// Create an assignment
const createAssignment = [
    // Validation rules
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('class_id').isInt().withMessage('Class ID must be a valid integer'),
    body('due_date').isISO8601().withMessage('Due date must be a valid ISO 8601 date'),
    body('assignedDate').isISO8601().withMessage('Assigned date must be a valid ISO 8601 date'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { title, description, class_id, due_date, assignedDate } = req.body;

        try {
            const assignment = await assignmentService.createAssignment({
                title,
                description,
                class_id,
                due_date: new Date(due_date),
                assignedDate: new Date(assignedDate),
            });

            res.status(201).json(assignment);
        } catch (error) {
            console.error('Error creating assignment:', error);
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
        console.error('Error fetching assignments:', error);
        res.status(500).json({ error: 'Failed to fetch assignments' });
    }
};

const getAssignmentsByStudentId = [
    // Validation rules
    param('studentId').isInt().withMessage('Student ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { studentId } = req.params;

        try {
            const assignments = await assignmentService.getAssignmentsByStudentId(parseInt(studentId));
            res.status(200).json(assignments);
        } catch (error) {
            console.error('Error fetching assignments by student ID:', error);
            res.status(500).json({ error: 'Failed to fetch assignments' });
        }
    },
];

// Get assignments by class ID
const getAssignmentsByClassId = [
    // Validation rules
    param('classId').isInt().withMessage('Class ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { classId } = req.params;

        try {
            const assignments = await assignmentService.getAssignmentsByClassId(parseInt(classId));
            res.status(200).json(assignments);
        } catch (error) {
            console.error('Error fetching assignments by class ID:', error);
            res.status(500).json({ error: 'Failed to fetch assignments' });
        }
    },
];

// Get an assignment by ID
const getAssignmentById = [
    // Validation rules
    param('id').isInt().withMessage('Assignment ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { id } = req.params;

        try {
            const assignment = await assignmentService.getAssignmentById(parseInt(id));
            if (!assignment) {
                return res.status(404).json({ error: 'Assignment not found' });
            }

            res.status(200).json(assignment);
        } catch (error) {
            console.error('Error fetching assignment:', error);
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
    body('assignedDate').optional().isISO8601().withMessage('Assigned date must be a valid ISO 8601 date'),

    // Controller logic
    async (req, res) => {
        handleValidationErrors(req, res);

        const { id } = req.params;
        const { title, description, due_date, assignedDate } = req.body;

        try {
            const updatedAssignment = await assignmentService.updateAssignment(parseInt(id), {
                title,
                description,
                due_date: due_date ? new Date(due_date) : undefined,
                assignedDate: assignedDate ? new Date(assignedDate) : undefined,
            });

            res.status(200).json(updatedAssignment);
        } catch (error) {
            console.error('Error updating assignment:', error);
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
        handleValidationErrors(req, res);

        const { id } = req.params;

        try {
            await assignmentService.deleteAssignment(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting assignment:', error);
            res.status(500).json({ error: 'Failed to delete assignment' });
        }
    },
];

export default {
    createAssignment,
    getAllAssignments,
    getAssignmentsByClassId,
    getAssignmentsByStudentId,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
};