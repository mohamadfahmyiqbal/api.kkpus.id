import db from "../models/index.js";

const EntityModels = {
  members: "MemberRegistration",
  savings_withdrawal: "SavingsWithdrawal",
  savings: "SavingsWithdrawal",
  financing_applications: "FinancingApplication",
  member_saving_targets: "MemberSavingTarget",
  tabungan_withdrawals: "SavingsWithdrawal",
};

export const verifyApprovalChain = (entityRef) => async (req, res, next) => {
  const { entityId } = req.params;
  
  console.log("[verifyApprovalChain] entityRef:", entityRef);
  console.log("[verifyApprovalChain] entityId:", entityId);
  console.log("[verifyApprovalChain] Available models:", Object.keys(EntityModels));
  
  const modelName = EntityModels[entityRef];
  const EntityModel = db[modelName];

  console.log("[verifyApprovalChain] EntityModel found:", !!EntityModel);

  console.log("EntityModel for", entityRef, ":", EntityModel ? EntityModel.name : "undefined");

  try {
    if (!EntityModel) {
      throw new Error(`Model ${modelName} tidak ditemukan untuk entityRef ${entityRef}`);
    }
    const entity = await EntityModel.findByPk(entityId);
    
    if (!entity || !entity.current_step_id) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan atau proses approval sudah selesai.",
      });
    }

    const flow = await db.ApprovalFlow.findByPk(entity.approval_flow_id, {
      include: [{
        model: db.ApprovalStep,
        as: "steps",
        attributes: ["approval_step_id", "approval_flow_id", "step_order", "role_id", "step_name"],
      }],
      order: [[{ model: db.ApprovalStep, as: "steps" }, "step_order", "ASC"]]
    });

    if (!flow || !flow.steps || flow.steps.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Alur approval belum dikonfigurasi.",
      });
    }

    const approvals = await db.Approval.findAll({
      where: {
        entity_ref: entityRef,
        entity_id: entityId
      },
      order: [["decision_datetime", "DESC"]],
      attributes: ["approval_id", "approval_step_id", "approver_member_id", "decision", "decision_datetime", "note"]
    });

    const allSteps = flow.steps;
    const currentStep = allSteps.find(s => s.approval_step_id === entity.current_step_id);
    
    if (!currentStep) {
      return res.status(400).json({
        success: false,
        message: "Step approval saat ini tidak valid.",
      });
    }

    const currentStepIndex = allSteps.findIndex(s => s.approval_step_id === entity.current_step_id);

    const hasRole = currentStep.role_id ? req.userRoleIds.some(id => String(id) === String(currentStep.role_id)) : true;

    // Validasi Role (Sesuai role_id di approval_steps)
    console.log("[verifyApprovalChain] Role check:", {
      requiredRoleId: currentStep.role_id,
      requiredStepName: currentStep.step_name,
      userRoleIds: req.userRoleIds,
      hasAccess: hasRole
    });
    
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `Otoritas ditolak. Tahap ini memerlukan peran: ${currentStep.step_name}`,
      });
    }

    // Validasi Chain (Pastikan step sebelumnya sudah APPROVED)
    for (let i = 0; i < currentStepIndex; i++) {
      const step = allSteps[i];
      const stepApproval = approvals.find(
        (a) => a.approval_step_id === step.approval_step_id && a.decision === "APPROVED"
      );
      
      if (!stepApproval) {
        return res.status(403).json({
          success: false,
          message: `Tahap ${step.step_name} belum disetujui. Approval harus berurutan.`,
        });
      }
    }

    req.entityData = {
      ...entity.toJSON(),
      flow,
      approvals
    };
    
    next();
  } catch (error) {
    console.error("Verify Approval Chain Error:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      details: error.message 
    });
  }
};