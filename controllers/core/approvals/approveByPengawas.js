// 📁 controllers/core/approvals/approveByPengawas.js (KODE FINAL DENGAN TABEL APPROVALS)

import db from "../../../models/index.js";
// Model yang diperlukan
const {
 MemberRegistration,
 Notification,
 ActivityLog,
 Approval // <-- Gunakan tabel approvals untuk logging keputusan
} = db;

// Asumsi ID Langkah Pengawas adalah 1 (Perlu dicek di tabel approval_steps Anda)
const APPROVAL_STEP_PENGWAS_ID = 1;

/**
 * Controller untuk menangani persetujuan (approve/reject) pendaftaran oleh Pengawas (Step 1).
 * Endpoint: PUT /anggota/approval/pengawas/:registrationId
 */
export const approveByPengawas = async (req, res) => {
 // 1. Ambil data
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
  transaction = await db.sequelize.transaction();

  // 2. Ambil Data Pendaftaran
  const registration = await MemberRegistration.findByPk(registrationId, {
   transaction,
  });

  if (!registration) {
   await transaction.rollback();
   return res
    .status(404)
    .json({ message: "Data pendaftaran tidak ditemukan." });
  }

  // --- LOGIKA ALUR KERJA (MENGGUNAKAN current_step_id) ---
  // Asumsi: Proses Pengawas adalah current_step_id yang pertama (misalnya 1)
  if (
   registration.final_status !== "PENDING" ||
   registration.current_step_id !== APPROVAL_STEP_PENGWAS_ID
  ) {
   await transaction.rollback();
   return res.status(400).json({
    message: `Pendaftaran tidak berada di tahap Pengawas (Step ID: ${APPROVAL_STEP_PENGWAS_ID}).`,
   });
  }

  // 3. LOG KEPUTUSAN KE TABEL APPROVALS
  // Decision: APPROVED atau REJECTED
  await Approval.create({
   approval_step_id: APPROVAL_STEP_PENGWAS_ID,
   approver_member_id: approverId,
   decision: action.toUpperCase(),
   decision_datetime: new Date(),
   note: notes || `Keputusan oleh Pengawas (Step ${APPROVAL_STEP_PENGWAS_ID}).`,
   // Kolom 'createdAt' dan 'updatedAt' akan otomatis diisi oleh Sequelize
  }, { transaction });

  // 4. Tentukan Data Update untuk MemberRegistration
  let updateData = {};
  let responseMessage;
  let notificationMessage;
  const isApproved = action === "approve";

  if (isApproved) {
   // Approved: Lanjut ke step berikutnya (asumsi Step Ketua adalah Step ID 2)
   updateData.current_step_id = APPROVAL_STEP_PENGWAS_ID + 1; // Pindah ke step berikutnya (Ketua)
   // final_status tetap PENDING

   responseMessage =
    "Pendaftaran disetujui oleh Pengawas. Berlanjut ke persetujuan Ketua.";
   notificationMessage =
    "Verifikasi dokumen berhasil. Pendaftaran dilanjutkan ke tahap Persetujuan Ketua.";
  } else {
   // Rejected: Proses selesai
   updateData.final_status = "REJECTED";
   updateData.current_step_id = APPROVAL_STEP_PENGWAS_ID; // Tetap di step ini, tapi final_status REJECTED

   responseMessage = "Pendaftaran ditolak oleh Pengawas. Proses selesai.";
   notificationMessage =
    "Maaf, pendaftaran Anda ditolak pada tahap Verifikasi Pengawas.";
  }

  // 5. Update Database MemberRegistration
  await registration.update(updateData, { transaction });

  // 6. Log Aktivitas ke activity_logs
  await ActivityLog.create(
   {
    member_id: approverId,
    activity_type: `Pendaftaran Anggota ${action.toUpperCase()}`,
    detail: `Pendaftaran ID ${registrationId} di${action} oleh Pengawas. ${notes ? 'Catatan: ' + notes : ''}`,
    activity_datetime: new Date(),
   },
   { transaction }
  );

  // 7. Notifikasi ke Anggota pendaftar
  await Notification.create(
   {
    member_id: registration.member_id,
    title: `Pendaftaran Anggota Di${action.toUpperCase()}`,
    content: notificationMessage,
    status: "SENT",
    sent_datetime: new Date(), // ✅ FIX KRITIS: Menambahkan sent_datetime
   },
   { transaction }
  );

  // 8. Commit Transaksi
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