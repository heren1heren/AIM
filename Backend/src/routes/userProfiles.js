import express from 'express';
import userProfileController from '../controllers/userProfileController.js';

const router = express.Router();

// Routes
// router.post('/', userProfileController.createUserProfile); // Create a user profile

// router.get('/:id', userProfileController.getUserProfileByUserId); // Get a user profile by ID
router.put('/:id', userProfileController.updateUserProfile); // Update a user profile
// router.delete('/:id', userProfileController.deleteUserProfile); // Delete a user profile

export default router;