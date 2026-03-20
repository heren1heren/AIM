import { validationResult, body, param } from 'express-validator';
import studentService from '../services/studentService.js';

// Create a student
const createStudent = [
    // Validation rules
    body('user_id').isInt().withMessage('User ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { user_id } = req.body;

        try {
            const student = await studentService.createStudent(user_id);
            res.status(201).json(student);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },
];

// Get all students
const getAllStudents = async (req, res) => {
    try {
        const students = await studentService.getAllStudents();
        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
};

// Get a student by ID
const getStudentById = [
    // Validation rules
    param('id').isInt().withMessage('Student ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const student = await studentService.getStudentById(parseInt(id));
            if (!student) {
                return res.status(404).json({ error: 'Student not found' });
            }

            res.status(200).json(student);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch student' });
        }
    },
];

// Update a student
const updateStudent = [
    // Validation rules
    param('id').isInt().withMessage('Student ID must be a valid integer'),
    body('user_id').optional().isInt().withMessage('User ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { user_id } = req.body;

        try {
            const updatedStudent = await studentService.updateStudent(parseInt(id), { user_id });
            res.status(200).json(updatedStudent);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update student' });
        }
    },
];

// Delete a student
const deleteStudent = [
    // Validation rules
    param('id').isInt().withMessage('Student ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            await studentService.deleteStudent(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete student' });
        }
    },
];

export default {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
};