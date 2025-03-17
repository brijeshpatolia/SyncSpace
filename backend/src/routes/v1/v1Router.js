import express from 'express';
const router = express.Router();
import userRouter from './users.js';
import workspaceRouter from './workspace.js';
import channelRouter from './channel.js';
import memberRouter from './member.js';
router.use('/users',userRouter);
router.use('/workspaces',workspaceRouter)
router.use('/channels', channelRouter)
router.use('/members', memberRouter)
export default router;
