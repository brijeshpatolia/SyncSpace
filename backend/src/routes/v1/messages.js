import express from 'express';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import { createMessageController, deleteMessageController, getMessagesController, updateMessageController } from '../../controllers/messageController.js';

const router = express.Router();

router.get('/:channelId', isAuthenticated, getMessagesController);
router.post('/:channelId', isAuthenticated, createMessageController);
router.put('/:messageId', isAuthenticated, updateMessageController);
router.delete('/:messageId', isAuthenticated, deleteMessageController);

export default router;