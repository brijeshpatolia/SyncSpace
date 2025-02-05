import express from 'express';
const router = express.Router();
import userRouter from './users.js';

router.use('/users',userRouter);
export default router;
