import express from 'express';
import passport from 'passport';
import userProfileController from '../controllers/userProfileController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes with JWT authentication
router.use(passport.authenticate('jwt', { session: false }));


router.put('/:id', authorize(['admin', 'teacher', 'student']), userProfileController.updateUserProfile);

export default router;