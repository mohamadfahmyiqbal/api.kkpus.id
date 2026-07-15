// PATH: controllers/core/approvals/processApproval.js

import db from "../../../models/index.js";
import { performFinalAction } from "./performFinalAction.js";
import { sendGlobalNotification } from "../../../services/notificationHelper.js";
import { sendToUser } from "../../../utils/socket.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.join(path.dirname(__filename), "..", "..", "..");

const saveBase64File = (base64File, identifier, prefix) => {
  if (!base64File?.includes("base64,")) throw new Error(`Data file tidak valid.`);
  const parts = base64File.match(/^data:(image\/(jpeg|png|jpg)|application\/pdf);base64,(.*)$/);
  if (!parts) throw new Error(`Format file harus JPG, PNG, atau PDF.`);

  const mimeType = parts[1];
  const fileBuffer = Buffer.from(parts[3], "base64");
  
  let extension = mimeType.split("/")[1];
  if (extension === 'jpeg') extension = 'jpg';

  const uploadDir = path.join(rootDir, "public", "uploads", "transfers");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const publicPath = `uploads/transfers/${identifier}_${prefix}_${Date.now()}.${extension}`;
  fs.writeFileSync(path.join(rootDir, "public", publicPath), fileBuffer);
  return publicPath;
};

const { Approval, ApprovalStep, ApprovalFlow, EntityStepApproval, ApprovalStatus, UserRole, sequelize } = db;

