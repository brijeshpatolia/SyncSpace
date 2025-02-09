import express from 'express';
import { signUp, signIn } from '../../controllers/userController.js';
import { validate } from '../../validators/zodValidator.js';
import { userSignupSchema, userSigninSchema } from '../../validators/userSchema.js';

const router = express.Router();

router.post('/signup', validate(userSignupSchema), signUp);
router.post('/signin', validate(userSigninSchema), signIn);

export default router;
