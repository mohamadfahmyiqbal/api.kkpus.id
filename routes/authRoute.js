import express from "express";
import { registerAccount } from "../controllers/core/auth/registerAccount.js";
import { accountLogin } from "../controllers/core/auth/accountLogin.js";
import { logout } from "../controllers/core/auth/logout.js";
import { authLimiter, loginLimiter } from "../middleware/rateLimiter.js";
import { MidAnggota } from "../middleware/MidAnggota.js";

const router = express.Router();

/**
 * Path lengkap: /api/auth/register
 * Digunakan untuk pendaftaran akun anggota baru
 */
router.post("/register", authLimiter, registerAccount);

/**
 * Path lengkap: /api/auth/accountLogin
 * Digunakan untuk autentikasi anggota
 */
router.post("/accountLogin", loginLimiter, accountLogin);

/**
 * Path lengkap: /api/auth/logout
 * Digunakan untuk logout anggota
 */
router.post("/logout", MidAnggota, logout);

export default router;
