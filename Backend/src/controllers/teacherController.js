import { validationResult, body, param } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a teacher
const createTeacher = [
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
            // Check if the user exists and has the role of "teacher"
            const user = await prisma.user.findUnique({ where: { id: user_id } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (user.role !== 'teacher') {
                return res.status(400).json({ error: 'User does not have the role of teacher' });
            }

            // Create the teacher
            const teacher = await prisma.teacher.create({
                data: {
                    user_id,
                },
            });

            res.status(201).json(teacher);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create teacher' });
        }
    },
];

// Get all teachers
const getAllTeachers = async (req, res) => {
    try {
        const teachers = await prisma.teacher.findMany({
            include: { user: true }, // Include related user data
        });
        res.status(200).json(teachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch teachers' });
    }
};

// Get a teacher by ID
const getTeacherById = [
    // Validation rules
    param('id').isInt().withMessage('Teacher ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const teacher = await prisma.teacher.findUnique({
                where: { id: parseInt(id) },
                include: { user: true, classes: true }, // Include related user and classes
            });

            if (!teacher) {
                return res.status(404).json({ error: 'Teacher not found' });
            }

            res.status(200).json(teacher);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch teacher' });
        }
    },
];

// Update a teacher
const updateTeacher = [
    // Validation rules
    param('id').isInt().withMessage('Teacher ID must be a valid integer'),
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
            // Update the teacher
            const updatedTeacher = await prisma.teacher.update({
                where: { id: parseInt(id) },
                data: { user_id },
            });

            res.status(200).json(updatedTeacher);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update teacher' });
        }
    },
];

// Delete a teacher
const deleteTeacher = [
    // Validation rules
    param('id').isInt().withMessage('Teacher ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            // Delete the teacher
            await prisma.teacher.delete({
                where: { id: parseInt(id) },
            });

            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete teacher' });
        }
    },
];

export default {
    createTeacher,
    getAllTeachers, // Added getAllTeachers here
    getTeacherById,
    updateTeacher,
    deleteTeacher,
};