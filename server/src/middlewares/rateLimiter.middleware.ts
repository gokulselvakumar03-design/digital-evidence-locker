import rateLimit from 'express-rate-limit';

/**
 * Rate Limiting Middleware
 * Path: server/src/middlewares/rateLimiter.middleware.ts
 * Purpose: Protects public & sensitive endpoints from brute-force and DDoS attacks.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP, please try again after 15 minutes',
    },
  },
});
