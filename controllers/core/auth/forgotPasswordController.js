// controllers/core/auth/forgotPasswordController.js
import { 
  generateOTP, 
  generateSessionId, 
  generateResetToken, 
  calculateOTPExpiry, 
  calculateResetTokenExpiry, 
  isOTPExpired 
} from "../../../utils/otpHelper.js";
import { validatePassword } from "../../../utils/passwordValidator.js";
import forgotPasswordService from "../../../services/forgotPasswordService.js";
import { logger } from "../../../utils/logger.js";

/**
 * Send OTP for password reset
 */
export const sendOTP = async (req, res) => {
  const { emailHp } = req.body;

  // Validate input
  if (!emailHp) {
    return res.status(400).json({
      success: false,
      message: "Email atau nomor handphone wajib diisi."
    });
  }

  try {
    // Find user by email or phone
    const member = await forgotPasswordService.findMemberByEmailOrPhone(emailHp);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Akun tidak ditemukan."
      });
    }

    // Check if there's an existing unverified session
    const existingSession = await forgotPasswordService.findExistingSession(emailHp);

    let sessionId;
    let otpCode;
    let expiresAt;

    if (existingSession) {
      // Use existing session
      sessionId = existingSession.session_id;
      otpCode = generateOTP();
      expiresAt = calculateOTPExpiry();
      
      // Update existing session with new OTP
      await forgotPasswordService.updateSession(existingSession, otpCode, expiresAt);
    } else {
      // Create new session
      sessionId = generateSessionId();
      otpCode = generateOTP();
      expiresAt = calculateOTPExpiry();

      await forgotPasswordService.createSession(emailHp, sessionId, otpCode, expiresAt, member.member_id);
    }

    // Send OTP via email/SMS
    await forgotPasswordService.sendOTPNotification(emailHp, otpCode, 10);

    return res.status(200).json({
      success: true,
      message: "OTP berhasil dikirim.",
      data: {
        sessionId: sessionId,
        expiresAt: expiresAt
      }
    });

  } catch (error) {
    logger.error("Send OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server."
    });
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (req, res) => {
  const { otpCode, sessionId } = req.body;

  // Validate input
  if (!otpCode || !sessionId) {
    return res.status(400).json({
      success: false,
      message: "Kode OTP dan session ID wajib diisi."
    });
  }

  try {
    // Find session
    const session = await forgotPasswordService.findSessionById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Sesi tidak ditemukan atau sudah diverifikasi."
      });
    }

    // Check expiry
    if (isOTPExpired(session.expires_at)) {
      return res.status(400).json({
        success: false,
        message: "Kode OTP sudah kadaluarsa."
      });
    }

    // Verify OTP
    if (session.otp_code !== otpCode) {
      // Increment attempts
      await forgotPasswordService.updateSession(session, session.otp_code, session.expires_at);
      
      return res.status(400).json({
        success: false,
        message: "Kode OTP tidak valid."
      });
    }

    // Mark session as verified
    await session.update({ is_verified: true });

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpiry = calculateResetTokenExpiry();

    // Create password reset token
    await forgotPasswordService.createResetToken(sessionId, resetToken, resetTokenExpiry, session.member_id);

    return res.status(200).json({
      success: true,
      message: "OTP berhasil diverifikasi.",
      data: {
        resetToken: resetToken,
        expiresAt: resetTokenExpiry
      }
    });

  } catch (error) {
    logger.error("Verify OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server."
    });
  }
};

/**
 * Reset password
 */
export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  const clientIP = req.ip;
  const userAgent = req.get('User-Agent');

  // Log reset attempt
  logger.info(`Password reset attempt from IP: ${clientIP}`, {
    ip: clientIP,
    userAgent: userAgent,
    hasResetToken: !!resetToken,
    hasNewPassword: !!newPassword
  });

  // Validate input
  if (!resetToken || !newPassword) {
    logger.warn(`Invalid reset request - missing fields from IP: ${clientIP}`);
    return res.status(400).json({
      success: false,
      message: "Reset token dan password baru wajib diisi."
    });
  }

  // Password validation using the new validator
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    logger.warn(`Invalid password from IP: ${clientIP}`, {
      passwordStrength: passwordValidation.strength,
      errors: passwordValidation.errors
    });
    
    return res.status(400).json({
      success: false,
      message: "Password tidak memenuhi syarat keamanan.",
      errors: passwordValidation.errors
    });
  }

  try {
    // Find reset token
    const tokenRecord = await forgotPasswordService.findResetToken(resetToken);

    if (!tokenRecord) {
      return res.status(404).json({
        success: false,
        message: "Token reset tidak valid atau sudah digunakan."
      });
    }

    // Check expiry
    if (isOTPExpired(tokenRecord.expires_at)) {
      return res.status(400).json({
        success: false,
        message: "Token reset sudah kadaluarsa."
      });
    }

    // Hash new password
    const bcrypt = require('bcrypt');
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    // Update password
    await forgotPasswordService.updateMemberPassword(tokenRecord.member_id, password_hash);

    // Mark token as used
    await forgotPasswordService.markTokenAsUsed(tokenRecord);

    // Clean up session
    await forgotPasswordService.cleanupSession(tokenRecord.session_id);

    // Log successful reset
    logger.info(`Password reset successful for member: ${tokenRecord.member_id}`, {
      ip: clientIP,
      memberId: tokenRecord.member_id,
      sessionId: tokenRecord.session_id
    });

    return res.status(200).json({
      success: true,
      message: "Password berhasil direset."
    });

  } catch (error) {
    logger.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server."
    });
  }
};

/**
 * Resend OTP
 */
export const resendOTP = async (req, res) => {
  const { sessionId } = req.body;

  // Validate input
  if (!sessionId) {
    return res.status(400).json({
      success: false,
      message: "Session ID wajib diisi."
    });
  }

  try {
    // Find session
    const session = await forgotPasswordService.findSessionById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Sesi tidak ditemukan atau sudah diverifikasi."
      });
    }

    // Generate new OTP
    const otpCode = generateOTP();
    const expiresAt = calculateOTPExpiry();

    // Update session
    await forgotPasswordService.updateSession(session, otpCode, expiresAt);

    // Send OTP via email/SMS
    await forgotPasswordService.sendOTPNotification(session.email_hp, otpCode, 10);

    return res.status(200).json({
      success: true,
      message: "OTP berhasil dikirim ulang.",
      data: {
        sessionId: sessionId,
        expiresAt: expiresAt
      }
    });

  } catch (error) {
    logger.error("Resend OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server."
    });
  }
};
