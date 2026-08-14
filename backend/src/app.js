import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import statusRoutes from './routes/status.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { rateLimitMiddleware } from './middlewares/rateLimiter.js';

const app = express();
app.set('trust proxy', 1); // Trust the first proxy (e.g., Nginx, Cloudflare) to get real IPs

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors()); // Allow all origins for now, or specify localhost:5173
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting globally to all requests
app.use(rateLimitMiddleware);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', statusRoutes);

app.use(errorHandler);

export { app };
