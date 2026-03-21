import express from 'express';
import conversationController from '../controllers/conversationController.js';

const router = express.Router();

router.post('/', conversationController.createConversation); // Create a conversation
router.get('/', conversationController.getAllConversations); // Get all conversations
router.get('/:id', conversationController.getConversationById); // Get a conversation by ID
router.get('/user/:userId', conversationController.getConversationsByUserId); // Get conversations by sender ID
router.put('/:id', conversationController.updateConversation); // Update a conversation
router.delete('/:id', conversationController.deleteConversation); // Delete a conversation

export default router;