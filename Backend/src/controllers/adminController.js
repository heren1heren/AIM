import { validationResult, body, param } from 'express-validator';
import adminService from '../services/adminService.js';

// Create an admin
const createAdmin = [
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
            const admin = await adminService.createAdmin({ user_id });
            res.status(201).json(admin);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create admin' });
        }
    },
];

// Get all admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await adminService.getAllAdmins();
        res.status(200).json(admins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch admins' });
    }
};

// Get an admin by ID
const getAdminById = [
    // Validation rules
    param('id').isInt().withMessage('Admin ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const admin = await adminService.getAdminById(parseInt(id));
            if (!admin) {
                return res.status(404).json({ error: 'Admin not found' });
            }

            res.status(200).json(admin);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch admin' });
        }
    },
];

// Update an admin
const updateAdmin = [
    // Validation rules
    param('id').isInt().withMessage('Admin ID must be a valid integer'),
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
            const updatedAdmin = await adminService.updateAdmin(parseInt(id), { user_id });
            res.status(200).json(updatedAdmin);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update admin' });
        }
    },
];

// Delete an admin
const deleteAdmin = [
    // Validation rules
    param('id').isInt().withMessage('Admin ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            await adminService.deleteAdmin(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete admin' });
        }
    },
];

export default {
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
};