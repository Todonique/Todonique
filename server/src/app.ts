import express from 'express';
import { todoRoutes, authRoutes } from './routes';

const app = express();

app.use(express.json());

app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (_req, res) => {
    res.status(200).send('API running and healthy');
});

export default app;