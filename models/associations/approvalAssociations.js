// models/associations/approvalAssociations.js
export default function defineApprovalAssociations(db) {
  // Member Registration Flow & Steps
  db.MemberRegistration.belongsTo(db.ApprovalFlow, {
    foreignKey: "approval_flow_id",
    as: "flow",
  });
  db.MemberRegistration.belongsTo(db.MemberStatus, {
    foreignKey: "member_type",
    as: "memberTypeDetail",
  });
  db.MemberRegistration.belongsTo(db.ApprovalStep, {
    foreignKey: "current_step_id",
    as: "currentStep",
  });
  db.MemberRegistration.belongsTo(db.ApprovalStatus, {
    foreignKey: "status_id",
    as: "status",
  });

  // Approval Flow, Steps & Statuses
  db.ApprovalFlow.hasMany(db.ApprovalStep, {
    foreignKey: "approval_flow_id",
    as: "steps",
  });
  db.ApprovalFlow.hasMany(db.ApprovalStatus, {
    foreignKey: "approval_flow_id",
    as: "statuses",
  });

  db.ApprovalStep.belongsTo(db.ApprovalFlow, {
    foreignKey: "approval_flow_id",
    as: "flow",
  });
  db.ApprovalStep.belongsTo(db.UserRole, {
    foreignKey: "role_id",
    as: "verifierRole",
  });

  // Approval Step & Entity Step Approval
  db.ApprovalStep.hasMany(db.EntityStepApproval, {
    foreignKey: "approval_step_id",
    as: "entityApprovals",
  });
  db.EntityStepApproval.belongsTo(db.ApprovalStep, {
    foreignKey: "approval_step_id",
    as: "step",
  });

  // Member Registration Checkpoints & Approvals
  db.MemberRegistration.hasMany(db.EntityStepApproval, {
    foreignKey: "entity_id",
    constraints: false,
    scope: { entity_ref: "members" },
    as: "checkpoints",
  });
  db.MemberRegistration.hasMany(db.Approval, {
    foreignKey: "entity_id",
    constraints: false,
    scope: { entity_ref: "members" },
    as: "approvals",
  });

  db.ApprovalStatus.belongsTo(db.ApprovalFlow, {
    foreignKey: "approval_flow_id",
    as: "flow",
  });

  db.Approval.belongsTo(db.ApprovalStep, {
    foreignKey: "approval_step_id",
    as: "step",
  });
  db.Approval.belongsTo(db.Member, {
    foreignKey: "approver_member_id",
    as: "approver",
  });

  // Membership Termination Associations
  db.MembershipTermination.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });
  db.Member.hasMany(db.MembershipTermination, {
    foreignKey: "member_id",
    as: "terminations",
  });

  db.MembershipTermination.belongsTo(db.ApprovalFlow, {
    foreignKey: "approval_flow_id",
    as: "flow",
  });
  db.MembershipTermination.belongsTo(db.ApprovalStep, {
    foreignKey: "current_step_id",
    as: "currentStep",
  });

  db.MembershipTermination.hasMany(db.Approval, {
    foreignKey: "entity_id",
    constraints: false,
    scope: { entity_ref: "exit_requests" },
    as: "approvals",
  });
  db.Approval.belongsTo(db.MembershipTermination, {
    foreignKey: "entity_id",
    constraints: false,
    as: "termination",
  });
}
