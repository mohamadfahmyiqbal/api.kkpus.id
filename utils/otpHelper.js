// utils/otpHelper.js
import crypto from 'crypto';

/**
 * Generate 6-digit OTP code
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate session ID
 */
export const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate reset token
 */
export const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Check if OTP has expired
 */
export const isOTPExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt);
};

/**
 * Calculate expiry time (10 minutes from now for OTP, 15 for reset token)
 */
export const calculateOTPExpiry = () => {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

export const calculateResetTokenExpiry = () => {
  return new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
};

/**
 * Hash OTP for secure storage (optional, but recommended)
 */
export const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

/**
 * Verify OTP against hash
 */
export const verifyOTP = (otp, hash) => {
  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
  return otpHash === hash;
};
