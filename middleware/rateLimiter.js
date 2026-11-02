import rateLimit from 'express-rate-limit';

// Konfigurasi dari environment variables atau default
const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const authMax = parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 20; // 20 requests per 15 min
const loginMax = parseInt(process.env.LOGIN_RATE_LIMIT_MAX) || 10; // 10 login attempts per 15 min per IP
const apiMax = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 200;

// Rate limiting untuk auth endpoints (register, etc)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: authMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Terlalu banyak permintaan otentikasi. Silakan coba lagi beberapa saat lagi.",
  },
});

// Stricter rate limiting untuk login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: loginMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Terlalu banyak percobaan login yang gagal. Silakan coba lagi setelah 15 menit.",
  },
});

// General API rate limiting
export const apiLimiter = rateLimit({
  windowMs,
  max: apiMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Terlalu banyak permintaan API. Silakan coba lagi nanti.",
  },
});
