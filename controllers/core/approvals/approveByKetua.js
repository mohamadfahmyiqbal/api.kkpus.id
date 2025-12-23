// 📁 controllers/core/approvals/approveByKetua.js (KODE FINAL & FIXED)

import db from "../../../models/index.js";
// Tambahkan model Approval
const { 
  MemberRegistration, 
  Member, 
  Notification, 
  ActivityLog, 
  Approval, // <-- FIX: Model Approval
  // Kita asumsikan MemberRegistration sudah diperbarui oleh Pengawas
  // sehingga current_step_id sudah menunjuk ke step Ketua.
} = db;

// Asumsi ID Langkah Ketua adalah 2 (Perlu dicek di tabel approval_steps Anda)
// Ini adalah step yang dilanjutkan dari Pengawas (Step ID 1 + 1)
const APPROVAL_STEP_KETUA_ID = 2; 

/**
 * Controller untuk menangani persetujuan (approve/reject) pendaftaran oleh Ketua.
 * Endpoint: PUT /anggota/approval/ketua/:registrationId
 */
export const approveByKetua = async (req, res) => {
  const { registrationId } = req.params;
  const { action, notes } = req.body; 
  const approverId = req.userId; 

  if (action !== "approve" && action !== "reject") {
    return res
      .status(400)
      .json({ message: 'Aksi (action) harus "approve" atau "reject".' });
  }

  let transaction;

  try {
    transaction = await db.sequelize.transaction(); // Mulai transaksi

    const registration = await MemberRegistration.findByPk(registrationId, {
      transaction,
    });

    if (!registration) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Data pendaftaran tidak ditemukan." });
    }

    // 2. Validasi Status (Harus PENDING di FINAL STATUS dan berada di STEP KETUA)
    if (
      registration.final_status !== "PENDING" ||
      registration.current_step_id !== APPROVAL_STEP_KETUA_ID 
    ) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          `Pendaftaran tidak berada di tahap Ketua (Step ID: ${APPROVAL_STEP_KETUA_ID}) atau sudah diselesaikan.`,
      });
    }
    
    // 3. LOG KEPUTUSAN KE TABEL APPROVALS (Sama dengan approveByPengawas)
    await Approval.create({
      approval_step_id: APPROVAL_STEP_KETUA_ID,
      approver_member_id: approverId,
      decision: action.toUpperCase(),
      decision_datetime: new Date(),
      note: notes || `Keputusan oleh Ketua (Step ${APPROVAL_STEP_KETUA_ID}).`,
    }, { transaction });


    let updateData = {};
    let responseMessage;
    let notificationMessage;
    const isApproved = action === "approve";

    if (isApproved) {
      // 4A. FINAL STEP: Disetujui Penuh -> FINAL_STATUS = APPROVED
      updateData.final_status = "APPROVED"; 
      
      // Update data anggota master (members)
      const finalMemberData = {
        full_name: registration.full_name,
        email: registration.email,
        phone_number: registration.phone_number,
        nik_ktp: registration.nik_ktp,
        address: registration.address_ktp, 
        join_date: new Date(), 
        status_id: 1, // Asumsi 1 = Aktif
      };

      await Member.update(finalMemberData, { 
        where: { member_id: registration.member_id }, 
        transaction 
      });

      responseMessage =
        "Pendaftaran disetujui penuh. Akun anggota berhasil diaktifkan.";
      notificationMessage =
        "Selamat! Pendaftaran anggota Anda telah disetujui. Anda sekarang adalah Anggota Penuh.";
    } else {
      // 4B. Rejected: Status akhir REJECTED
      updateData.final_status = "REJECTED";
      responseMessage = "Pendaftaran ditolak oleh Ketua. Proses selesai.";
      notificationMessage =
        "Maaf, pendaftaran Anda ditolak oleh Ketua. Proses selesai.";
    }

    // 5. Update Status Pendaftaran
    await registration.update(updateData, { transaction });

    // 6. Log Aktivitas (FIXED: Menggunakan activity_type dan detail)
    await ActivityLog.create(
      {
        member_id: approverId,
        activity_type: `Pendaftaran Anggota ${action.toUpperCase()}`, // FIX Field
        detail: `Pendaftaran ID ${registrationId} di${action} oleh Ketua.`, // FIX Field
        activity_datetime: new Date(), // FIX Field
      },
      { transaction }
    );

    // 7. Notifikasi ke Anggota pendaftar (FIXED: Menggunakan content dan sent_datetime)
    await Notification.create(
      {
        member_id: registration.member_id, 
        title: `Pendaftaran Anggota Di${action.toUpperCase()}`,
        content: notificationMessage, // FIX Field
        status: "SENT",
        sent_datetime: new Date(), // FIX Field
      },
      { transaction }
    );

    // 8. Commit Transaksi
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