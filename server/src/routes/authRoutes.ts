import express from 'express';
import { registerHandler, loginHandler, setupTwoFactorAuthenticationHandler, verifyTwoFactorHandler } from '../controller';

const router = express.Router();

router.post('/register', registerHandler as express.RequestHandler);
router.post('/setup-2fa', setupTwoFactorAuthenticationHandler as express.RequestHandler);
router.post('/verify-2fa', verifyTwoFactorHandler as express.RequestHandler);
router.post('/login', loginHandler as express.RequestHandler);

export default router;