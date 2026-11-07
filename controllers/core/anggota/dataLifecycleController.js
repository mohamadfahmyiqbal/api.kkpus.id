// 📁 controllers/core/anggota/dataLifecycleController.js
import bcrypt from "bcrypt";
import db from "../../../models/index.js";
import { anonymizeDataForInactiveMembers } from "../../../services/dataLifecycleCleaner.js";

export const runDataLifecycleClean = async (req, res) => {
  const adminId = req.userId;

  // Autentikasi admin: minta password
  const { password } = req.body || {};
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password administrator wajib diisi untuk menjalankan pekerjaan data lifecycle."
    });
  }

  try {
    const admin = await db.Member.findByPk(adminId);
    if (!admin || !admin.password_hash) {
      return res.status(401).json({
        success: false,
        message: "Akun administrator tidak valid atau tidak ditemukan."
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password administrator salah. Pekerjaan data lifecycle dibatalkan."
      });
    }

    // Jalankan pekerjaan data lifecycle
    // JANGAN gunakan dry run untuk live mode (production) - ini dimaksudkan untuk dijalankan oleh admin
    try {
      const processedCount = await anonymizeDataForInactiveMembers(false); // false = live mode

      return res.status(200).json({
        success: true,
        message: `Pekerjaan data lifecycle selesai. ${processedCount} anggota diproses dan data mereka dihapus/anonimisasi.`,
        data: {
          processed_count: processedCount
        }
      });
    } catch (jobError) {
      console.error("💥 dataLifecycleClean job error:", jobError);
      return res.status(500).json({
        success: false,
        message: "Pekerjaan data lifecycle gagal: " + jobError.message
      });
    }

  } catch (error) {
    console.error("🚨 dataLifecycleClean API error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat menjalankan pekerjaan data lifecycle: " + error.message
    });
  }
};
