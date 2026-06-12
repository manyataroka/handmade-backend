import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { connectDatabase, disconnectDatabase } from './database/mongodb';
import authRoutes from './routes/auth.route';

export const app: Application = express();

// CORS (allow override via env)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

// Built-in parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Health / welcome
app.get('/', (req: Request, res: Response) =>
  res.status(200).json({ success: true, message: 'Welcome to the API' })
);

// Simple error handler (logs and returns JSON)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(err?.status || 500).json({
    success: false,
    message: err?.message || 'Internal server error',
  });
});

// Start server with safe DB connect handling
async function startServer() {
  try {
    // Pass explicit env var; connectDatabase should handle defaults/retries.
    await connectDatabase(process.env.MONGODB_URI);
  } catch (err) {
    console.error('Failed to connect to MongoDB after retries:', err);
    // If STRICT_DB is set, treat DB failure as unrecoverable and exit (useful in CI).
    // Otherwise return so local dev (nodemon) stays up for code changes.
    if (process.env.STRICT_DB === 'true') {
      console.error('STRICT_DB=true — exiting due to DB connection failure.');
      process.exit(1);
    }
    console.warn('Continuing without DB connection (set STRICT_DB=true to exit on failure).');
    return;
  }

  const PORT = Number(process.env.PORT) || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

// Graceful shutdown: close mongoose connection then exit
async function handleShutdown(signal: string) {
  try {
    console.log(`${signal} received, shutting down.`);
    await disconnectDatabase();
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));