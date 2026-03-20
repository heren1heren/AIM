import express from 'express';
import conversationParticipantController from '../controllers/conversationParticipantController.js';

const router = express.Router();

router.post('/', conversationParticipantController.addParticipant); // Add a participant
router.delete('/:id', conversationParticipantController.removeParticipant); // Remove a participant
router.get('/conversation/:conversationId', conversationParticipantController.getParticipantsByConversationId); // Get participants by conversation ID

export default router;