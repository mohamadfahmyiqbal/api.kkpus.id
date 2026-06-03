// PATH: controllers/core/approvals/processApproval.js

import db from "../../../models/index.js";
import { performFinalAction } from "./performFinalAction.js";
import { sendGlobalNotification } from "../../../controllers/utility/notificationHelper.js";
import { sendToUser } from "../../../controllers/utility/socket.js";

const { Approval, ApprovalStep, ApprovalFlow, EntityStepApproval, ApprovalStatus, UserRole, sequelize } = db;

const EntityConfigs = {
  members: { 
    model: db.MemberRegistration, 
    pk: "registration_id", 
    memberField: "member_id", 
    statusField: "final_status" 
  },
  financing_applications: { 
    model: db.FinancingApplication, 
    pk: "financing_id", 
    memberField: "member_id", 
    statusField: "status" 
  },
  savings_withdrawal: { 
    model: db.SavingsWithdrawal, 
    pk: "withdrawal_id", 
    memberField: "member_id", 
    statusField: "status" 
  },
  exit_requests: { 
    model: db.MembershipTermination, 
    pk: "termination_id", 
    memberField: "member_id", 
    statusField: "status" 
  },
  transactions: { 
    model: db.Transaction, 
    pk: "transaction_id", 
    memberField: "member_id", 
    statusField: "status" 
  },
  investments: { 
    model: db.SukukOrder, 
    pk: "order_id", 
    memberField: "member_id", 
    statusField: "status" 
  },
  member_saving_targets: { 
    model: db.MemberSavingTarget, 
    pk: "member_saving_target_id", 
    memberField: "member_id", 
    statusField: "status" 
  },
};

