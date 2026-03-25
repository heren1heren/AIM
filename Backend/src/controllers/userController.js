import { validationResult, body, param } from 'express-validator';
import userService from '../services/userService.js';

// Create a user
const createUser = [
    // Validation rules
    body('name').optional().isString().withMessage('Name must be a string'), // Added name validation
    body('username').isString().notEmpty().withMessage('Username is required and must be a string'),
    body('password').isString().notEmpty().withMessage('Password is required and must be a string'),

    body('isAdmin').optional().isBoolean().withMessage('isAdmin must be a boolean'),
    body('isTeacher').optional().isBoolean().withMessage('isTeacher must be a boolean'),
    body('isStudent').optional().isBoolean().withMessage('isStudent must be a boolean'),
    body('profile').optional().isObject().withMessage('Profile must be an object'),
    body('profile.nickname').optional().isString().withMessage('Nickname must be a string'),
    body('profile.avatar').optional().isString().withMessage('Avatar must be a string'),
    body('profile.bias').optional().isString().withMessage('Bias must be a string'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, username, password, isAdmin, isTeacher, isStudent, profile } = req.body;

        try {
            // Pass the plain password to the service layer
            const user = await userService.createUser({
                name, // Added name
                username,
                password, // Pass plain password, hashing will be handled in the service

                isAdmin,
                isTeacher,
                isStudent,
                profile,
            });
            res.status(201).json(user);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Failed to create user' });
        }
    },
];

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// Get a user by ID
const getUserById = [
    // Validation rules
    param('id').isInt().withMessage('User ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const user = await userService.getUserById(parseInt(id));
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    },
];

// Update user for admin usage
const updateUser = [
    // Validation rules
    param('id').isInt().withMessage('User ID must be a valid integer'),
    body('name').optional().isString().withMessage('Name must be a string'), // Added name validation
    body('username').optional().isString().withMessage('Username must be a string'),

    body('password').optional().isString().withMessage('Password must be a string'),
    body('addRole').optional().isIn(['admin', 'teacher']).withMessage('addRole must be one of: admin, teacher'),
    body('removeRole').optional().isIn(['admin', 'teacher']).withMessage('removeRole must be one of: admin, teacher'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { name, username, addRole, removeRole, ...data } = req.body;

        try {
            const updatedUser = await userService.updateUser(parseInt(id), {
                name,
                username,
                addRole,
                removeRole,
                ...data,
            });
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Failed to update user' });
        }
    },
];

// Delete a user
const deleteUser = [
    // Validation rules
    param('id').isInt().withMessage('User ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            await userService.deleteUser(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    },
];

export default {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};