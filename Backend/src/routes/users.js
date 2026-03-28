import express from 'express';
import passport from 'passport';
import userController from '../controllers/userController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes with JWT authentication
router.use(passport.authenticate('jwt', { session: false }));

// Define routes with role-based authorization
router.post('/', authorize(['admin']), userController.createUser);
router.get('/', authorize(['admin']), userController.getAllUsers);
router.get('/:id', authorize(['admin']), userController.getUserById);
router.put('/:id', authorize(['admin']), userController.updateUser);
router.delete('/:id', authorize(['admin']), userController.deleteUser);

// Get user profile by ID (accessible to all authenticated users)
router.get('/:id/profile', userController.getUserProfileById);

// Update user profile (accessible to all authenticated users)
router.patch('/:id/profile', userController.updateUserProfile);

export default router;