const logDebug = (label, data = {}) => {
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[APPROVAL][${label}]`, data);
  }
};

export const processApproval = (entityRef) => async (req, res) => {
  const entityId = req.params.entityId; 
  const { action, notes } = req.body;
  const approverId = req.userId;
  
  console.log("[DEBUG] processApproval called - entityRef:", entityRef, "entityId:", entityId);
  
  // WORKAROUND: Jika entityId=1 dan URL mengandung 'financing', paksa financing_applications
  if (entityId === '1' && req.originalUrl?.includes('financing')) {
    console.log("[DEBUG] URL contains 'financing', forcing entityRef to financing_applications");
    entityRef = "financing_applications";
  }
  
  logDebug("PROCESS_APPROVAL", { entityRef, availableEntities: Object.keys(EntityConfigs) });
  
  const config = EntityConfigs[entityRef];

  logDebug("REQUEST", { entityRef, entityId, action, approverId, configFound: !!config });

  if (!config) {
    return res.status(400).json({ success: false, message: "Entity tidak terdaftar" });
  }

  let transaction;

  try {
    transaction = await sequelize.transaction();
    logDebug("TX_START");

    const entity = await config.model.findByPk(entityId, {
      include: [{
        model: ApprovalFlow,
        as: "flow",
        attributes: ["approval_flow_id", "flow_name", "entity_ref"],
        include: [{
          model: ApprovalStep,
          as: "steps",
          order: [["step_order", "ASC"]],
          include: [{
            model: UserRole,
            as: "verifierRole",
            attributes: ["role_name"]
          }]
        }],
      }],
      transaction,
    });

    if (!entity) throw new Error("DATA_NOT_FOUND");
    
    logDebug("ENTITY_RAW", { 
      entityId: entityId,
      entityFound: !!entity,
      entityKeys: entity ? Object.keys(entity.toJSON()) : null,
      pkField: config.pk
    });
    
    logDebug("ENTITY_DATA", { 
      financing_id: entity.financing_id, 
      current_step_id: entity.current_step_id,
      status: entity.status,
      approval_flow_id: entity.approval_flow_id,
      allData: entity.toJSON()
    });
    
    if (!entity.current_step_id) {
      logDebug("ERROR", { reason: "current_step_id is null or undefined" });
      throw new Error("APPROVAL_ALREADY_COMPLETED");
    }

    const steps = entity.flow.steps;
    const currentStep = steps.find(s => s.approval_step_id === entity.current_step_id);

    if (!currentStep) throw new Error("INVALID_CURRENT_STEP");

    if (currentStep.role_id && !req.userRoleIds.includes(Number(currentStep.role_id))) {
      throw new Error("FORBIDDEN");
    }

    logDebug("CURRENT_STEP", { stepId: currentStep.approval_step_id, stepName: currentStep.step_name });

    const stepIndex = steps.findIndex(s => s.approval_step_id === currentStep.approval_step_id);
    const nextStep = steps[stepIndex + 1];
    const isLastStep = !nextStep;

    console.log("[processApproval] Step info:", {
      stepIndex,
      totalSteps: steps.length,
      currentStepId: currentStep.approval_step_id,
      nextStepId: nextStep?.approval_step_id,
      isLastStep
    });

    logDebug("STEPS_DATA", { steps: steps.map(s => ({ stepId: s.approval_step_id, stepName: s.step_name })) });
    logDebug("IS_LAST_STEP", { isLastStep });

    const existingApproval = await EntityStepApproval.findOne({
      where: {
        entity_id: entityId,
        entity_ref: entityRef,
        approval_step_id: currentStep.approval_step_id,
      },
      transaction,
    });

    if (existingApproval && (existingApproval.is_approved === 1 || existingApproval.is_approved === 0)) {
      throw new Error("STEP_ALREADY_PROCESSED");
    }

    await Approval.create({
      approval_flow_id: entity.flow.approval_flow_id,
      approval_step_id: currentStep.approval_step_id,
      approver_member_id: approverId,
      decision: action === "approve" ? "APPROVED" : "REJECTED",
      note: notes,
      decision_datetime: new Date(),
      entity_ref: entityRef,
      entity_id: entityId,
    }, { transaction });

    await EntityStepApproval.upsert({
      entity_step_approval_id: existingApproval?.entity_step_approval_id,
      entity_id: entityId,
      entity_ref: entityRef,
      approval_step_id: currentStep.approval_step_id,
      is_approved: action === "approve" ? 1 : 0,
      approved_at: action === "approve" ? new Date() : null,
    }, { transaction });

    logDebug("STEP_DECISION_SAVED");

    const updateData = { updatedAt: new Date() };
    const statusField = config.statusField || "status";
    let finalStatusValue = null;

    if (action === "approve") {
      if (isLastStep) {
        logDebug("FINAL_STEP_APPROVED", { entity: entity.toJSON() });
        try {
          await performFinalAction({ entity, transaction, entityRef, approverId });
          console.log("[processApproval] performFinalAction completed successfully");
        } catch (finalActionError) {
          console.error("[processApproval] performFinalAction ERROR:", finalActionError.message);
          throw finalActionError;
        }
        updateData.current_step_id = null;
        // Don't overwrite if performFinalAction already set a more specific status (like READY_TO_PAY)
        if (entityRef !== "savings_withdrawal") {
          finalStatusValue = "APPROVED";
        }
      } else {
        updateData.current_step_id = nextStep.approval_step_id;
        finalStatusValue = "IN_PROGRESS";
      }
    } else {
      updateData.current_step_id = null;
      finalStatusValue = "REJECTED";
    }
    
    // Map status string to status code if needed
    if (finalStatusValue) {
      const statusNameMap = {
        "APPROVED": "Disetujui",
        "REJECTED": "Ditolak",
        "IN_PROGRESS": "Sedang Diproses" // Updated to match database content
      };
      
      const statusName = statusNameMap[finalStatusValue];
      if (statusName) {
        const statusRecord = await ApprovalStatus.findOne({
          where: { status_name: statusName },
          transaction,
        });
        updateData[statusField] = statusRecord ? statusRecord.status_code : finalStatusValue;
      } else {
        updateData[statusField] = finalStatusValue;
      }
    }

    logDebug("UPDATE_DATA", {
      ...updateData,
      statusField,
      isLastStep
    });

    await config.model.update(updateData, {
      where: { [config.pk]: entityId },
      transaction,
    });

    await transaction.commit();
    logDebug("TX_COMMIT");

    // Kirim Socket Event & Notifikasi setelah commit
    const targetMemberId = entity[config.memberField];
    const currentStatus = updateData[statusField] || entity[statusField];
    
    if (targetMemberId) {
      try {
        const entityLabel = entityRef.replace(/_/g, " ");
        const stepLabel = currentStep?.step_name || "";

        let title;
        let content;

        if (currentStatus === "APPROVED") {
          title = `Pengajuan ${entityLabel} Disetujui`;
          content = isLastStep
            ? "Pengajuan telah disetujui sepenuhnya."
            : `Langkah "${stepLabel}" disetujui. Menunggu verifikasi berikutnya.`;
        } else if (currentStatus === "REJECTED") {
          title = `Pengajuan ${entityLabel} Ditolak`;
          content = notes
            ? `Pengajuan ditolak. Alasan: ${notes}`
            : `Pengajuan ${entityLabel} ditolak oleh verifikator.`;
        } else {
          title = `Update Persetujuan ${entityLabel}`;
          content = stepLabel
            ? `Langkah "${stepLabel}" disetujui. Menunggu verifikasi berikutnya.`
            : "Langkah disetujui, menunggu verifikasi berikutnya.";
        }

        logDebug("NOTIFICATION", { targetMemberId, title, status: currentStatus });

        // 1. Kirim Socket.io (Real-time UI Update)
        const socketEvent = entityRef === "members"
          ? "member_registration:update"
          : entityRef === "savings_withdrawal"
          ? "withdrawals:update"
          : `${entityRef}:update`;

        const socketPayload = {
          entityId,
          entityRef,
          status: currentStatus,
          current_step_id: updateData.current_step_id,
          step_name: stepLabel,
          trigger: true,
          ...(entityRef === "members" && {
            final_status: finalStatusValue === "APPROVED" ? "APPROVED" :
                         finalStatusValue === "REJECTED" ? "REJECTED" : "PENDING",
            is_approved_pengawas: currentStep?.step_order === 1 ? action === "approve" : entity.is_approved_pengawas,
            is_approved_ketua: currentStep?.step_order === 2 ? action === "approve" : entity.is_approved_ketua,
          }),
        };

        sendToUser(targetMemberId, socketEvent, socketPayload);

        // Compatibility events
        if (entityRef === "members") {
          sendToUser(targetMemberId, "REGISTRATION_UPDATED", socketPayload);
        } else if (entityRef === "transactions") {
          sendToUser(targetMemberId, "TRANSACTION_UPDATED", socketPayload);
        } else {
          // Standard pattern for others
          sendToUser(targetMemberId, `${entityRef.toUpperCase()}_UPDATED`, socketPayload);
        }

        // 2. Kirim Global Notification (Simpan ke DB + Push + Socket Bell)
        await sendGlobalNotification({
          memberId: targetMemberId,
          title,
          content,
          type: "APPROVAL",
          url: entityRef === "members" ? "/registration-status" : "/",
        });
      } catch (e) {
        console.error("[processApproval] Notification emission error:", e.message);
      }
    }

    return res.status(200).json({ success: true, message: "Approval diproses" });

  } catch (error) {
    if (transaction) await transaction.rollback();
    logDebug("TX_ROLLBACK", { error: error.message });
    return res.status(error.message === "FORBIDDEN" ? 403 : 500).json({ success: false, error: error.message });
  }
};