// models/associations.js
export default function defineAssociations(db) {
  db.MemberStatus.hasMany(db.Member, { foreignKey: "status_id", as: "member" });
  db.Member.belongsTo(db.MemberStatus, {
    foreignKey: "status_id",
    as: "status",
  });

  db.Member.hasMany(db.MemberRoleAssignment, {
    foreignKey: "member_id",
    as: "roleAssignments",
  });
  db.MemberRoleAssignment.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });

  db.Member.hasOne(db.Account, { foreignKey: "member_id", as: "account" });
  db.Account.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  db.UserRole.hasMany(db.MemberRoleAssignment, {
    foreignKey: "role_id",
    as: "assignments",
  });
  db.MemberRoleAssignment.belongsTo(db.UserRole, {
    foreignKey: "role_id",
    as: "role",
  });

  db.Member.hasMany(db.MemberRegistration, {
    foreignKey: "member_id",
    as: "registration",
  });
  db.MemberRegistration.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });

  db.Member.hasMany(db.MemberBankAccount, {
    foreignKey: "member_id",
    as: "bankAccounts",
  });
  db.MemberBankAccount.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });

  db.Member.hasMany(db.MemberEmployment, {
    foreignKey: "member_id",
    as: "employments",
  });
  db.MemberEmployment.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });

  db.Member.hasMany(db.Bill, { foreignKey: "member_id", as: "bills" });
  db.Bill.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  db.Bill.hasMany(db.BillItem, { foreignKey: "bill_id", as: "items" });
  db.BillItem.belongsTo(db.Bill, { foreignKey: "bill_id", as: "bill" });

  db.BillItem.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  db.BillItem.belongsTo(db.BillType, {
    foreignKey: "bill_type_id",
    as: "type",
  });
  db.BillType.hasMany(db.BillItem, { foreignKey: "bill_type_id", as: "items" });

  db.Bill.belongsTo(db.BillType, {
    foreignKey: "bill_type_id",
    as: "billType",
  });
  db.BillType.hasMany(db.Bill, { foreignKey: "bill_type_id", as: "bills" });

  db.Member.hasMany(db.Transaction, {
    foreignKey: "member_id",
    as: "transactions",
  });
  db.Transaction.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });

  db.Account.hasMany(db.Transaction, {
    foreignKey: "member_id",
    as: "mutations",
  });
  db.Transaction.belongsTo(db.Account, {
    foreignKey: "member_id",
    as: "account",
  });

  db.Bill.hasMany(db.Transaction, { foreignKey: "bill_id", as: "payments" });
  db.Transaction.belongsTo(db.Bill, { foreignKey: "bill_id", as: "bill" });

  db.SukukOrder.belongsTo(db.SukukIssue, {
    foreignKey: "sukuk_issue_id",
    as: "issue",
  });
  db.LoanProduct.hasMany(db.MemberLoan, {
    foreignKey: "loan_product_id",
    as: "loans",
  });
  db.MemberLoan.belongsTo(db.LoanProduct, {
    foreignKey: "loan_product_id",
    as: "loanProduct",
  });
  db.MemberLoan.belongsTo(db.LoanProduct, {
    foreignKey: "product_id",
    targetKey: "loan_product_id",
    as: "product",
  });
  db.Member.hasMany(db.MemberLoan, {
    foreignKey: "member_id",
    as: "member_loans",
  });
  db.MemberLoan.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  db.Member.hasMany(db.FinancingApplication, {
    foreignKey: "member_id",
    as: "financing_applications",
  });
  db.FinancingApplication.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });

  db.FinancingApplication.belongsTo(db.ApprovalFlow, {
    foreignKey: "approval_flow_id",
    as: "flow",
  });
  db.FinancingApplication.belongsTo(db.ApprovalStep, {
    foreignKey: "current_step_id",
    as: "currentStep",
  });

  db.FinancingApplication.hasMany(db.Approval, {
    foreignKey: "entity_id",
    constraints: false,
    scope: { entity_ref: "financing_applications" },
    as: "approvals",
  });

  db.Approval.belongsTo(db.FinancingApplication, {
    foreignKey: "entity_id",
    constraints: false,
    as: "financing",
  });

  db.FinancingApplication.belongsTo(db.ArisanBatch, {
    foreignKey: "arisan_batch_id",
    as: "arisanBatch",
  });

  db.Member.hasMany(db.MemberSavingsAccount, {
    foreignKey: "member_id",
    as: "savings_accounts",
  });
  db.MemberSavingsAccount.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });
  db.SavingsProduct.hasMany(db.MemberSavingsAccount, {
    foreignKey: "savings_product_id",
    as: "memberAccounts",
  });
  db.MemberSavingsAccount.belongsTo(db.SavingsProduct, {
    foreignKey: "savings_product_id",
    as: "savingsProduct",
  });

  db.SavingsWithdrawal.belongsTo(db.MemberSavingsAccount, {
    foreignKey: "savings_account_id",
    as: "savingsAccount",
  });
  db.MemberSavingsAccount.hasMany(db.SavingsWithdrawal, {
    foreignKey: "savings_account_id",
    as: "withdrawals",
  });
  db.SavingsWithdrawal.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });
  db.Member.hasMany(db.SavingsWithdrawal, {
    foreignKey: "member_id",
    as: "withdrawals",
  });

  db.SavingsWithdrawal.belongsTo(db.ApprovalFlow, {
    foreignKey: "approval_flow_id",
    as: "flow",
  });
  db.SavingsWithdrawal.belongsTo(db.ApprovalStep, {
    foreignKey: "current_step_id",
    as: "currentStep",
  });

  db.SavingsWithdrawal.hasMany(db.MidtransDisbursement, {
    foreignKey: "withdrawal_id",
    as: "midtransDisbursements",
  });

  db.MidtransDisbursement.belongsTo(db.SavingsWithdrawal, {
    foreignKey: "withdrawal_id",
    as: "withdrawal",
  });

  db.MidtransDisbursement.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });

  db.Member.hasMany(db.MidtransDisbursement, {
    foreignKey: "member_id",
    as: "midtransDisbursements",
  });

  db.SavingsWithdrawal.hasMany(db.Approval, {
    foreignKey: "entity_id",
    constraints: false,
    scope: { entity_ref: "savings_withdrawal" },
    as: "approvals",
  });

  db.Approval.belongsTo(db.SavingsWithdrawal, {
    foreignKey: "entity_id",
    constraints: false,
    as: "withdrawal",
  });

  db.MemberSavingTarget.belongsTo(db.ApprovalFlow, {
    foreignKey: "approval_flow_id",
    as: "flow",
  });
  db.MemberSavingTarget.belongsTo(db.ApprovalStep, {
    foreignKey: "current_step_id",
    as: "currentStep",
  });
  db.MemberSavingTarget.hasMany(db.Approval, {
    foreignKey: "entity_id",
    constraints: false,
    scope: { entity_ref: "member_saving_targets" },
    as: "approvals",
  });
  db.Approval.belongsTo(db.MemberSavingTarget, {
    foreignKey: "entity_id",
    constraints: false,
    as: "savingTarget",
  });

  db.MemberSavingTarget.belongsTo(db.SavingTarget, {
    foreignKey: "saving_target_id",
    as: "savingTarget",
  });
  db.SavingTarget.hasMany(db.MemberSavingTarget, {
    foreignKey: "saving_target_id",
    as: "memberTargets",
  });
  db.MemberSavingTarget.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });
  db.Member.hasMany(db.MemberSavingTarget, {
    foreignKey: "member_id",
    as: "savingTargets",
  });

  db.MemberRegistration.belongsTo(db.ApprovalFlow, {
    foreignKey: "approval_flow_id",
    as: "flow",
  });
  db.MemberRegistration.belongsTo(db.ApprovalStep, {
    foreignKey: "current_step_id",
    as: "currentStep",
  });
  db.MemberRegistration.belongsTo(db.ApprovalStatus, {
    foreignKey: "status_id",
    as: "status",
  });

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

  // REKOMENDASI PERBAIKAN: Approval Step & Entity Step Approval
  db.ApprovalStep.hasMany(db.EntityStepApproval, {
    foreignKey: "approval_step_id",
    as: "entityApprovals",
  });
  db.EntityStepApproval.belongsTo(db.ApprovalStep, {
    foreignKey: "approval_step_id",
    as: "step",
  });

  // REKOMENDASI PERBAIKAN: Member Registration Checkpoints
  db.MemberRegistration.hasMany(db.EntityStepApproval, {
    foreignKey: "entity_id",
    constraints: false,
    scope: { entity_ref: "members" },
    as: "checkpoints",
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

  db.Member.hasMany(db.PushSubscription, {
    foreignKey: "member_id",
    as: "pushSubscriptions",
  });
  db.PushSubscription.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });

  // Forgot Password Associations - Commented until files are deployed
  /*
  db.Member.hasMany(db.ForgotPasswordSession, {
    foreignKey: "member_id",
    as: "forgotPasswordSessions",
  });
  db.ForgotPasswordSession.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });

  db.ForgotPasswordSession.hasMany(db.PasswordResetToken, {
    foreignKey: "session_id",
    as: "resetTokens",
  });
  db.PasswordResetToken.belongsTo(db.ForgotPasswordSession, {
    foreignKey: "session_id",
    as: "session",
  });

  db.PasswordResetToken.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });
  */

  // Arisan Associations
  db.ArisanProgram.hasMany(db.ArisanBatch, {
    foreignKey: "arisan_program_id",
    as: "batches",
  });
  db.ArisanBatch.belongsTo(db.ArisanProgram, {
    foreignKey: "arisan_program_id",
    as: "program",
  });

  db.ArisanBatch.hasMany(db.ArisanParticipant, {
    foreignKey: "arisan_batch_id",
    as: "participants",
  });
  db.ArisanParticipant.belongsTo(db.ArisanBatch, {
    foreignKey: "arisan_batch_id",
    as: "batch",
  });

  db.Member.hasMany(db.ArisanParticipant, {
    foreignKey: "member_id",
    as: "arisan_participations",
  });
  db.ArisanParticipant.belongsTo(db.Member, {
    foreignKey: "member_id",
    as: "member",
  });

  // Sukuk associations
  db.SukukIssue.hasMany(db.SukukOrder, { foreignKey: "sukuk_issue_id", as: "orders" });
  db.SukukOrder.belongsTo(db.SukukIssue, { foreignKey: "sukuk_issue_id", as: "sukukIssue" });
  db.SukukOrder.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });
  db.Member.hasMany(db.SukukOrder, { foreignKey: "member_id", as: "sukukOrders" });
}
