import express from 'express';
import messageController from '../controllers/messageController.js';

const router = express.Router();

router.post('/', messageController.createMessage); // Create a message
router.get('/', messageController.getAllMessages); // Get all messages
router.get('/:id', messageController.getMessageById); // Get a message by ID
router.get('/conversation/:conversationId', messageController.getMessagesByConversationId); // Get messages by conversation ID
router.put('/:id', messageController.updateMessage); // Update a message
router.delete('/:id', messageController.deleteMessage); // Delete a message

export default router;