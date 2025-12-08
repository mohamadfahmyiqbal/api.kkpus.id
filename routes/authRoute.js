import express from "express";
// Ubah path import
import { registerAccount } from "../controllers/core/auth/registerAccount.js"; 
import { accountLogin } from "../controllers/core/auth/accountLogin.js";

const router = express.Router();

// POST /api/v1/auth/register
router.post('/register', registerAccount); // Perhatikan: jika di routes.js menggunakan router.use('/auth', authRoute), maka endpoint di sini adalah /register
router.post('/accountLogin', accountLogin); // Perhatikan: jika di routes.js menggunakan router.use('/auth', authRoute), maka endpoint di sini adalah /register

export default router;