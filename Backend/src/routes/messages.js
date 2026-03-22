import express from 'express';
import passport from 'passport';
import messageController from '../controllers/messageController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes with JWT authentication
router.use(passport.authenticate('jwt', { session: false }));

// Define routes with role-based authorization
router.post('/', authorize(['admin', 'teacher', 'student']), messageController.createMessage); // All roles can create a message
router.get('/', authorize(['admin', 'teacher']), messageController.getAllMessages); // Only admin and teacher can get all messages
router.get('/:id', authorize(['admin', 'teacher', 'student']), messageController.getMessageById); // All roles can get a message by ID
router.get('/conversation/:conversationId', authorize(['admin', 'teacher', 'student']), messageController.getMessagesByConversationId); // All roles can get messages by conversation ID
router.put('/:id', authorize(['admin', 'teacher', 'student']), messageController.updateMessage); // Only admin and teacher can update a message
router.delete('/:id', authorize(['admin', 'teacher', 'student']), messageController.deleteMessage); // Only admin can delete a message

export default router;