import express from 'express';
import { todoRoutes, authRoutes } from './routes';
import { rateLimiter, securityHeaders, 
    corsMiddleware, requestSizeLimiter, sanitizeInput, 
    authenticate, authorize, locationCheck } from './middleware';

const app = express();

app.use(express.json());
app.use(rateLimiter);
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(requestSizeLimiter);
app.use(sanitizeInput);

app.use('/api/todos', authenticate, authorize('user'), locationCheck, todoRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (_req, res) => {
    res.status(200).send('API running and healthy');
});

export default app;