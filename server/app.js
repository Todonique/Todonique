import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(express.json());

app.get('/', (_req, res) => {
    res.status(200).send('API running and healthy');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    if (process.env.ENVIRONMENT === 'production') {
        console.log(`🚀 Server running on ${process.env.BASE_URL}`);
    } else {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    }
});

export default app;