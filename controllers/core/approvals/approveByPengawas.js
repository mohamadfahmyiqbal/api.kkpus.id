// controllers/core/approvals/approveByPengawas.js (FINAL ES MODULE)

import db from "../../../models/index.js";
const { member_registrations } = db;

/**
 * Controller untuk menangani persetujuan (approve/reject) pendaftaran oleh Pengawas.
 * Endpoint: PUT /anggota/approval/pengawas/:registrationId
 */
export const approveByPengawas = async (req, res) => {
  // ✅ Nama Fungsi Diubah
  // ID Pendaftaran diambil dari URL parameter
  const { registrationId } = req.params;
  // Aksi ('approve' atau 'reject') dan catatan diambil dari body
  const { action, notes } = req.body;

  // Pastikan aksi valid
  if (action !== "approve" && action !== "reject") {
    return res
      .status(400)
      .json({ message: 'Aksi (action) harus "approve" atau "reject".' });
  }

  try {
    const registration = await member_registrations.findByPk(registrationId);

    if (!registration) {
      return res
        .status(404)
        .json({ message: "Data pendaftaran tidak ditemukan." });
    }

    // Pendaftaran harus dalam status FINAL PENDING dan Supervisor/Pengawas belum memproses
    if (
      registration.final_status !== "PENDING" ||
      registration.supervisor_status !== "PENDING"
    ) {
      return res
        .status(400)
        .json({
          message: `Pendaftaran sudah diproses dengan status: ${registration.final_status}`,
        });
    }

    const updateData = {
      supervisor_status: action.toUpperCase(),
      supervisor_approved_at: action === "approve" ? new Date() : null,
      supervisor_notes:
        notes ||
        `Otomatis ${
          action === "approve" ? "Disetujui" : "Ditolak"
        } oleh Pengawas.`,
    };

    let responseMessage;

    if (action === "approve") {
      // Jika disetujui Pengawas, status akhir masih PENDING, menunggu Ketua
      responseMessage =
        "Pendaftaran disetujui oleh Pengawas. Menunggu persetujuan Ketua.";
    } else {
      // Jika ditolak Pengawas, proses selesai dan final status = REJECTED
      updateData.final_status = "REJECTED";
      responseMessage = "Pendaftaran ditolak oleh Pengawas. Proses selesai.";
    }

    await registration.update(updateData);

    return res.status(200).json({ status: true, message: responseMessage });
  } catch (error) {
    console.error("Error saat approval Pengawas:", error);
    return res
      .status(500)
      .json({
        message: "Terjadi kesalahan server saat memproses approval Pengawas.",
      });
  }
};

export default approveByPengawas; // ✅ Nama Export Diubah
