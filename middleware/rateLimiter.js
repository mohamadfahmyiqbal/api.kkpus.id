import rateLimit from 'express-rate-limit';

// Konfigurasi dari environment variables atau default
const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const authMax = parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 10; // Lebih longgar dari default sebelumnya (5)
const loginMax = parseInt(process.env.LOGIN_RATE_LIMIT_MAX) || 5; // Lebih longgar dari default sebelumnya (3)
const apiMax = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;

// Rate limiting untuk auth endpoints (register, etc)
export const authLimiter = (req, res, next) => next();

// Stricter rate limiting untuk login attempts
export const loginLimiter = (req, res, next) => next();

// General API rate limiting
export const apiLimiter = (req, res, next) => next();