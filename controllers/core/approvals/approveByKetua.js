// 📁 controllers/core/approvals/approveByKetua.js (KODE FINAL)

import db from "../../../models/index.js";
// Model yang diperlukan: Pendaftaran, Anggota (untuk membuat akun baru), Notifikasi, Log
const { member_registrations, members, Notification, ActivityLog } = db;

/**
 * Controller untuk menangani persetujuan (approve/reject) pendaftaran oleh Ketua.
 * Endpoint: PUT /anggota/approval/ketua/:registrationId
 */
export const approveByKetua = async (req, res) => {
  const { registrationId } = req.params;
  const { action, notes } = req.body; // action: 'approve' atau 'reject'
  const approverId = req.userId; // ID Anggota/User yang login (dari MidAnggota)

  if (action !== "approve" && action !== "reject") {
    return res
      .status(400)
      .json({ message: 'Aksi (action) harus "approve" atau "reject".' });
  }

  let transaction;

  try {
    transaction = await db.sequelize.transaction(); // Mulai transaksi

    const registration = await member_registrations.findByPk(registrationId, {
      transaction,
    });

    if (!registration) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Data pendaftaran tidak ditemukan." });
    }

    // 2. Validasi Status (Harus sudah di-APPROVED oleh Pengawas)
    if (
      registration.supervisor_status !== "APPROVED" ||
      registration.final_status !== "PENDING"
    ) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Pendaftaran belum disetujui oleh Pengawas atau sudah diproses.",
      });
    }

    const updateData = {
      manager_status: action.toUpperCase(),
      manager_approved_at: action === "approve" ? new Date() : null,
      manager_notes: notes || `Otomatis ${action.toUpperCase()} oleh Ketua.`,
      final_status: action.toUpperCase(), // Status akhir ditentukan Ketua
      manager_approver_id: approverId, // ✅ FIX: Simpan ID Ketua yang menyetujui/menolak
    };

    let responseMessage;
    let notificationMessage;

    if (action === "approve") {
      // 3A. FINAL STEP: Disetujui Penuh

      // Data yang diperlukan untuk membuat Member baru (Ambil dari tabel registrasi)
      const newMemberData = {
        // Kolom penting yang disalin dari pendaftaran ke tabel master anggota
        member_id: registration.member_id, // Gunakan ID yang sama
        full_name: registration.full_name,
        email: registration.email,
        phone_number: registration.phone_number,
        nik_ktp: registration.nik_ktp,
        address_ktp: registration.address_ktp,
        member_type: registration.member_type,
        registered_at: new Date(),
        member_status_id: 1, // Asumsi 1 = Aktif, Sesuaikan dengan ID status_id Anda
        // Kolom lainnya (misal: password_hash, dll. harus dikelola di proses login/registrasi awal)
      };

      // 💡 Hapus data registrasi dari data member jika sudah ada di tabel members
      // members.destroy({ where: { member_id: registration.member_id }, transaction });

      // Buat record di tabel members (ini adalah akun anggota final)
      await members.create(newMemberData, { transaction });

      responseMessage =
        "Pendaftaran disetujui penuh. Akun anggota berhasil dibuat.";
      notificationMessage =
        "Selamat! Pendaftaran anggota Anda telah disetujui. Anda sekarang adalah Anggota Penuh.";
    } else {
      // 3B. Rejected: Status akhir REJECTED
      responseMessage = "Pendaftaran ditolak oleh Ketua. Proses selesai.";
      notificationMessage =
        "Maaf, pendaftaran Anda ditolak oleh Ketua. Proses selesai.";
    }

    // 4. Update Status Pendaftaran
    await registration.update(updateData, { transaction });

    // 5. Log Aktivitas
    await ActivityLog.create(
      {
        member_id: approverId,
        action: action.toUpperCase(),
        details: `Pendaftaran ID ${registrationId} di${action} oleh Ketua.`,
        model_name: "MemberRegistration",
        model_id: registrationId,
      },
      { transaction }
    );

    // 6. Notifikasi ke Anggota pendaftar
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
    console.error("Error saat approval Ketua:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan server saat memproses approval Ketua.",
      error: error.message,
    });
  }
};

export default approveByKetua;
