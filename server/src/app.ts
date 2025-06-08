import express from 'express';
import { todoRoutes, authRoutes, teamRoutes } from './routes';
import { rateLimiter, securityHeaders, 
    corsMiddleware, requestSizeLimiter, sanitizeInput, 
    authenticate, authorize, locationCheck } from './middleware';
import IPinfoWrapper from 'node-ipinfo';
import { config } from './config';
import adminRoutes from './routes/adminRoutes';

const ipinfoWrapper = new IPinfoWrapper(config.ipinfoToken);
const app = express();

app.use(express.json());
app.use(rateLimiter);
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(requestSizeLimiter);
app.use(sanitizeInput);

app.use('/api/todos', authenticate, locationCheck(ipinfoWrapper), todoRoutes);
app.use('/api/auth', locationCheck(ipinfoWrapper), authRoutes);
app.use('/api/teams', authenticate, locationCheck(ipinfoWrapper), teamRoutes);

app.get('/', (_req, res) => {
    res.status(200).send('API running and healthy');
});

app.use('/api/admin', authenticate, authorize('admin'), locationCheck(ipinfoWrapper), adminRoutes);

export default app;