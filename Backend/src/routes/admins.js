import express from 'express';
import adminController from '../controllers/adminController.js';

const { getAllAdmins, createAdmin, updateAdmin, deleteAdmin } = adminController;

const router = express.Router();

// Route to get all admins
router.get('/', getAllAdmins);

// Route to create a new admin
router.post('/', createAdmin);

// Route to update an admin by ID
router.put('/:id', updateAdmin);

// Route to delete an admin by ID
router.delete('/:id', deleteAdmin);

export default router;