// 📁 controllers/core/approvals/processApproval.js (FINAL DENGAN KOREKSI ENUM 'pembayaran')

import db from "../../../models/index.js";
import { performFinalAction } from "../../core/approvals/performFinalAction.js"; // Sesuaikan path

const {
  Approval,
  ActivityLog,
  Notification,
  ApprovalStep,
  ApprovalFlow,
  MemberRoleAssignment,
} = db;

const EntityModels = {
  member_registration: db.MemberRegistration,
  financing_application: db.FinancingApplication,
  savings_withdrawal: db.SavingsWithdrawal,
  // ...
};

export const processApproval =
  (entityRef, currentStepId) => async (req, res) => {
    const { entityId } = req.params;
    const { action, notes, registrationStatus } = req.body;
    const approverId = req.userId;

    if (action !== "approve" && action !== "reject") {
      return res
        .status(400)
        .json({ message: 'Aksi harus "approve" atau "reject".' });
    }

    const EntityModel = EntityModels[entityRef];
    if (!EntityModel) {
      return res
        .status(500)
        .json({ message: `Model entitas ${entityRef} tidak terdaftar.` });
    }

    let transaction;

    try {
      transaction = await db.sequelize.transaction();

      // 1. Ambil Data Entitas dan Flow
      const entity = await EntityModel.findByPk(entityId, {
        include: [
          {
            model: ApprovalFlow,
            as: "flow",
            include: [
              {
                model: ApprovalStep,
                as: "steps",
                order: [["step_order", "ASC"]],
              },
            ],
          },
        ],
        transaction,
      });

      if (!entity || entity.current_step_id !== currentStepId) {
        await transaction.rollback();
        return res.status(404).json({
          message:
            "Entitas tidak ditemukan atau bukan giliran Anda untuk menyetujui.",
        });
      }

      // Identifikasi langkah
      const allSteps = entity.flow.steps;
      const currentStepIndex = allSteps.findIndex(
        (step) => step.approval_step_id === currentStepId
      );
      const currentStep = allSteps[currentStepIndex];
      const nextStep = allSteps[currentStepIndex + 1];
      const isLastStep = !nextStep;
      const isApproved = action === "approve";

      let responseMessage;
      let notificationMessage;
      const updateData = {};
      let finalBillId = null;

      // 2. Buat Log Persetujuan
      await Approval.create(
        {
          approval_step_id: currentStepId,
          approver_member_id: approverId,
          decision: action.toUpperCase(),
          note: notes,
          decision_datetime: new Date(),
          approval_flow_id: entity.approval_flow_id,
          entity_ref: entityRef,
          entity_id: entityId,
        },
        { transaction }
      );

      if (isApproved) {
        if (!isLastStep) {
          // A. APPROVED, BUKAN LANGKAH TERAKHIR
          updateData.current_step_id = nextStep.approval_step_id;
          // 🛑 KOREKSI: Gunakan status pendek 'wawancara' (9 chars) untuk transisi.
          updateData.registration_status = registrationStatus;

          responseMessage = `${entityRef} disetujui oleh ${currentStep.step_name}. Dilanjutkan ke langkah berikutnya: ${nextStep.step_name}.`;
          notificationMessage = `Permintaan ${entityRef} Anda telah **disetujui** di tahap ini dan dilanjutkan ke **${nextStep.step_name}**.`;
        } else {
          // B. APPROVED, LANGKAH TERAKHIR (Finalisasi)

          // EKSEKUSI FINAL ACTION (Membuat tagihan dan mengatur members.status_id = 2)
          const finalActionResult = await performFinalAction({
            entity,
            transaction,
            entityRef,
            approverId,
          });

          responseMessage = finalActionResult.message;
          finalBillId = finalActionResult.billId;

          notificationMessage = `Selamat! Permintaan ${entityRef} Anda telah **disetujui penuh**. Silakan lanjutkan ke **pembayaran kewajiban awal** untuk mengaktifkan akun Anda.`;

          updateData.final_status = "APPROVED";
          // 🛑 KOREKSI KRITIS: Gunakan 'pembayaran' (10 chars) sebagai status final terpendek.
          updateData.registration_status = "menunggu_pembayaran";
        }
      } else {
        // C. REJECTED
        updateData.final_status = "REJECTED";
        responseMessage = `${entityRef} ditolak. Proses persetujuan selesai.`;
        notificationMessage = `Maaf, Permintaan ${entityRef} Anda telah **ditolak** pada tahap persetujuan. Proses selesai.`;
      }
      console.log(updateData);

      // 3. Update Status Entitas
      await entity.update(updateData, { transaction });

      // 4. Log Aktivitas & Notifikasi
      await ActivityLog.create(
        {
          member_id: approverId,
          activity_type: `${entityRef} ${action.toUpperCase()}`,
          detail: `${entityRef} ID ${entityId} di${action} di step ${
            currentStep.step_name
          }. Catatan: ${notes || "-"}`,
          activity_datetime: new Date(),
        },
        { transaction }
      );

      await Notification.create(
        {
          member_id: entity.member_id,
          title: `${entityRef} Di${action.toUpperCase()}`,
          content: notificationMessage,
          status: "SENT",
          sent_datetime: new Date(),
        },
        { transaction }
      );

      await transaction.commit();

      return res.status(200).json({
        status: true,
        message: responseMessage,
        billId: finalBillId,
      });
    } catch (error) {
      if (transaction) await transaction.rollback();
      console.error(`Error saat proses persetujuan ${entityRef}:`, error);
      return res.status(500).json({
        status: false,
        message: `Gagal memproses persetujuan: ${
          error.parent ? error.parent.sqlMessage : error.message
        }`,
      });
    }
  };
