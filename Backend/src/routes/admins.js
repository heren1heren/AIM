import express from 'express';
import passport from 'passport';
import adminController from '../controllers/adminController.js';
import { authorize } from '../middleware/auth.js';

const { getAllAdmins, createAdmin, updateAdmin, deleteAdmin } = adminController;

const router = express.Router();

// Protect all routes with JWT authentication
router.use(passport.authenticate('jwt', { session: false }));

// Route to get all admins (only accessible by admin role)
router.get('/', authorize(['admin']), getAllAdmins);

// // Route to create a new admin (only accessible by admin role)
// router.post('/', authorize(['admin']), createAdmin);

// // Route to update an admin by ID (only accessible by admin role)
// router.put('/:id', authorize(['admin']), updateAdmin);

// // Route to delete an admin by ID (only accessible by admin role)
// router.delete('/:id', authorize(['admin']), deleteAdmin);

export default router;