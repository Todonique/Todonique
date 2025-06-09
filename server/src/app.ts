import express from 'express';
import { todoRoutes, authRoutes, teamRoutes, roleRoutes, inviteRoutes } from './routes';
import { rateLimiter, securityHeaders, 
    corsMiddleware, requestSizeLimiter, sanitizeInput, 
    authenticate, locationCheck } from './middleware';
import IPinfoWrapper from 'node-ipinfo';
import { config } from './config';

const ipinfoWrapper = new IPinfoWrapper(config.ipinfoToken);
const app = express();

app.use(express.json());
app.use(rateLimiter);
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(requestSizeLimiter);
app.use(sanitizeInput);

app.use('/api/auth', locationCheck(ipinfoWrapper), authRoutes);
app.use('/api/todos', authenticate, locationCheck(ipinfoWrapper), todoRoutes);
app.use('/api/teams', authenticate, locationCheck(ipinfoWrapper), teamRoutes);
app.use('/api/roles', locationCheck(ipinfoWrapper), roleRoutes);
app.use('/api/invites', authenticate, locationCheck(ipinfoWrapper), inviteRoutes);

app.get('/', (_req, res) => {
    res.status(200).send('API running and healthy');
});

export default app;