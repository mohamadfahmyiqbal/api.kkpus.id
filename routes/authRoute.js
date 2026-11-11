import express from "express";
import { registerAccount } from "../controllers/core/auth/registerAccount.js";
import { accountLogin } from "../controllers/core/auth/accountLogin.js";
import { logout } from "../controllers/core/auth/logout.js";
import { getCurrentUser } from "../controllers/core/auth/me.js";
import { authLimiter, loginLimiter } from "../middleware/rateLimitMiddleware.js";
import { MidAnggota } from "../middleware/MidAnggota.js";
import { generateCsrfToken, verifyCsrfToken } from "../middleware/csrfMiddleware.js";

const router = express.Router();

/**
 * Generate CSRF token and expose to frontend
 * Used by frontend to get CSRF token for subsequent requests
 */
router.get("/csrf-token", generateCsrfToken, (req, res) => {
  res.status(200).json({
    success: true,
    csrfToken: res.locals.csrfToken,
    message: "CSRF token generated successfully"
  });
});

/**
 * Path lengkap: /api/auth/register
 * Digunakan untuk pendaftaran akun anggota baru
 */
router.post("/register", authLimiter, registerAccount);

/**
 * Path lengkap: /api/auth/accountLogin
 * Digunakan untuk autentikasi anggota
 * CSRF protection for POST requests
 */
router.post("/accountLogin", loginLimiter, generateCsrfToken, verifyCsrfToken, accountLogin);

/**
 * Path lengkap: /api/auth/logout
 * Digunakan untuk logout anggota
 */
router.post("/logout", MidAnggota, verifyCsrfToken, logout);

/**
 * Path lengkap: /api/auth/me
 * Digunakan untuk mendapatkan detail pengguna saat ini dari cookie
 * Used by frontend after cookie-based authentication
 */
router.get("/me", getCurrentUser);

export default router;
