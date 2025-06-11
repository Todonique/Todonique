import express from 'express';
import { todoRoutes, authRoutes, teamRoutes, roleRoutes, inviteRoutes, todoReportingRoutes, userRoutes } from './routes';
import { loginRateLimiter, apiRateLimiter, securityHeaders, 
    corsMiddleware, requestSizeLimiter, sanitizeInput, 
    authenticate, locationCheck } from './middleware';
import IPinfoWrapper from 'node-ipinfo';
import { config } from './config';
import adminRoutes from './routes/adminRoutes';

const ipinfoWrapper = new IPinfoWrapper(config.ipinfoToken);
const app = express();

app.use(express.json());
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(requestSizeLimiter);
app.use(sanitizeInput);

// locationCheck(ipinfoWrapper)

app.use('/api/auth', loginRateLimiter, authRoutes);
app.use('/api/todos', apiRateLimiter, authenticate, todoRoutes);
app.use('/api/teams', apiRateLimiter, authenticate, teamRoutes);
app.use('/api/roles', apiRateLimiter, roleRoutes);
app.use('/api/history', apiRateLimiter, authenticate, todoReportingRoutes);
app.use('/api/invites', apiRateLimiter, authenticate, inviteRoutes);
app.use('/api/users', apiRateLimiter, authenticate, userRoutes);

app.get('/', (_req, res) => {
    res.status(200).send('API running and healthy');
});

app.use('/api/admin', authenticate, authorize('admin'), locationCheck(ipinfoWrapper), adminRoutes);

export default app;