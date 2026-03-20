import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/', userController.createUser); // Create a user
router.get('/', userController.getAllUsers); // Get all users
router.get('/:id', userController.getUserById); // Get a user by ID
router.put('/:id', userController.updateUser); // Update a user (admin usage)
router.delete('/:id', userController.deleteUser); // Delete a user

export default router;