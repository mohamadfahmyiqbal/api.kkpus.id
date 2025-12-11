// 📁 midlleware/MidRole.js (WAJIB DIBUAT)

import db from "../models/index.js";
// Asumsi model tersedia dari index.js
const { MemberRoleAssignment, UserRole } = db;

/**
 * Middleware untuk memverifikasi apakah pengguna memiliki salah satu peran yang diizinkan.
 * @param {string[]} allowedRoleNames - Array nama peran yang diizinkan (e.g., ["Pengawas", "Ketua"]).
 */
const MidRole = (allowedRoleNames = []) => {
  return async (req, res, next) => {
    const memberId = req.userId; // Diambil dari MidAnggota.js

    if (!memberId) {
      return res.status(403).json({
        success: false,
        message: "Otorisasi Ditolak. ID Anggota tidak ditemukan.",
      });
    }

    try {
      // 1. Ambil semua peran pengguna dari database
      const assignments = await MemberRoleAssignment.findAll({
        where: { member_id: memberId },
        include: [
          {
            model: UserRole,
            as: "role", // 💡 CATATAN: Pastikan ini adalah alias yang benar di index.js
            attributes: ["role_name"],
          },
        ],
        attributes: ["role_id"],
      });

      if (assignments.length === 0) {
        return res.status(403).json({
          success: false,
          message: "Akses Ditolak. Anda tidak memiliki peran aktif.",
        });
      }

      // 2. Kumpulkan nama peran yang dimiliki pengguna
      const userRoles = assignments.map((a) => a.role.role_name);

      // 3. Cek apakah ada peran pengguna yang diizinkan
      const hasRequiredRole = userRoles.some((role) =>
        allowedRoleNames.includes(role)
      );

      if (hasRequiredRole) {
        // Lanjutkan ke controller
        req.roles = userRoles; // Simpan peran untuk potensi kegunaan lain
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: `Akses Ditolak. Anda harus memiliki peran: ${allowedRoleNames.join(
            " atau "
          )}.`,
        });
      }
    } catch (error) {
      console.error("Error saat verifikasi role:", error);
      return res.status(500).json({
        success: false,
        message: "Kesalahan server saat memeriksa otorisasi.",
      });
    }
  };
};

export default MidRole;
