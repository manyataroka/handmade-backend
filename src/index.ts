import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { connectDatabase, disconnectDatabase } from './database/mongodb';
import authRoutes from './routes/auth.route';
import productRoutes from './routes/product.route';
import cartRoutes from './routes/cart.route';
import orderRoutes from './routes/order.route';
import userRoutes from './routes/user.route';
import wishlistRoutes from './routes/wishlist.route';
import addressRoutes from './routes/address.route';
import couponRoutes from './routes/coupon.route';
import adminRoutes from './routes/admin.route';
import { ProductModel } from './models/product.model';
import { UserModel } from './models/user.model';
import bcryptjs from 'bcryptjs';
import { successResponse, errorResponse } from './utils/response';

export const app: Application = express();

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Response compression (for Flutter mobile/web performance)
app.use(compression());

// CORS (allow override via env, supports multiple origins for Flutter)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin) || origin === CLIENT_ORIGIN) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Built-in parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API version prefix
const API_PREFIX = '/api/v1';

// Routes (v1 prefixed)
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/cart`, cartRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/wishlist`, wishlistRoutes);
app.use(`${API_PREFIX}/addresses`, addressRoutes);
app.use(`${API_PREFIX}/coupons`, couponRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);

// Health / welcome
app.get('/', (req: Request, res: Response) =>
  res.status(200).json({ success: true, message: 'Welcome to the API' })
);

// Health check endpoint (for Flutter connectivity checks)
app.get('/api/health', (req: Request, res: Response) =>
  res.status(200).json({
    success: true,
    message: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  })
);

// Also keep legacy non-prefixed routes for backward compatibility
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);

// Simple error handler (logs and returns JSON)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  const status = err?.status || err?.statusCode || 500;
  res.status(status).json(errorResponse(err?.message || 'Internal server error', status));
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

  // Seed initial products if the collection is empty
  try {
    const count = await ProductModel.countDocuments();
    if (count === 0) {
      const seedProducts = [
        { name: 'Beads Necklace', price: 400, imagePath: '/images/img2.jpg', category: 'necklace', trending: true },
        { name: 'Round Chain', price: 325, imagePath: '/images/img13.jpg', category: 'necklace' },
        { name: 'Beads Pearl Bracelet', price: 450, imagePath: '/images/img5.jpg', category: 'bracelet' },
        { name: 'Adjustable Bracelet', price: 499, imagePath: '/images/img6.jpg', category: 'bracelet', isNewArrival: true },
        { name: 'Silver Ring', price: 999, imagePath: '/images/img7.jpg', category: 'ring' },
        { name: 'Panchadhatu Ring', price: 1099, imagePath: '/images/img8.jpg', category: 'ring', trending: true },
        { name: 'Adjustable Silver Ring', price: 999, imagePath: '/images/img9.jpg', category: 'ring' },
        { name: 'Pearl Bracelet', price: 599, imagePath: '/images/img10.jpg', category: 'bracelet' },
        { name: 'Pearl Neck Piece', price: 649, imagePath: '/images/img2.jpg', category: 'necklace', isNewArrival: true },
        { name: 'Gemstone Anklet', price: 1199, imagePath: '/images/img12.jpg', category: 'anklet' },
        { name: 'Laliguras Necklace Set', price: 3099, imagePath: '/images/img13.jpg', category: 'necklace', trending: true },
        { name: 'Silver NecklaceSet', price: 2099, imagePath: '/images/img14.jpg', category: 'necklace' },
        { name: 'Flower Necklace Set', price: 1099, imagePath: '/images/img15.jpg', category: 'necklace' },
        { name: 'Flower earring', price: 499, imagePath: '/images/img17.jpg', category: 'earring', isNewArrival: true },
        { name: 'Artisan earring', price: 899, imagePath: '/images/img16.jpg', category: 'earring' },
        { name: 'Dropdown Earring', price: 799, imagePath: '/images/img18.jpg', category: 'earring', trending: true },
      ];
      await ProductModel.insertMany(seedProducts);
      console.log(`Seeded ${seedProducts.length} initial products`);
    }
  } catch (seedErr: any) {
    console.warn('Product seed skipped:', seedErr?.message || seedErr);
  }

  // Seed admin user if not exists, or reset password on every startup for convenience
  try {
    const ADMIN_EMAIL = 'admin@craftybee.com';
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin123';
    const existing = await UserModel.findOne({
      $or: [{ email: ADMIN_EMAIL }, { username: ADMIN_USERNAME }],
    });
    if (!existing) {
      const hashed = await bcryptjs.hash(ADMIN_PASSWORD, 10);
      await UserModel.create({
        email: ADMIN_EMAIL,
        username: ADMIN_USERNAME,
        password: hashed,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      });
      console.log(`Seeded admin user: ${ADMIN_EMAIL} / ${ADMIN_USERNAME} (pw: ${ADMIN_PASSWORD})`);
    } else {
      const hashed = await bcryptjs.hash(ADMIN_PASSWORD, 10);
      let needsSave = false;
      if (existing.role !== 'admin') { existing.role = 'admin'; needsSave = true; }
      if (existing.password !== hashed) { existing.password = hashed; needsSave = true; }
      if (existing.email !== ADMIN_EMAIL) { existing.email = ADMIN_EMAIL; needsSave = true; }
      if (existing.username !== ADMIN_USERNAME) { existing.username = ADMIN_USERNAME; needsSave = true; }
      if (needsSave) await existing.save();
      console.log(`Admin user ensured: ${ADMIN_EMAIL} / ${ADMIN_USERNAME} (pw: ${ADMIN_PASSWORD})`);
    }
  } catch (adminErr: any) {
    console.warn('Admin seed skipped:', adminErr?.message || adminErr);
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