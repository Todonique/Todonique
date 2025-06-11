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

app.use('/api/auth', loginRateLimiter, locationCheck(ipinfoWrapper), authRoutes);
app.use('/api/todos', apiRateLimiter, authenticate, locationCheck(ipinfoWrapper), todoRoutes);
app.use('/api/teams', apiRateLimiter, authenticate, locationCheck(ipinfoWrapper), teamRoutes);
app.use('/api/roles', apiRateLimiter, locationCheck(ipinfoWrapper), roleRoutes);
app.use('/api/history', apiRateLimiter, authenticate, locationCheck(ipinfoWrapper), todoReportingRoutes);
app.use('/api/invites', apiRateLimiter, authenticate, locationCheck(ipinfoWrapper), inviteRoutes);
app.use('/api/users', apiRateLimiter, authenticate, locationCheck(ipinfoWrapper), userRoutes);

app.get('/', (_req, res) => {
    res.status(200).send('API running and healthy');
});

app.use('/api/admin', authenticate, authorize('admin'), locationCheck(ipinfoWrapper), adminRoutes);

export default app;