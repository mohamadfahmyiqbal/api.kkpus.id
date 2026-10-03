// middleware/rateLimitMiddleware.js
import rateLimit from 'express-rate-limit';
import { ipKeyGenerator } from 'express-rate-limit';
import { logger } from '../utils/logger.js';

// Konfigurasi dari environment variables atau default
const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const generalMax = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;
const authMax = parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 10;
const otpMax = parseInt(process.env.OTP_RATE_LIMIT_MAX) || 5;
const passwordResetMax = parseInt(process.env.PASSWORD_RESET_RATE_LIMIT_MAX) || 5;

const standardMessage = {
  status: false,
  message: 'Terlalu banyak permintaan dari IP ini, coba lagi nanti.',
};

/**
 * General rate limiter for all requests
 */
export const generalLimiter = rateLimit({
  windowMs,
  max: generalMax,
  message: standardMessage,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for auth endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: authMax,
  message: { ...standardMessage, message: 'Terlalu banyak percobaan login, silakan tunggu 5 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * OTP-specific rate limiter
 */
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: otpMax,
  message: { ...standardMessage, message: 'Terlalu banyak request OTP, silakan tunggu 15 menit.' },
});

/**
 * Password reset rate limiter
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: passwordResetMax,
  message: { ...standardMessage, message: 'Terlalu banyak percobaan reset password, silakan coba 1 jam lagi.' },
});

/**
 * Create custom rate limiter with specific options
 */
export const createRateLimiter = (options) => rateLimit({
  windowMs: options.windowMs || windowMs,
  max: options.max || generalMax,
  message: options.message || standardMessage,
});
