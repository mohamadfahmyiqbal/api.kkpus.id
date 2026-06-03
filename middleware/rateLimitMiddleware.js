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
export const generalLimiter = rateLimit({
  windowMs,
  max: generalMax,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.'
    });
  }
});

/**
 * Strict rate limiter for auth endpoints
 */
export const authLimiter = rateLimit({
  windowMs,
  max: authMax,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later.'
    });
  }
});

/**
 * OTP-specific rate limiter
 */
export const otpLimiter = rateLimit({
  windowMs,
  max: otpMax,
  message: {
    success: false,
    message: 'Too many OTP requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    // Use email/phone as key for more specific limiting
    return req.body?.emailHp || ipKeyGenerator(req, res);
  },
  handler: (req, res) => {
    logger.warn(`OTP rate limit exceeded for IP: ${req.ip}, Email: ${req.body?.emailHp}`);
    res.status(429).json({
      success: false,
      message: 'Too many OTP requests, please try again later.'
    });
  }
});

/**
 * Password reset rate limiter
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour default
  max: passwordResetMax,
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    // Use reset token as key if available
    return req.body?.resetToken || ipKeyGenerator(req, res);
  },
  handler: (req, res) => {
    logger.warn(`Password reset rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many password reset attempts, please try again later.'
    });
  }
});

/**
 * Create custom rate limiter with specific options
 */
export const createRateLimiter = (options) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes default
    max: 100, // 100 requests default
    message: {
      success: false,
      message: 'Rate limit exceeded, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Custom rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        success: false,
        message: 'Rate limit exceeded, please try again later.'
      });
    },
    ...options
  });
};
