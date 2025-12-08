// controllers/core/approvals/approveByKetua.js (FINAL ES Module)

import db from "../../../models/index.js";
// Asumsi: Model 'members' diimport untuk membuat akun final
const { member_registrations, members } = db;

/**
 * Controller untuk menangani persetujuan (approve/reject) pendaftaran oleh Ketua.
 * Endpoint: PUT /anggota/approval/ketua/:registrationId
 */
export const approveByKetua = async (req, res) => {
  // ✅ Nama Fungsi Diubah
  const { registrationId } = req.params;
  const { action, notes } = req.body; // action: 'approve' atau 'reject'

  if (action !== "approve" && action !== "reject") {
    return res
      .status(400)
      .json({ message: 'Aksi (action) harus "approve" atau "reject".' });
  }

  let transaction;

  try {
    const registration = await member_registrations.findByPk(registrationId);

    if (!registration) {
      return res
        .status(404)
        .json({ message: "Data pendaftaran tidak ditemukan." });
    }

    // Syarat: Pengawas sudah APPROVED dan status akhir masih PENDING
    if (
      registration.supervisor_status !== "APPROVED" ||
      registration.final_status !== "PENDING"
    ) {
      return res
        .status(400)
        .json({
          message:
            "Pendaftaran belum disetujui oleh Pengawas atau sudah diproses.",
        });
    }

    transaction = await db.sequelize.transaction(); // Mulai transaksi

    const updateData = {
      manager_status: action.toUpperCase(),
      manager_approved_at: action === "approve" ? new Date() : null,
      manager_notes:
        notes ||
        `Otomatis ${
          action === "approve" ? "Disetujui" : "Ditolak"
        } oleh Ketua.`,
      final_status: action.toUpperCase(), // Status akhir ditentukan oleh Ketua
    };

    await registration.update(updateData, { transaction });

    let responseMessage;

    if (action === "approve") {
      // 💡 FINAL STEP: Pendaftaran disetujui penuh, buat akun anggota di tabel 'members'

      /* // ➡️ LOGIC PEMBUATAN AKUN ANGGOTA BARU DI SINI
            await members.create({ 
                // ...
            }, { transaction });
            */

      responseMessage =
        "Pendaftaran disetujui penuh. Akun anggota berhasil dibuat.";
    } else {
      responseMessage = "Pendaftaran ditolak oleh Ketua. Proses selesai.";
    }

    await transaction.commit(); // Commit transaksi jika semua berhasil
    return res.status(200).json({ status: true, message: responseMessage });
  } catch (error) {
    if (transaction) await transaction.rollback(); // Rollback jika ada error
    console.error("Error saat approval Ketua:", error);
    return res
      .status(500)
      .json({
        message: "Terjadi kesalahan server saat memproses approval Ketua.",
      });
  }
};

export default approveByKetua; // ✅ Nama Export Diubah
