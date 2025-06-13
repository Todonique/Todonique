import app from './app';
import { config } from './config';

app.listen(config.port, "0.0.0.0", () => {
    if (config.nodeEnv === 'production') {
        console.log(`🚀 Server running on ${config.baseURL}`);
        console.log("PGHOST:", process.env.PGHOST);
    } else {
        console.log(`🚀 Server running on http://localhost:${config.port}`);
    }
});