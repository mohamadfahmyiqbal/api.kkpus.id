// 📁 controllers/core/approvals/processApproval.js (KODE FINAL & KOREKSI ALIAS & ENUM)

import db from "../../../models/index.js";
import { performFinalAction } from "../../core/approvals/performFinalAction.js";

const {
 Approval,
 ActivityLog,
 Notification,
 ApprovalStep,
 ApprovalFlow,
 MemberRoleAssignment
} = db;

const EntityModels = {
 'member_registration': db.MemberRegistration,
 'financing_application': db.FinancingApplication,
 'savings_withdrawal': db.SavingsWithdrawal,
 // Pastikan nama entitas di sini adalah lowercase
};

export const processApproval = (entityRef, currentStepId) => async (req, res) => {
 const { entityId } = req.params;
 const { action, notes } = req.body;
 const approverId = req.userId;

 if (action !== "approve" && action !== "reject") {
  return res.status(400).json({ message: 'Aksi harus "approve" atau "reject".' });
 }

 const EntityModel = EntityModels[entityRef];
 if (!EntityModel) {
  return res.status(500).json({ message: `Model entitas ${entityRef} tidak terdaftar.` });
 }

 let transaction;

 try {
  transaction = await db.sequelize.transaction();

  // 1. Ambil Data Entitas dan Flow (Menggunakan alias 'flow' yang benar)
  const entity = await EntityModel.findByPk(entityId, {
   include: [{
    model: ApprovalFlow,
    as: 'flow', // ✅ KOREKSI ALIAS
    include: [{
     model: ApprovalStep,
     as: 'steps',
     order: [['step_order', 'ASC']]
    }]
   }],
   transaction,
  });

  if (!entity || entity.current_step_id !== currentStepId) {
   await transaction.rollback();
   return res.status(404).json({ message: "Entitas tidak ditemukan atau bukan giliran Anda untuk menyetujui." });
  }

  // Identifikasi langkah
  const allSteps = entity.flow.steps;
  const currentStepIndex = allSteps.findIndex(step => step.approval_step_id === currentStepId);
  const currentStep = allSteps[currentStepIndex];
  const nextStep = allSteps[currentStepIndex + 1];
  const isLastStep = !nextStep;
  const isApproved = action === "approve";

  let responseMessage;
  let notificationMessage;
  const updateData = {};

  // 2. Buat Log Persetujuan
  await Approval.create({
   approval_step_id: currentStepId,
   approver_member_id: approverId,
   decision: action.toUpperCase(),
   note: notes,
   decision_datetime: new Date(),
   approval_flow_id: entity.approval_flow_id,
  }, { transaction });

  if (isApproved) {
   if (!isLastStep) {
    // A. APPROVED, BUKAN LANGKAH TERAKHIR (Lanjut ke langkah berikutnya)
    updateData.current_step_id = nextStep.approval_step_id;

    // 🚨 FIX ENUM: Menggunakan nilai ENUM yang benar untuk status verifikasi langkah berikutnya
    updateData.registration_status = 'verifikasi_pendaftaran';

    responseMessage = `${entityRef} disetujui oleh ${currentStep.step_name}. Dilanjutkan ke langkah berikutnya: ${nextStep.step_name}.`;
    notificationMessage = `Permintaan ${entityRef} Anda telah **disetujui** di tahap ini dan dilanjutkan ke **${nextStep.step_name}**.`;

   } else {
    // B. APPROVED, LANGKAH TERAKHIR (Finalisasi)
    responseMessage = `${entityRef} disetujui penuh. Proses finalisasi sedang berjalan.`;
    notificationMessage = `Selamat! Permintaan ${entityRef} Anda telah **disetujui penuh**. Akun/Proses Anda akan segera diaktifkan.`;

    // EKSEKUSI FINAL ACTION
    await performFinalAction({
     entity,
     transaction,
     entityRef,
     approverId
    });

    updateData.final_status = "APPROVED";
    // 🚨 FIX ENUM: Menggunakan nilai ENUM yang benar untuk status final/aktif
    updateData.registration_status = 'aktif';
   }
  } else {
   // C. REJECTED
   updateData.final_status = "REJECTED";
   // Tidak perlu mengatur registration_status di sini karena hanya ada 3 ENUM.
   // Kita biarkan registration_status tetap pada 'verifikasi_dokumen' atau 'verifikasi_pendaftaran'
   // dan mengandalkan final_status: "REJECTED" untuk hasil akhir.

   responseMessage = `${entityRef} ditolak. Proses persetujuan selesai.`;
   notificationMessage = `Maaf, Permintaan ${entityRef} Anda telah **ditolak** pada tahap persetujuan. Proses selesai.`;
  }

  // 3. Update Status Entitas
  await entity.update(updateData, { transaction });

  // 4. Log Aktivitas
  await ActivityLog.create({
   member_id: approverId,
   activity_type: `${entityRef} ${action.toUpperCase()}`,
   detail: `${entityRef} ID ${entityId} di${action} di step ${currentStep.step_name}. Catatan: ${notes || '-'}`,
   activity_datetime: new Date(),
  }, { transaction });

  // 5. Notifikasi ke pemohon
  await Notification.create({
   member_id: entity.member_id,
   title: `${entityRef} Di${action.toUpperCase()}`,
   content: notificationMessage,
   status: "SENT",
   sent_datetime: new Date(),
  }, { transaction });

  // 6. Notifikasi ke approver langkah berikutnya
  if (isApproved && !isLastStep) {
   const nextRoleId = nextStep.role_id;

   const nextApprovers = await MemberRoleAssignment.findAll({
    where: { role_id: nextRoleId },
    attributes: ['member_id'],
    transaction,
   });

   if (nextApprovers.length > 0) {
    const notificationsToCreate = nextApprovers.map(approver => ({
     member_id: approver.member_id,
     title: `Persetujuan Dibutuhkan: ${entityRef}`,
     content: `Permintaan ${entityRef} ID ${entityId} telah disetujui di tahap sebelumnya. Mohon cek untuk persetujuan **${nextStep.step_name}** Anda.`,
     status: 'SENT',
     sent_datetime: new Date(),
    }));

    await Notification.bulkCreate(notificationsToCreate, { transaction });
    console.log(`[processApproval] Notifikasi dikirim ke ${nextApprovers.length} approver untuk role ${nextStep.step_name}.`);
   } else {
    console.warn(`[processApproval] PERINGATAN KRITIS: Tidak ada anggota ditemukan dengan role ID ${nextRoleId} (${nextStep.step_name}). Flow terhenti!`);
   }
  }

  await transaction.commit();

  return res.status(200).json({ status: true, message: responseMessage });
 } catch (error) {
  if (transaction) await transaction.rollback();
  console.error(`Error saat proses persetujuan ${entityRef}:`, error);
  return res.status(500).json({ status: false, message: `Gagal memproses persetujuan: ${error.message}` });
 }
};