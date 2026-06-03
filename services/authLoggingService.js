import db from "../../models/index.js";

const { sequelize } = db;

/**
 * Log login attempts untuk security monitoring
 */
export const logLoginAttempt = async (req, success, memberId = null, reason = null) => {
  try {
    const { emailHp, ip, userAgent } = {
      emailHp: req.body?.emailHp || 'unknown',
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown'
    };

    await sequelize.query(`
      INSERT INTO login_attempts (
        email_or_phone,
        ip_address,
        user_agent,
        success,
        member_id,
        failure_reason,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW())
    `, {
      replacements: [emailHp, ip, userAgent, success, memberId, reason],
      type: sequelize.QueryTypes.INSERT
    });

    // Log ke console untuk monitoring real-time
    if (!success) {
      console.warn(`LOGIN FAILED: ${emailHp} from ${ip} - ${reason}`);
    } else {
      console.log(`LOGIN SUCCESS: ${emailHp} from ${ip}`);
    }

  } catch (error) {
    console.error('Failed to log login attempt:', error);
    // Jangan blocking proses login jika logging gagal
  }
};

/**
 * Cek apakah akun terkunci karena terlalu banyak failed attempts
 */
export const checkAccountLockout = async (emailHp) => {
  try {
    const [lockoutInfo] = await sequelize.query(`
      SELECT 
        COUNT(*) as failed_attempts,
        MAX(created_at) as last_attempt
      FROM login_attempts 
      WHERE email_or_phone = ? 
        AND success = false 
        AND created_at > NOW() - INTERVAL '15 minutes'
    `, {
      replacements: [emailHp],
      type: sequelize.QueryTypes.SELECT
    });

    const { failed_attempts, last_attempt } = lockoutInfo;

    // Lock account jika 3+ failed attempts dalam 15 menit
    if (failed_attempts >= 3) {
      const lockoutDuration = 15 * 60 * 1000; // 15 menit dalam ms
      const timeSinceLastAttempt = Date.now() - new Date(last_attempt).getTime();
      
      if (timeSinceLastAttempt < lockoutDuration) {
        const remainingTime = Math.ceil((lockoutDuration - timeSinceLastAttempt) / 60000);
        return {
          locked: true,
          remainingMinutes: remainingTime,
          message: `Akun dikunci. Silakan coba lagi dalam ${remainingTime} menit.`
        };
      }
    }

    return { locked: false };
  } catch (error) {
    console.error('Error checking account lockout:', error);
    return { locked: false }; // Allow login if check fails
  }
};

/**
 * Cleanup old login attempts (untuk maintenance)
 */
export const cleanupOldLoginAttempts = async () => {
  try {
    await sequelize.query(`
      DELETE FROM login_attempts 
      WHERE created_at < NOW() - INTERVAL '30 days'
    `);
    
    console.log('Old login attempts cleaned up successfully');
  } catch (error) {
    console.error('Error cleaning up old login attempts:', error);
  }
};
