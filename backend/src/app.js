import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ENV } from './config/env.js';
import { globalLimiter } from './middlewares/rateLimiter.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { testConnection } from './config/db.js';

// Route Handlers
import authRoutes from './routes/authRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import farmerRoutes from './routes/farmerRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing
const allowedOrigins = ENV.CLIENT_URL.split(',').map((url) => url.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true); // Dev friendly
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })
);

// HTTP Request Logger
if (ENV.NODE_ENV !== 'test') {
  app.use(morgan(ENV.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply Global Rate Limiting
app.use('/api', globalLimiter);

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.status(dbStatus.ok ? 200 : 503).json({
    status: dbStatus.ok ? 'healthy' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'LocalFarm Direct API Gateway',
    version: '4.0.0',
    database: dbStatus.ok ? 'connected' : 'disconnected',
    ...(dbStatus.error && { dbError: dbStatus.error }),
  });
});

// Mount Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', customerRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/admin', adminRoutes);

// Root API Index
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to LocalFarm Direct REST API (v4.0)',
    documentation: '/BACKEND_ARCHITECTURE.md',
    health: '/api/health',
    endpoints: {
      auth: '/api/auth',
      media: '/api/media/upload',
      products: '/api/products',
      orders: '/api/orders',
      farmer: '/api/farmer',
      delivery: '/api/delivery',
      admin: '/api/admin',
    },
  });
});

// 404 Handler for unmatched routes
app.use(notFoundHandler);

// Centralized Global Error Handler
app.use(errorHandler);

export default app;
