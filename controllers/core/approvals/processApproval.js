// PATH: controllers/core/approvals/processApproval.js

import db from "../../../models/index.js";
import { performFinalAction } from "./performFinalAction.js";
import { EntityConfigs } from "./approvalEntityConfigs.js";
import { prepareEntityUpdateData } from "./approvalMutationHelper.js";
import { notifyApprovalResult } from "./approvalNotificationHelper.js";
import { resolveStatusValue } from "./approvalStatusHelper.js";

const { Approval, ApprovalStep, ApprovalFlow, EntityStepApproval, UserRole, sequelize } = db;

const logDebug = (label, data = {}) => {
  if (process.env.NODE_ENV !== "production") console.debug(`[APPROVAL][${label}]`, data);
};

export const processApproval = (entityRef) => async (req, res) => {
  let activeEntityRef = entityRef;
  const entityId = req.params.entityId;
  const { action, notes } = req.body;
  const approverId = req.userId;

  console.log("[DEBUG] processApproval called - entityRef:", activeEntityRef, "entityId:", entityId);

  // WORKAROUND: Jika entityId=1 dan URL mengandung 'financing', paksa financing_applications
  if (entityId === "1" && req.originalUrl?.includes("financing")) {
    activeEntityRef = "financing_applications";
  }

  logDebug("PROCESS_APPROVAL", { entityRef: activeEntityRef, availableEntities: Object.keys(EntityConfigs) });

  const config = EntityConfigs[activeEntityRef];
  logDebug("REQUEST", { entityRef: activeEntityRef, entityId, action, approverId, configFound: !!config });

  if (!config) {
    return res.status(400).json({ success: false, message: "Entity tidak terdaftar" });
  }

  let transaction;

  try {
    transaction = await sequelize.transaction();
    logDebug("TX_START");

    const model = db[config.modelName];
    if (!model) throw new Error(`Model ${config.modelName} tidak ditemukan di database`);

    const entity = await model.findByPk(entityId, {
      include: [
        {
          model: ApprovalFlow,
          as: "flow",
          attributes: ["approval_flow_id", "flow_name", "entity_ref"],
          include: [
            {
              model: ApprovalStep,
              as: "steps",
              order: [["step_order", "ASC"]],
              include: [{ model: UserRole, as: "verifierRole", attributes: ["role_name"] }],
            },
          ],
        },
      ],
      transaction,
    });

    if (!entity) throw new Error("DATA_NOT_FOUND");
    if (!entity.current_step_id) throw new Error("APPROVAL_ALREADY_COMPLETED");

    const steps = entity.flow.steps;
    const currentStep = steps.find((s) => s.approval_step_id === entity.current_step_id);

    if (!currentStep) throw new Error("INVALID_CURRENT_STEP");
    if (currentStep.role_id && !req.userRoleIds.includes(String(currentStep.role_id))) {
      throw new Error("FORBIDDEN");
    }

    logDebug("CURRENT_STEP", { stepId: currentStep.approval_step_id, stepName: currentStep.step_name });

    const stepIndex = steps.findIndex((s) => s.approval_step_id === currentStep.approval_step_id);
    const nextStep = steps[stepIndex + 1];
    const isLastStep = !nextStep;

    const existingApproval = await EntityStepApproval.findOne({
      where: {
        entity_id: entityId,
        entity_ref: activeEntityRef,
        approval_step_id: currentStep.approval_step_id,
      },
      transaction,
    });

    if (existingApproval && (existingApproval.is_approved === 1 || existingApproval.is_approved === 0)) {
      throw new Error("STEP_ALREADY_PROCESSED");
    }

    await Approval.create(
      {
        approval_flow_id: entity.flow.approval_flow_id,
        approval_step_id: currentStep.approval_step_id,
        approver_member_id: approverId,
        decision: action === "approve" ? "APPROVED" : "REJECTED",
        note: notes,
        decision_datetime: new Date(),
        entity_ref: activeEntityRef,
        entity_id: entityId,
      },
      { transaction }
    );

    await EntityStepApproval.upsert(
      {
        entity_step_approval_id: existingApproval?.entity_step_approval_id,
        entity_id: entityId,
        entity_ref: activeEntityRef,
        approval_step_id: currentStep.approval_step_id,
        is_approved: action === "approve" ? 1 : 0,
        approved_at: action === "approve" ? new Date() : null,
      },
      { transaction }
    );

    logDebug("STEP_DECISION_SAVED");

    // Persiapkan update data & mutasi finansial (termasuk upload bukti transfer)
    const updateData = await prepareEntityUpdateData({
      entity,
      entityRef: activeEntityRef,
      entityId,
      reqBody: req.body,
      transaction,
    });

    const statusField = config.statusField || "status";
    let finalStatusValue = null;

    if (action === "approve") {
      if (isLastStep) {
        logDebug("FINAL_STEP_APPROVED", { entity: entity.toJSON() });
        await performFinalAction({ entity, transaction, entityRef: activeEntityRef, approverId });
        updateData.current_step_id = null;
        if (activeEntityRef !== "savings_withdrawal" && activeEntityRef !== "tabungan_withdrawals") {
          finalStatusValue = "APPROVED";
        }
      } else {
        updateData.current_step_id = nextStep.approval_step_id;
        finalStatusValue = "PENDING";
      }
    } else {
      updateData.current_step_id = null;
      finalStatusValue = "REJECTED";
    }

    if (finalStatusValue) {
      updateData[statusField] = await resolveStatusValue(finalStatusValue, statusField, transaction);
    }

    if (activeEntityRef === "members") {
      if (currentStep.step_order === 1) updateData.is_approved_pengawas = action === "approve";
      else if (currentStep.step_order === 2) updateData.is_approved_ketua = action === "approve";
    }

    logDebug("UPDATE_DATA", { ...updateData, statusField, isLastStep });

    await model.update(updateData, { where: { [config.pk]: entityId }, transaction });
    await transaction.commit();
    logDebug("TX_COMMIT");

    // Kirim Socket Event & Notifikasi (Non-blocking / post-commit)
    await notifyApprovalResult({
      entity,
      entityRef: activeEntityRef,
      entityId,
      config,
      currentStep,
      nextStep,
      action,
      notes,
      isLastStep,
      approverId,
      updateData,
      finalStatusValue,
    });

    return res.status(200).json({ success: true, message: "Approval diproses" });
  } catch (error) {
    if (transaction && !transaction.finished) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error("[processApproval] Rollback ignored:", rollbackError.message);
      }
    }
    logDebug("TX_ROLLBACK", { error: error.message });
    return res.status(error.message === "FORBIDDEN" ? 403 : 500).json({ success: false, error: error.message });
  }
};

export default processApproval;