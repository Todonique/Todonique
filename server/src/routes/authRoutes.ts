import express from 'express';
import { loginHandler, setupTwoFactorAuthenticationHandler, verifyTwoFactorHandler, registerHandler } from '../controller/authController';

const router = express.Router();

router.post('/register', registerHandler);
router.post('/setup-2fa', setupTwoFactorAuthenticationHandler);
router.post('/verify-2fa', verifyTwoFactorHandler);
router.post('/login', loginHandler);

export default router;