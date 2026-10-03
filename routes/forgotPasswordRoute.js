// routes/forgotPasswordRoute.js
import express from "express";
import { sendOTP, verifyOTP, resetPassword, resendOTP } from "../controllers/core/auth/forgotPasswordController.js";
import { authLimiter, otpLimiter, passwordResetLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

/**
 * Forgot Password Flow Routes
 * Base path: /api/auth/forgot-password
 */

// Send OTP - Apply OTP-specific rate limiting
router.post("/send-otp", otpLimiter, sendOTP);

// Verify OTP - Apply general auth rate limiting
router.post("/verify-otp", authLimiter, verifyOTP);

// Reset Password - Apply password reset rate limiting
router.post("/reset", passwordResetLimiter, resetPassword);

// Resend OTP - Apply OTP-specific rate limiting
router.post("/resend-otp", otpLimiter, resendOTP);

export default router;
