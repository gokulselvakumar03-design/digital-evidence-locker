import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env.config.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { apiLimiter } from './middlewares/rateLimiter.middleware.js';
import { ApiError } from './utils/apiError.js';
import { ApiResponse } from './utils/apiResponse.js';

// Route imports
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/users.routes.js';
import caseRoutes from './modules/cases/cases.routes.js';
import evidenceRoutes from './modules/evidence/evidence.routes.js';
import commentRoutes from './modules/comments/comments.routes.js';
import notificationRoutes from './modules/notifications/notifications.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';

/**
 * Express Application Setup
 * Path: server/src/app.ts
 * Purpose: Initializes Express app, security middlewares, route registration, health check, and error handlers.
 */
const app: Application = express();

// 1. Security & Core Middlewares
app.use(helmet());
app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 2. Global Rate Limiter
app.use('/api', apiLimiter);

// 3. Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.env,
      },
      'Digital Evidence Locker Server Health Check OK'
    )
  );
});

// 4. API V1 Route Mounts
const apiV1Router = express.Router();

apiV1Router.use('/auth', authRoutes);
apiV1Router.use('/users', userRoutes);
apiV1Router.use('/cases', caseRoutes);
apiV1Router.use('/evidence', evidenceRoutes);
apiV1Router.use('/comments', commentRoutes);
apiV1Router.use('/notifications', notificationRoutes);
apiV1Router.use('/analytics', analyticsRoutes);
apiV1Router.use('/admin', adminRoutes);
apiV1Router.use('/ai', aiRoutes);

app.use('/api/v1', apiV1Router);

// 5. 404 Handler for Unmatched Routes
app.use('*', (req: Request, _res: Response, next) => {
  next(new ApiError(404, `Cannot find ${req.originalUrl} on this server`));
});

// 6. Global Exception Middleware
app.use(errorHandler);

export default app;
