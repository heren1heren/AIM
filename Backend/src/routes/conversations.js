import express from 'express';
import conversationController from '../controllers/conversationController.js';

const router = express.Router();

router.post('/', conversationController.createConversation); // Create a conversation
router.get('/', conversationController.getAllConversations); // Get all conversations
router.get('/:id', conversationController.getConversationById); // Get a conversation by ID

export default router;