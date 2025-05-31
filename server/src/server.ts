import app from './app';
import { config } from './config';

app.listen(config.port, () => {
    if (config.nodeEnv === 'production') {
        console.log(`🚀 Server running on ${config.baseURL}`);
    } else {
        console.log(`🚀 Server running on http://localhost:${config.port}`);
    }
});