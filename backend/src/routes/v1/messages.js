import express from 'express';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import { createMessageController, getMessagesController } from '../../controllers/messageController.js';

const router = express.Router();

router.get('/:channelId', isAuthenticated, getMessagesController);
router.post('/:channelId', isAuthenticated, createMessageController); // Added this line

export default router;