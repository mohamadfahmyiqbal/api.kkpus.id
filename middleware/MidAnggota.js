// 📁 midlleware/MidAnggota.js

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// 🔥 PERBAIKAN 1: Tambahkan FALLBACK SECRET yang SAMA dengan accountLogin.js
const JWT_SECRET = "naila";

/**
 * Middleware untuk memverifikasi Token JWT dan otorisasi Anggota.
 */
export const MidAnggota = (req, res, next) => {
  // 1. Ambil token dari header
  // Frontend mengirimkan token di header Authorization (tanpa prefix 'Bearer ')
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;
  // console.log("Secret Key yang digunakan:", JWT_SECRET); // Hapus log ini setelah yakin
  // console.log("Token diterima:", token);

  // 2. Cek keberadaan token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Akses Ditolak. Token otentikasi tidak ditemukan.",
    });
  }

  try {
    // 3. Verifikasi dan Dekode Token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 🔥 PERBAIKAN 2A: Ganti pemeriksaan dari 'id' ke 'member_id'
    if (!decoded.member_id) {
      return res.status(403).json({
        success: false,
        message: "Token tidak valid atau tidak lengkap. ID Anggota hilang.",
      });
    }

    // 🔥 PERBAIKAN 2B: Simpan data pengguna yang terdekode ke objek request
    // Gunakan 'member_id' dari token sebagai req.userId
    req.userId = decoded.member_id;
    // Data role tidak ada di token, jadi tidak perlu disimpan.

    // Lanjutkan ke Controller (getAnggotaProfile)
    next();
  } catch (error) {
    // Tangani token yang tidak valid atau kedaluwarsa
    console.error("Kesalahan Verifikasi Token:", error.message);

    // Status 401: Unauthorized
    return res.status(401).json({
      success: false,
      message: "Token tidak valid atau kedaluwarsa. Silakan login ulang.",
    });
  }
};
