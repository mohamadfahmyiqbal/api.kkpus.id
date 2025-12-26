import express from "express";
import { registerAccount } from "../controllers/core/auth/registerAccount.js"; 
import { accountLogin } from "../controllers/core/auth/accountLogin.js";

const router = express.Router();

/**
 * Path lengkap: /api/auth/register
 * Digunakan untuk pendaftaran akun anggota baru
 */
router.post('/register', registerAccount); 

/**
 * Path lengkap: /api/auth/accountLogin
 * Digunakan untuk autentikasi anggota
 */
router.post('/accountLogin', accountLogin); 

export default router;