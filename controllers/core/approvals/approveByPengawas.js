// 📁 controllers/core/approvals/approveByPengawas.js (KODE FINAL)

import db from "../../../models/index.js";
// Tambahkan model yang diperlukan untuk notifikasi dan logging
const { member_registrations, Notification, ActivityLog } = db;

/**
 * Controller untuk menangani persetujuan (approve/reject) pendaftaran oleh Pengawas.
 * Endpoint: PUT /anggota/approval/pengawas/:registrationId
 */
export const approveByPengawas = async (req, res) => {
  // 1. Ambil data
  const { registrationId } = req.params;
  const { action, notes } = req.body; // action: 'approve' atau 'reject'
  const approverId = req.userId; // ID Anggota/User yang login (dari MidAnggota)
  // Asumsi: Kita tahu role ID Pengawas secara global, tapi kita tidak membutuhkannya di sini karena MidRole sudah menjamin otorisasi.
  const approverRoleId = req.roleId; // Asumsi: Role ID disuntikkan oleh MidRole jika Anda menggunakannya.

  if (action !== "approve" && action !== "reject") {
    return res
      .status(400)
      .json({ message: 'Aksi (action) harus "approve" atau "reject".' });
  }

  let transaction;

  try {
    transaction = await db.sequelize.transaction();

    const registration = await member_registrations.findByPk(registrationId, {
      transaction,
    });

    if (!registration) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Data pendaftaran tidak ditemukan." });
    }

    // 2. Validasi Status (Hanya proses yang masih menunggu verifikasi Pengawas)
    if (
      registration.final_status !== "PENDING" ||
      registration.supervisor_status !== "PENDING"
    ) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Pendaftaran sudah diproses (Status Final: ${registration.final_status}).`,
      });
    }

    const updateData = {
      supervisor_status: action.toUpperCase(),
      supervisor_approved_at: action === "approve" ? new Date() : null,
      supervisor_notes:
        notes || `Otomatis ${action.toUpperCase()} oleh Pengawas.`,
      supervisor_approver_id: approverId, // ✅ FIX: Simpan ID Pengawas yang menyetujui/menolak
    };

    let responseMessage;
    let notificationMessage;

    if (action === "approve") {
      // 3A. Approved: Pindah ke tahap Ketua (manager_status tetap PENDING)
      responseMessage =
        "Pendaftaran disetujui oleh Pengawas. Menunggu persetujuan Ketua.";
      notificationMessage =
        "Verifikasi dokumen berhasil. Pendaftaran dilanjutkan ke tahap Persetujuan Ketua.";
    } else {
      // 3B. Rejected: Status final langsung REJECTED, proses selesai
      updateData.final_status = "REJECTED";
      responseMessage = "Pendaftaran ditolak oleh Pengawas. Proses selesai.";
      notificationMessage =
        "Maaf, pendaftaran Anda ditolak pada tahap Verifikasi Pengawas.";
    }

    // 4. Update Database
    await registration.update(updateData, { transaction });

    // 5. Log Aktivitas (Opsional)
    await ActivityLog.create(
      {
        member_id: approverId,
        action: action.toUpperCase(),
        details: `Pendaftaran ID ${registrationId} di${action} oleh Pengawas.`,
        model_name: "MemberRegistration",
        model_id: registrationId,
      },
      { transaction }
    );

    // 6. Notifikasi ke Anggota (dan Ketua jika approved)
    // Notifikasi ke Anggota pendaftar
    await Notification.create(
      {
        member_id: registration.member_id, // ID Anggota yang mendaftar
        title: `Pendaftaran Anggota Di${action.toUpperCase()}`,
        message: notificationMessage,
        status: "SENT",
      },
      { transaction }
    );

    // 7. Commit Transaksi
    await transaction.commit();

    return res.status(200).json({ status: true, message: responseMessage });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error saat approval Pengawas:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan server saat memproses approval Pengawas.",
      error: error.message,
    });
  }
};

export default approveByPengawas;
