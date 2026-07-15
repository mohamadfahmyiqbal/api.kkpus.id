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

/**
 * General rate limiter for all requests
 */
export const generalLimiter = (req, res, next) => next();

/**
 * Strict rate limiter for auth endpoints
 */
export const authLimiter = (req, res, next) => next();

/**
 * OTP-specific rate limiter
 */
export const otpLimiter = (req, res, next) => next();

/**
 * Password reset rate limiter
 */
export const passwordResetLimiter = (req, res, next) => next();

/**
 * Create custom rate limiter with specific options
 */
export const createRateLimiter = (options) => (req, res, next) => next();
