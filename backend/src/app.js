import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import statusRoutes from './routes/status.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { rateLimitMiddleware } from './middlewares/rateLimiter.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting globally to all requests
app.use(rateLimitMiddleware);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', statusRoutes);

app.use(errorHandler);

export { app };
