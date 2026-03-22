import express from 'express';
import passport from 'passport';
import conversationController from '../controllers/conversationController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes with JWT authentication
router.use(passport.authenticate('jwt', { session: false }));

// Define routes with role-based authorization
router.post('/', authorize(['admin', 'teacher', 'student']), conversationController.createConversation); // All roles can create a conversation
router.get('/', authorize(['admin', 'teacher']), conversationController.getAllConversations); // Only admin and teacher can get all conversations
router.get('/:id', authorize(['admin', 'teacher', 'student']), conversationController.getConversationById); // All roles can get a conversation by ID
router.get('/user/:userId', authorize(['admin', 'teacher', 'student']), conversationController.getConversationsByUserId); // All roles can get conversations by user ID
router.put('/:id', authorize(['admin', 'teacher']), conversationController.updateConversation); // Only admin and teacher can update a conversation
router.delete('/:id', authorize(['admin']), conversationController.deleteConversation); // Only admin can delete a conversation

export default router;