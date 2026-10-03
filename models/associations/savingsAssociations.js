// models/associations/savingsAssociations.js
export default function defineSavingsAssociations(db) {
  // Member Savings Reports
  db.Member.hasMany(db.SavingsReport, { foreignKey: "member_id", as: "savings_reports" });
  db.SavingsReport.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  db.Member.hasOne(db.SavingsReportList, { foreignKey: "member_id", as: "savings_report_list" });
  db.SavingsReportList.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  // Member & Savings Accounts
  db.Member.hasMany(db.MemberSavingsAccount, { foreignKey: "member_id", as: "savings_accounts" });
  db.MemberSavingsAccount.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  // Savings Products
  db.SavingsProduct.hasMany(db.MemberSavingsAccount, { foreignKey: "savings_product_id", as: "memberAccounts" });
  db.MemberSavingsAccount.belongsTo(db.SavingsProduct, { foreignKey: "savings_product_id", as: "savingsProduct" });

  // Savings Account & Transactions
  db.SavingsTransaction.belongsTo(db.MemberSavingsAccount, { foreignKey: "savings_account_id", as: "savingsAccount" });
  db.MemberSavingsAccount.hasMany(db.SavingsTransaction, { foreignKey: "savings_account_id", as: "transactions" });

  // Savings Withdrawals & Savings Accounts
  db.SavingsWithdrawal.belongsTo(db.MemberSavingsAccount, {
    foreignKey: "savings_account_id",
    as: "savingsAccount",
    constraints: false,
  });
  db.MemberSavingsAccount.hasMany(db.SavingsWithdrawal, {
    foreignKey: "savings_account_id",
    as: "withdrawals",
    constraints: false,
  });

  // Savings Withdrawals & Member Saving Targets
  db.SavingsWithdrawal.belongsTo(db.MemberSavingTarget, {
    foreignKey: "member_saving_target_id",
    as: "savingTarget",
    constraints: false,
  });
  db.MemberSavingTarget.hasMany(db.SavingsWithdrawal, {
    foreignKey: "member_saving_target_id",
    as: "withdrawals",
    constraints: false,
  });

  // Savings Withdrawals & Member
  db.SavingsWithdrawal.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });
  db.Member.hasMany(db.SavingsWithdrawal, { foreignKey: "member_id", as: "withdrawals" });

  // Savings Withdrawal Approval Flow & Steps
  db.SavingsWithdrawal.belongsTo(db.ApprovalFlow, { foreignKey: "approval_flow_id", as: "flow" });
  db.SavingsWithdrawal.belongsTo(db.ApprovalStep, { foreignKey: "current_step_id", as: "currentStep" });

  // Savings Withdrawal Disbursements (Midtrans)
  db.SavingsWithdrawal.hasMany(db.MidtransDisbursement, { foreignKey: "withdrawal_id", as: "midtransDisbursements" });
  db.MidtransDisbursement.belongsTo(db.SavingsWithdrawal, { foreignKey: "withdrawal_id", as: "withdrawal" });

  db.MidtransDisbursement.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });
  db.Member.hasMany(db.MidtransDisbursement, { foreignKey: "member_id", as: "midtransDisbursements" });

  // Savings Withdrawal Approvals
  db.SavingsWithdrawal.hasMany(db.Approval, {
    foreignKey: "entity_id",
    constraints: false,
    scope: { entity_ref: ["savings_withdrawal", "tabungan_withdrawals"] },
    as: "approvals",
  });
  db.Approval.belongsTo(db.SavingsWithdrawal, {
    foreignKey: "entity_id",
    constraints: false,
    as: "withdrawal",
  });

  // Member Saving Targets & Approval
  db.MemberSavingTarget.belongsTo(db.ApprovalFlow, { foreignKey: "approval_flow_id", as: "flow" });
  db.MemberSavingTarget.belongsTo(db.ApprovalStep, { foreignKey: "current_step_id", as: "currentStep" });
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

  // Member Saving Target & Master SavingTarget
  db.MemberSavingTarget.belongsTo(db.SavingTarget, { foreignKey: "saving_target_id", as: "savingTarget" });
  db.SavingTarget.hasMany(db.MemberSavingTarget, { foreignKey: "saving_target_id", as: "memberTargets" });
  db.MemberSavingTarget.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });
  db.Member.hasMany(db.MemberSavingTarget, { foreignKey: "member_id", as: "savingTargets" });
}
