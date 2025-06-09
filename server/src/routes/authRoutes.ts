import express from 'express';
import { loginHandler, setupTwoFactorHandler, registerHandler, refreshTokenHandler, verify2FAHandler } from '../controller/authController';

const router = express.Router();

router.post('/register', registerHandler);
router.post('/setup-2fa', setupTwoFactorHandler);
router.post('/verify-2fa', verify2FAHandler); // Assuming this is for verifying 2FA setup
router.post('/login', loginHandler);
router.post('/refresh-token', refreshTokenHandler);

export default router;