const EntityConfigs = {
  members: { 
    modelName: "MemberRegistration", 
    pk: "registration_id", 
    memberField: "member_id", 
    statusField: "final_status" 
  },
  financing_applications: { 
    modelName: "FinancingApplication", 
    pk: "financing_id", 
    memberField: "member_id", 
    statusField: "status" 
  },
  savings_withdrawal: { 
    modelName: "SavingsWithdrawal", 
    pk: "withdrawal_id", 
    memberField: "member_id", 
    statusField: "status" 
  },
  exit_requests: { 
    modelName: "MembershipTermination", 
    pk: "termination_id", 
    memberField: "member_id", 
    statusField: "status" 
  },
  tabungan_withdrawals: { 
    modelName: "SavingsWithdrawal", 
    pk: "withdrawal_id", 
    memberField: "member_id", 
    statusField: "status" 
  },
  transactions: { 
    modelName: "Transaction", 
    pk: "transaction_id", 
    memberField: "member_id", 
    statusField: "status" 
  },
  investments: { 
    modelName: "SukukOrder", 
    pk: "order_id", 
    memberField: "member_id", 
    statusField: "status" 
  },
  member_saving_targets: { 
    modelName: "MemberSavingTarget", 
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
  const { action, notes, amount, transfer_proof, operational_cost } = req.body;
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

    const model = db[config.modelName];
    if (!model) throw new Error(`Model ${config.modelName} tidak ditemukan di database`);
    
    const entity = await model.findByPk(entityId, {
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

    if (currentStep.role_id && !req.userRoleIds.includes(String(currentStep.role_id))) {
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
      if (transfer_proof && (entityRef === "savings_withdrawal" || entityRef === "tabungan_withdrawals" || entityRef === "financing_applications")) {
        try {
          const prefix = (entityRef === "savings_withdrawal" || entityRef === "tabungan_withdrawals") ? "wd" : "fin";
          const savedPath = saveBase64File(transfer_proof, entityId, prefix);
          updateData.transfer_proof_path = savedPath;
          entity.transfer_proof_path = savedPath;
        } catch (e) {
          console.error("Failed to save transfer proof", e);
          throw new Error("Gagal menyimpan bukti transfer: " + e.message);
        }
      }

      // Khusus untuk withdrawal
      if (entityRef === "savings_withdrawal" || entityRef === "tabungan_withdrawals") {
        if (amount !== undefined) {
          updateData.amount = amount;
          entity.amount = amount;
        }
      }
      
      // Khusus untuk financing_applications
      if (entityRef === "financing_applications" && (operational_cost !== undefined || req.body.discount !== undefined)) {
        const opCost = Number(operational_cost) || 0;
        const discountAmount = Number(req.body.discount) || 0;
        const itemPrice = Number(entity.item_price) || 0;
        const marginPercent = Number(entity.margin_percent) || 0;
        const dp = Number(entity.down_payment) || 0;
        const tenor = parseInt(entity.cooperation_months) || 1;

        // (harga barang + operasional - dp)
        const newPokok = Math.max(0, itemPrice + opCost - dp);
        
        // * margin
        const newKeuntungan = newPokok * (marginPercent / 100);
        
        // Total Hutang
        let newTotalTagihan = newPokok + newKeuntungan;
        if (discountAmount > 0) {
           newTotalTagihan = Math.max(0, newTotalTagihan - discountAmount);
        }
        
        // / tenor
        const newCicilan = Math.ceil(newTotalTagihan / tenor);

        updateData.operational_cost = opCost;
        updateData.amount_requested = newPokok;
        updateData.margin_amount = newKeuntungan;
        updateData.total_tagihan = newTotalTagihan;
        updateData.monthly_installment = newCicilan;
        updateData.discount = discountAmount;

        
        entity.operational_cost = opCost;
        entity.amount_requested = newPokok;
        entity.margin_amount = newKeuntungan;
        entity.total_tagihan = newTotalTagihan;
        entity.monthly_installment = newCicilan;
        entity.discount = discountAmount;

        // Apply discount to original transaction if this is a Pelunasan
        if (entity.keterangan && entity.keterangan.startsWith('PELUNASAN_REF:')) {
          const originalId = entity.keterangan.split(':')[1];
          if (originalId) {
            await db.FinancingApplication.update(
              { discount: discountAmount },
              { where: { financing_id: originalId }, transaction }
            );
          }
        }
      }

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
        if (entityRef !== "savings_withdrawal" && entityRef !== "tabungan_withdrawals") {
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

    if (entityRef === "members") {
      if (currentStep.step_order === 1) {
        updateData.is_approved_pengawas = action === "approve";
      } else if (currentStep.step_order === 2) {
        updateData.is_approved_ketua = action === "approve";
      }
    }

    logDebug("UPDATE_DATA", {
      ...updateData,
      statusField,
      isLastStep
    });

    await model.update(updateData, {
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
          : (entityRef === "savings_withdrawal" || entityRef === "tabungan_withdrawals")
          ? "withdrawals:update"
          : `${entityRef}:update`;

        const socketPayload = {
          entityId,
          entityRef,
          status: currentStatus,
          current_step_id: updateData.current_step_id,
          step_name: stepLabel,
          trigger: true,
          approval_step_id: currentStep.approval_step_id,
          step_order: currentStep.step_order,
          role_name: currentStep.verifierRole?.role_name || "",
          note: notes,
          ...(entityRef === "members" && {
            final_status: finalStatusValue === "APPROVED" ? "APPROVED" :
                         finalStatusValue === "REJECTED" ? "REJECTED" : "PENDING",
            is_approved_pengawas: currentStep?.step_order === 1 ? action === "approve" : entity.is_approved_pengawas,
            is_approved_ketua: currentStep?.step_order === 2 ? action === "approve" : entity.is_approved_ketua,
          }),
        };

        sendToUser(targetMemberId, socketEvent, socketPayload);
        if (approverId && approverId !== targetMemberId) {
          sendToUser(approverId, socketEvent, socketPayload);
        }

        // Compatibility events
        if (entityRef === "members") {
          sendToUser(targetMemberId, "REGISTRATION_UPDATED", socketPayload);
          if (approverId && approverId !== targetMemberId) sendToUser(approverId, "REGISTRATION_UPDATED", socketPayload);
        } else if (entityRef === "transactions") {
          sendToUser(targetMemberId, "TRANSACTION_UPDATED", socketPayload);
          if (approverId && approverId !== targetMemberId) sendToUser(approverId, "TRANSACTION_UPDATED", socketPayload);
        } else {
          // Standard pattern for others
          sendToUser(targetMemberId, `${entityRef.toUpperCase()}_UPDATED`, socketPayload);
          if (approverId && approverId !== targetMemberId) sendToUser(approverId, `${entityRef.toUpperCase()}_UPDATED`, socketPayload);
        }

        // 2. Kirim Global Notification (Simpan ke DB + Push + Socket Bell)
        await sendGlobalNotification({
          memberId: targetMemberId,
          title,
          content,
          type: "APPROVAL",
          url: entityRef === "members" ? "/registration-status" : "/",
        });

        // 3. Notifikasi ke Approver Berikutnya
        if (action === "approve" && nextStep) {
          const nextApprovers = await db.MemberRoleAssignment.findAll({
            where: { role_id: nextStep.role_id },
          });

          const entityLabel = entityRef.replace(/_/g, " ");
          const applicant = await db.Member.findByPk(targetMemberId, { attributes: ["full_name"] });
          const applicantName = applicant?.full_name || "Seorang Anggota";

          await Promise.allSettled(
            nextApprovers.map((approver) =>
              sendGlobalNotification({
                memberId: approver.member_id,
                title: `Persetujuan ${entityLabel}`,
                content: `Menunggu verifikasi Anda: Pengajuan ${entityLabel} dari ${applicantName}.`,
                type: "APPROVAL_REQUIRED",
                url: "/approvals",
              })
            )
          );
        }
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