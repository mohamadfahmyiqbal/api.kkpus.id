import db from "../../../models/index.js";
import { performFinalAction } from "./performFinalAction.js";

const { Approval, ActivityLog, Notification, ApprovalStep, ApprovalFlow } = db;

const EntityModels = {
  member_registration: db.MemberRegistration,
  financing_application: db.FinancingApplication,
  savings_withdrawal: db.SavingsWithdrawal,
};

export const processApproval = (entityRef, currentStepId) => async (req, res) => {
  const { entityId } = req.params;
  const { action, notes, registrationStatus } = req.body;
  const approverId = req.userId;

  const EntityModel = EntityModels[entityRef];
  let transaction;

  try {
    transaction = await db.sequelize.transaction();

    const entity = await EntityModel.findByPk(entityId, {
      include: [{
        model: ApprovalFlow,
        as: "flow",
        include: [{ model: ApprovalStep, as: "steps", order: [["step_order", "ASC"]] }],
      }],
      transaction,
    });

    if (!entity || entity.current_step_id !== currentStepId) {
      await transaction.rollback();
      return res.status(404).json({ message: "Data tidak ditemukan atau bukan giliran Anda." });
    }

    const allSteps = entity.flow.steps;
    const currentStepIndex = allSteps.findIndex(s => s.approval_step_id === currentStepId);
    const currentStep = allSteps[currentStepIndex];
    const nextStep = allSteps[currentStepIndex + 1];
    const isLastStep = !nextStep;

    const updateData = {};
    let responseMessage;

    // 1. Catat Log Persetujuan
    await Approval.create({
      approval_step_id: currentStepId,
      approver_member_id: approverId,
      decision: action.toUpperCase(),
      note: notes,
      decision_datetime: new Date(),
      approval_flow_id: entity.approval_flow_id,
      entity_ref: entityRef,
      entity_id: entityId,
    }, { transaction });

    if (action === "approve") {
      if (!isLastStep) {
        // LANJUT KE PENGAPROVE BERIKUTNYA
        updateData.current_step_id = nextStep.approval_step_id;
        if (entityRef === "member_registration") updateData.registration_status = registrationStatus;
        responseMessage = `Disetujui oleh ${currentStep.step_name}. Menunggu ${nextStep.step_name}.`;
      } else {
        // FINAL APPROVAL (KETUA)
        if (entityRef === "member_registration") {
          await performFinalAction({ entity, transaction, entityRef, approverId });
          updateData.registration_status = "menunggu_pembayaran";
          responseMessage = "Pendaftaran disetujui penuh.";
        } else {
          // KHUSUS PENARIKAN: Jangan potong saldo dulu, set status ke APPROVED (Siap Bayar)
          updateData.status = "APPROVED"; 
          responseMessage = "Persetujuan Ketua selesai. Menunggu pembayaran oleh Bendahara.";
        }
      }
    } else {
      // REJECTED
      updateData.status = "REJECTED";
      if (entityRef === "member_registration") updateData.registration_status = "ditolak";
      responseMessage = "Permintaan ditolak.";
    }

    await entity.update(updateData, { transaction });
    await transaction.commit();
    return res.status(200).json({ status: true, message: responseMessage });

  } catch (error) {
    if (transaction) await transaction.rollback();
    return res.status(500).json({ status: false, message: error.message });
  }
};