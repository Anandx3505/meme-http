import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import statusRoutes from './routes/status.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Expose the public folder so images can be served directly
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.use('/', statusRoutes);

// Global Error Handler
app.use(errorHandler);

export { app };
