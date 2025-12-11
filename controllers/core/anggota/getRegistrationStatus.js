// controllers/core/anggota/getRegistrationStatus.js (WAJIB DIKOREKSI)

import db from "../../../models/index.js";

// Pastikan model-model ini diimpor dari db
const { MemberRegistration, ApprovalStep } = db;

/**
 * Kontroler untuk mendapatkan status dan data pendaftaran anggota.
 * Endpoint: GET /anggota/registration/status (Membutuhkan MidAnggota)
 */
export const getRegistrationStatus = async (req, res) => {
  // Asumsi member_id sudah disuntikkan oleh MidAnggota.js
  const member_id = req.userId;

  if (!member_id) {
    return res.status(400).json({
      success: false,
      message: "member_id tidak ditemukan. Middleware gagal.",
    });
  }

  try {
    // 1. Cari data pendaftaran yang paling baru untuk member ini
    const registrationData = await MemberRegistration.findOne({
      where: { member_id },
      // Ambil data langkah persetujuan saat ini (currentStep)
      include: [
        {
          model: ApprovalStep,
          // ✅ FIX: GUNAKAN ALIAS YANG BENAR
          as: "currentStep", // HARUS SAMA PERSIS DENGAN DEFINISI DI models/index.js
          attributes: ["step_name", "step_order"],
        },
      ],
      order: [["createdAt", "DESC"]], // Ambil yang terbaru
    });

    if (registrationData) {
      // Data pendaftaran ditemukan
      return res.status(200).json({
        status: true,
        message: "Data pendaftaran ditemukan.",
        is_registration_done: true,
        data: registrationData, // Mengirim objek data termasuk currentStep
      });
    } else {
      // Belum ada data pendaftaran
      return res.status(200).json({
        status: true,
        message: "Member belum mengajukan pendaftaran.",
        is_registration_done: false,
        data: null,
      });
    }
  } catch (error) {
    console.error("Error fetching registration status:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal memuat status pendaftaran. Silakan cek log server.",
      error: error.message,
    });
  }
};
export default getRegistrationStatus;
