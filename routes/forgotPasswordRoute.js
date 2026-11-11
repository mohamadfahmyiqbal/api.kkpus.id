// routes/forgotPasswordRoute.js
import express from "express";
import { sendOTP, verifyOTP, resetPassword, resendOTP } from "../controllers/core/auth/forgotPasswordController.js";
import { authLimiter, otpLimiter, passwordResetLimiter } from "../middleware/rateLimitMiddleware.js";
import { generateCsrfToken, verifyCsrfToken } from "../middleware/csrfMiddleware.js";

const router = express.Router();

/**
 * Forgot Password Flow Routes
 * Base path: /api/auth/forgot-password
 */

// Send OTP - Apply OTP-specific rate limiting
router.post("/send-otp", otpLimiter, generateCsrfToken, verifyCsrfToken, sendOTP);

// Verify OTP - Apply general auth rate limiting
router.post("/verify-otp", authLimiter, generateCsrfToken, verifyCsrfToken, verifyOTP);

// Reset Password - Apply password reset rate limiting
router.post("/reset", passwordResetLimiter, generateCsrfToken, verifyCsrfToken, resetPassword);

// Resend OTP - Apply OTP-specific rate limiting
router.post("/resend-otp", otpLimiter, generateCsrfToken, verifyCsrfToken, resendOTP);

export default router;
