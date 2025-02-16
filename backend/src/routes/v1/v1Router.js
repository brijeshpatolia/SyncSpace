import express from 'express';
const router = express.Router();
import userRouter from './users.js';
import workspaceRouter from './workspace.js';


router.use('/users',userRouter);
router.use('/workspaces',workspaceRouter)
export default router;
