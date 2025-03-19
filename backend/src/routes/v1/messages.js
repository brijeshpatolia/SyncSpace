import express from 'express';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import { getMessagesController } from '../../controllers/messageController.js';

const router = express.Router();

router.get('/:channelId', isAuthenticated, getMessagesController);


export default router;