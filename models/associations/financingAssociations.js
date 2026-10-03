// models/associations/financingAssociations.js
export default function defineFinancingAssociations(db) {
  // Loan Product & Member Loan
  db.LoanProduct.hasMany(db.MemberLoan, { foreignKey: "loan_product_id", as: "loans" });
  db.MemberLoan.belongsTo(db.LoanProduct, { foreignKey: "loan_product_id", as: "loanProduct" });
  db.MemberLoan.belongsTo(db.LoanProduct, {
    foreignKey: "product_id",
    targetKey: "loan_product_id",
    as: "product",
  });
  db.Member.hasMany(db.MemberLoan, { foreignKey: "member_id", as: "member_loans" });
  db.MemberLoan.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  // Financing Applications & Member
  db.Member.hasMany(db.FinancingApplication, {
    foreignKey: "member_id",
    as: "financing_applications",
  });
  db.FinancingApplication.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  // Financing Application Installments (BillItem)
  db.FinancingApplication.hasMany(db.BillItem, {
    foreignKey: "financing_application_id",
    as: "installments",
  });
  db.BillItem.belongsTo(db.FinancingApplication, {
    foreignKey: "financing_application_id",
    as: "financingApplication",
  });

  // Financing Application Flow & Steps
  db.FinancingApplication.belongsTo(db.ApprovalFlow, {
    foreignKey: "approval_flow_id",
    as: "flow",
  });
  db.FinancingApplication.belongsTo(db.ApprovalStep, {
    foreignKey: "current_step_id",
    as: "currentStep",
  });

  // Financing Application Approvals
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

  // Financing Application & Arisan Batch
  db.FinancingApplication.belongsTo(db.ArisanBatch, {
    foreignKey: "arisan_batch_id",
    as: "arisanBatch",
  });

  // Jual Beli Report
  db.Member.hasMany(db.JualBeliReport, { foreignKey: "member_id", as: "jual_beli_reports" });
  db.JualBeliReport.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });
}
