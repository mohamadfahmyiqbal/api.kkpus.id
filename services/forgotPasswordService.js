// services/forgotPasswordService.js
import db from "../models/index.js";
import { logger } from "../utils/logger.js";
import notificationService from "./notificationService.js";

const { Member, ForgotPasswordSession, PasswordResetToken } = db;
const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

/**
 * Service layer for forgot password functionality
 */
class ForgotPasswordService {
  /**
   * Send OTP notification
   */
  async sendOTPNotification(emailHp, otpCode, expiryMinutes = 10) {
    try {
      await notificationService.sendOTPNotification(emailHp, otpCode, expiryMinutes);
      logger.info(`OTP sent successfully to ${emailHp}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send OTP to ${emailHp}:`, error);
      throw error;
    }
  }

  /**
   * Find member by email or phone
   */
  async findMemberByEmailOrPhone(emailHp) {
    try {
      return await Member.findOne({
        where: {
          [Op.or]: [{ email: emailHp }, { phone_number: emailHp }]
        }
      });
    } catch (error) {
      logger.error("Error finding member:", error);
      throw error;
    }
  }

  /**
   * Find existing unverified session
   */
  async findExistingSession(emailHp) {
    try {
      return await ForgotPasswordSession.findOne({
        where: {
          email_hp: emailHp,
          is_verified: false,
          expires_at: { [Op.gt]: new Date() }
        }
      });
    } catch (error) {
      logger.error("Error finding existing session:", error);
      throw error;
    }
  }

  /**
   * Create new forgot password session
   */
  async createSession(emailHp, sessionId, otpCode, expiresAt, memberId) {
    try {
      return await ForgotPasswordSession.create({
        email_hp: emailHp,
        session_id: sessionId,
        otp_code: otpCode,
        expires_at: expiresAt,
        member_id: memberId
      });
    } catch (error) {
      logger.error("Error creating session:", error);
      throw error;
    }
  }

  /**
   * Update existing session with new OTP
   */
  async updateSession(session, otpCode, expiresAt) {
    try {
      return await session.update({
        otp_code: otpCode,
        expires_at: expiresAt,
        attempts: session.attempts + 1
      });
    } catch (error) {
      logger.error("Error updating session:", error);
      throw error;
    }
  }

  /**
   * Find session by session ID
   */
  async findSessionById(sessionId) {
    try {
      return await ForgotPasswordSession.findOne({
        where: {
          session_id: sessionId,
          is_verified: false
        }
      });
    } catch (error) {
      logger.error("Error finding session by ID:", error);
      throw error;
    }
  }

  /**
   * Create password reset token
   */
  async createResetToken(sessionId, resetToken, expiresAt, memberId) {
    try {
      return await PasswordResetToken.create({
        session_id: sessionId,
        reset_token: resetToken,
        expires_at: expiresAt,
        member_id: memberId
      });
    } catch (error) {
      logger.error("Error creating reset token:", error);
      throw error;
    }
  }

  /**
   * Find reset token
   */
  async findResetToken(resetToken) {
    try {
      return await PasswordResetToken.findOne({
        where: {
          reset_token: resetToken,
          used_at: null
        },
        include: [
          {
            model: ForgotPasswordSession,
            as: 'session',
            where: { is_verified: true }
          }
        ]
      });
    } catch (error) {
      logger.error("Error finding reset token:", error);
      throw error;
    }
  }

  /**
   * Update member password
   */
  async updateMemberPassword(memberId, passwordHash) {
    try {
      const member = await Member.findByPk(memberId);
      if (!member) {
        throw new Error("Member not found");
      }
      return await member.update({ password_hash: passwordHash });
    } catch (error) {
      logger.error("Error updating member password:", error);
      throw error;
    }
  }

  /**
   * Mark reset token as used
   */
  async markTokenAsUsed(tokenRecord) {
    try {
      return await tokenRecord.update({ used_at: new Date() });
    } catch (error) {
      logger.error("Error marking token as used:", error);
      throw error;
    }
  }

  /**
   * Clean up session
   */
  async cleanupSession(sessionId) {
    try {
      return await ForgotPasswordSession.destroy({
        where: { session_id: sessionId }
      });
    } catch (error) {
      logger.error("Error cleaning up session:", error);
      throw error;
    }
  }

  /**
   * Clean up expired sessions (can be called by cron job)
   */
  async cleanupExpiredSessions() {
    try {
      const deletedCount = await ForgotPasswordSession.destroy({
        where: {
          expires_at: { [Op.lt]: new Date() }
        }
      });
      
      logger.info(`Cleaned up ${deletedCount} expired sessions`);
      return deletedCount;
    } catch (error) {
      logger.error("Error cleaning up expired sessions:", error);
      throw error;
    }
  }

  /**
   * Clean up expired reset tokens
   */
  async cleanupExpiredTokens() {
    try {
      const deletedCount = await PasswordResetToken.destroy({
        where: {
          expires_at: { [Op.lt]: new Date() }
        }
      });
      
      logger.info(`Cleaned up ${deletedCount} expired tokens`);
      return deletedCount;
    } catch (error) {
      logger.error("Error cleaning up expired tokens:", error);
      throw error;
    }
  }
}

export default new ForgotPasswordService();
