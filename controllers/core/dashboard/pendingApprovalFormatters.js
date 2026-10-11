import db from "../../../models/index.js";

/**
 * Standard reusable approval includes for ApprovalFlow, ApprovalStep, Approval
 */
export const getApprovalIncludes = (withApprovals = true) => {
  const includes = [
    {
      model: db.ApprovalFlow,
      as: "flow",
      include: [
        {
          model: db.ApprovalStep,
          as: "steps",
          include: [{ model: db.UserRole, as: "verifierRole" }],
        },
      ],
    },
    {
      model: db.ApprovalStep,
      as: "currentStep",
      include: [{ model: db.UserRole, as: "verifierRole" }],
    },
  ];

  if (withApprovals) {
    includes.push({
      model: db.Approval,
      as: "approvals",
      required: false,
      include: [
        {
          model: db.ApprovalStep,
          as: "step",
          include: [{ model: db.UserRole, as: "verifierRole", attributes: ["role_name"] }],
        },
      ],
    });
  }

  return includes;
};

/**
 * Normalizes approvals list safely
 */
export const normalizeApprovals = (approvals) => {
  if (!approvals) return [];
  return approvals.map((a) => (typeof a.toJSON === "function" ? a.toJSON() : a));
};

/**
 * Builds mock approval steps & currentStep for Sukuk order
 */
export const buildSukukApprovalProgress = (order) => {
  let stepOrder = 1;
  let stepName = "Persetujuan Pengawas";
  let roleName = "Pengawas";

  if (order.is_approved_pengawas && !order.is_approved_ketua) {
    stepOrder = 2;
    stepName = "Persetujuan Ketua";
    roleName = "Ketua";
  } else if (order.is_approved_ketua && !order.is_approved_bendahara) {
    stepOrder = 3;
    stepName = "Persetujuan Bendahara";
    roleName = "Bendahara";
  } else if (order.is_approved_bendahara) {
    stepOrder = 4;
    stepName = "Selesai";
    roleName = "Selesai";
  }

  const mockFlow = {
    steps: [
      { id: 1, step_order: 1, step_name: "Persetujuan Pengawas", verifierRole: { role_name: "Pengawas" } },
      { id: 2, step_order: 2, step_name: "Persetujuan Ketua", verifierRole: { role_name: "Ketua" } },
      { id: 3, step_order: 3, step_name: "Persetujuan Bendahara", verifierRole: { role_name: "Bendahara" } },
    ],
  };

  const mockCurrentStep = {
    step_order: stepOrder,
    step_name: stepName,
    verifierRole: { role_name: roleName },
  };

  return { mockFlow, mockCurrentStep };
};
