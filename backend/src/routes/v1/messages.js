import express from 'express';
import { isAuthenticated } from '../../middlewares/authMiddleware';
import { getMessagesController } from '../../controllers/messageController';

const router = express.Router();

router.get('/messages/:channelId', isAuthenticated , getMessagesController);

export default router;