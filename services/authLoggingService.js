// 📁 services/authLoggingService.js (BRUTE FORCE MITIGATION)

import db from "../models/index.js";
import { Op } from "sequelize";

const MAX_LOGIN_ATTEMPTS = 5; // Ambang batas untuk mengunci akun
const LOCKOUT_DURATION = 15; // menit

export const logLoginAttempt = async (req, success, memberId, reason) => {
  try {
    // Simpan attempt ke tabel login_attempts
    const attemptData = {
      email_or_phone: req.body?.emailHp || null,
      ip_address: req.ip || req.connection?.remoteAddress || null,
      user_agent: req.headers["user-agent"] || null,
      success: success,
      member_id: memberId,
      failure_reason: reason,
    };
    
    await db.LoginAttempt.create(attemptData);

    // Perbarui lockouts jika login gagal
    if (!success && attemptData.email_or_phone) {
      await updateAccountLockout(attemptData.email_or_phone, reason);
    }

    return attemptData;
  } catch (error) {
    console.error("Error logging login attempt:", error);
  }
};

const updateAccountLockout = async (emailOrPhone, reason) => {
  try {
    // Cari atau buat record lockout untuk email/or phone
    let lockoutRecord = await db.AccountLockout.findOne({
      where: { email_or_phone },
    });

    const now = new Date();
    const lockoutEnd = new Date(now.getTime() + LOCKOUT_DURATION * 60 * 1000);

    if (!lockoutRecord) {
      // Buat record lockout baru
      lockoutRecord = await db.AccountLockout.create({
        email_or_phone,
        lockout_reason: reason,
        lockout_start: now,
        lockout_end: lockoutEnd,
        failed_attempts: 1,
        is_active: true,
      });
    } else {
      // Perbarui record yang ada
      if (!lockoutRecord.is_active || lockoutRecord.lockout_end < now) {
        // Lockout sudah selesai, reset
        await lockoutRecord.update({
          failed_attempts: 1,
          lockout_start: now,
          lockout_end: lockoutEnd,
          is_active: true,
          lockout_reason: reason,
        });
      } else {
        // Lockout masih aktif, tambahkan failed attempts
        await lockoutRecord.update({
          failed_attempts: (lockoutRecord.failed_attempts || 0) + 1,
          lockout_reason: reason,
        });
      }
    }

    // Jika melebihi ambang batas, buat record terminasi
    if (lockoutRecord.failed_attempts >= MAX_LOGIN_ATTEMPTS) {
      await createAccountLockoutTermination(lockoutRecord);
    }

    return lockoutRecord;
  } catch (error) {
    console.error("Error updating account lockout:", error);
  }
};

const createAccountLockoutTermination = async (lockoutRecord) => {
  try {
    // Cek apakah sudah ada terminasi untuk email ini
    const existingTermination = await db.MembershipTermination.findOne({
      where: {
        member_id: lockoutRecord.member_id,
        final_status: "ACCOUNT_LOCKED",
      },
    });

    if (existingTermination) {
      // Sudah ada terminasi, update
      await existingTermination.update({
        start_date: lockoutRecord.lockout_start,
        end_date: lockoutRecord.lockout_end,
        reason: `Brute force protection: ${lockoutRecord.lockout_reason}`, 
      });
    } else {
      // Buat terminasi baru
      await db.MembershipTermination.create({
        member_id: lockoutRecord.member_id,
        status_id: "LOCKED", // atau ambil dari member_status
        final_status: "ACCOUNT_LOCKED",
        start_date: lockoutRecord.lockout_start,
        end_date: lockoutRecord.lockout_end,
        reason: `Brute force protection: ${lockoutRecord.lockout_reason}`, 
        created_by: "system",
      });
    }

    // Nonaktifkan lockout record
    await lockoutRecord.update({
      is_active: false,
      lockout_end: new Date(), // Segera nonaktifkan
    });
  } catch (error) {
    console.error("Error creating account lockout termination:", error);
  }
};

export const checkAccountLockout = async (emailOrPhone) => {
  try {
    if (!emailOrPhone) return { locked: false, message: "No email provided" };

    // Cari member berdasarkan email or phone
    const member = await db.Member.findOne({
      where: {
        [Op.or]: [
          { email: emailOrPhone },
          { phone_number: emailOrPhone },
          { member_no: emailOrPhone },
        ],
      },
    });

    if (!member) {
      // Jika email tidak ditemukan, tetap catat attempt untuk mencegah email enumeration
      // tapi tetap lanjut (login akan gagal)
      return { locked: false, message: "Email tidak ditemukan" };
    }

    // Cek lockout record
    const lockout = await db.AccountLockout.findOne({
      where: {
        email_or_phone: emailOrPhone,
        is_active: true,
        lockout_end: { [Op.gt]: new Date() },
      },
    });

    if (lockout) {
      const remainingMinutes = Math.ceil(
        (new Date(lockout.lockout_end.getTime() - Date.now()) / (1000 * 60))
      );
      return {
        locked: true,
        message: `Akun terkunci. Coba lagi dalam ${remainingMinutes} menit.", lockout_reason: lockout.lockout_reason,
        lockout_end: lockout.lockout_end,
        failed_attempts: lockout.failed_attempts,
      };
    }

    // Cek login attempts yang gagal dalam 24 jam terakhir
    const failedAttempts = await db.LoginAttempt.count({
      where: {
        email_or_phone: emailOrPhone,
        success: false,
        created_at: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });

    if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
      // Buat atau perbarui lockout
      await updateAccountLockout(emailOrPhone, "Exceeded login attempts");
      return {
        locked: true,
        message: "Terlalu banyak percobaan login gagal. Akun terkunci selama 15 menit.",
      };
    }

    return { locked: false, message: "Login successful" };
  } catch (error) {
    console.error("Error checking account lockout:", error);
    return { locked: false, message: "Internal error" };
  }
};
