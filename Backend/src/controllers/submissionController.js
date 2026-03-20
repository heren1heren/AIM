import { validationResult, body, param } from 'express-validator';
import submissionService from '../services/submissionService.js';

// Create a submission
const createSubmission = [
    // Validation rules
    body('assignment_id').isInt().withMessage('Assignment ID must be a valid integer'),
    body('student_id').isInt().withMessage('Student ID must be a valid integer'),
    body('content').isString().notEmpty().withMessage('Content is required and must be a string'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { assignment_id, student_id, content } = req.body;

        try {
            const submission = await submissionService.createSubmission({
                assignment_id,
                student_id,
                content,
            });

            res.status(201).json(submission);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create submission' });
        }
    },
];

// Get all submissions
const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await submissionService.getAllSubmissions();
        res.status(200).json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
};

// Get a submission by ID
const getSubmissionById = [
    // Validation rules
    param('id').isInt().withMessage('Submission ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const submission = await submissionService.getSubmissionById(parseInt(id));
            if (!submission) {
                return res.status(404).json({ error: 'Submission not found' });
            }

            res.status(200).json(submission);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch submission' });
        }
    },
];

// Update a submission
const updateSubmission = [
    // Validation rules
    param('id').isInt().withMessage('Submission ID must be a valid integer'),
    body('content').optional().isString().withMessage('Content must be a string'),
    body('grade').optional().isInt().withMessage('Grade must be a valid integer'),
    body('feedback').optional().isString().withMessage('Feedback must be a string'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { content, grade, feedback } = req.body;

        try {
            const updatedSubmission = await submissionService.updateSubmission(parseInt(id), {
                content,
                grade,
                feedback,
            });

            res.status(200).json(updatedSubmission);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update submission' });
        }
    },
];

// Delete a submission
const deleteSubmission = [
    // Validation rules
    param('id').isInt().withMessage('Submission ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            await submissionService.deleteSubmission(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete submission' });
        }
    },
];

export default {
    createSubmission,
    getAllSubmissions,
    getSubmissionById,
    updateSubmission,
    deleteSubmission,
};