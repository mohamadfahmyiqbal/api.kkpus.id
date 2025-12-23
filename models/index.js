// src/models/index.js (FIXED: Menghapus Duplikat Alias 'account')

import sequelizeInstance from "../config/pus.js";
import { Sequelize } from "sequelize";

// A. IMPORT SEMUA MODELS
import MemberStatus from "./core/member_status.js";
import Member from "./core/members.js";
import UserRole from "./core/user_roles.js";
import MemberRoleAssignment from "./core/member_role_assignments.js";
import MemberEmployment from "./core/member_employments.js";
import MemberEmergencyContact from "./core/member_emergency_contacts.js";
import MemberBankAccount from "./core/member_bank_accounts.js";
import MemberRegistration from "./core/member_registrations.js";
import Account from "./core/accounts.js";
import Bill from "./billing/bills.js";
import BillItem from "./billing/bill_items.js";
import BillType from "./billing/bill_type.js";
import Transaction from "./billing/transactions.js";
import Article from "./content/articles.js";
import Notification from "./content/notifications.js";
import ActivityLog from "./content/activity_logs.js";
import BusinessProfile from "./financing/business_profiles.js";
import FinancingApplication from "./financing/financing_applications.js";
import SukukIssue from "./financing/sukuk_issues.js";
import SukukOrder from "./financing/sukuk_orders.js";
import LoanProduct from "./loan/loan_products.js";
import MemberLoan from "./loan/member_loans.js";
import SavingsProduct from "./savings/savings_products.js";
import MemberSavingsAccount from "./savings/member_savings_accounts.js";
import SavingsTransaction from "./savings/savings_transactions.js"; // ✅
import ApprovalFlow from "./approvals/approval_flows.js";
import ApprovalStep from "./approvals/approval_steps.js";
import Approval from "./approvals/approvals.js";

const db = {};
db.sequelize = sequelizeInstance;
db.Sequelize = Sequelize;

// B. INISIALISASI
db.MemberStatus = MemberStatus(sequelizeInstance);
db.Member = Member(sequelizeInstance);
db.UserRole = UserRole(sequelizeInstance);
db.MemberRoleAssignment = MemberRoleAssignment(sequelizeInstance);
db.MemberEmployment = MemberEmployment(sequelizeInstance);
db.MemberEmergencyContact = MemberEmergencyContact(sequelizeInstance);
db.MemberBankAccount = MemberBankAccount(sequelizeInstance);
db.MemberRegistration = MemberRegistration(sequelizeInstance);
db.Account = Account(sequelizeInstance);
db.Bill = Bill(sequelizeInstance);
db.BillItem = BillItem(sequelizeInstance);
db.BillType = BillType(sequelizeInstance);
db.Transaction = Transaction(sequelizeInstance);
db.Article = Article(sequelizeInstance);
db.Notification = Notification(sequelizeInstance);
db.ActivityLog = ActivityLog(sequelizeInstance);
db.BusinessProfile = BusinessProfile(sequelizeInstance);
db.FinancingApplication = FinancingApplication(sequelizeInstance);
db.SukukIssue = SukukIssue(sequelizeInstance);
db.SukukOrder = SukukOrder(sequelizeInstance);
db.LoanProduct = LoanProduct(sequelizeInstance);
db.MemberLoan = MemberLoan(sequelizeInstance);
db.SavingsProduct = SavingsProduct(sequelizeInstance);
db.MemberSavingsAccount = MemberSavingsAccount(sequelizeInstance);
db.SavingsTransaction = SavingsTransaction(sequelizeInstance);
db.ApprovalFlow = ApprovalFlow(sequelizeInstance);
db.ApprovalStep = ApprovalStep(sequelizeInstance);
db.Approval = Approval(sequelizeInstance);

// C. DEFINISIKAN ASOSIASI (Relasi)
// --- CORE ---
db.MemberStatus.hasMany(db.Member, { foreignKey: "status_id", as: "members" });
db.Member.belongsTo(db.MemberStatus, { foreignKey: "status_id", as: "status" });

db.Member.hasMany(db.MemberRoleAssignment, {
  foreignKey: "member_id",
  as: "roleAssignments",
});
db.MemberRoleAssignment.belongsTo(db.Member, {
  foreignKey: "member_id",
  as: "member",
});

// ✅ REVISI: Definisi Account dipindahkan ke sini satu kali saja (Mencegah AssociationError)
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

// --- BILLING ---
// Relasi Member dan Bill
db.Member.hasMany(db.Bill, {
  foreignKey: "member_no",
  sourceKey: "member_no",
  as: "bills",
});
db.Bill.belongsTo(db.Member, {
  foreignKey: "member_no",
  targetKey: "member_no",
  as: "member",
});

// Relasi Bill dan BillItem
db.Bill.hasMany(db.BillItem, { foreignKey: "bill_id", as: "items" });
db.BillItem.belongsTo(db.Bill, { foreignKey: "bill_id", as: "bill" });

// Relasi Bill dan BillType
db.Bill.belongsTo(db.BillType, { foreignKey: "bill_type_id", as: "billType" });
db.BillType.hasMany(db.Bill, { foreignKey: "bill_type_id", as: "bills" });

// Relasi Transaction dengan Bill dan Member
db.Transaction.belongsTo(db.Bill, { foreignKey: "bill_id", as: "bill" });
db.Bill.hasMany(db.Transaction, { foreignKey: "bill_id", as: "transactions" });

db.Transaction.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });
db.Member.hasMany(db.Transaction, {
  foreignKey: "member_id",
  as: "transactions",
});

// --- 🆕 SAVINGS & MUTATIONS ---
db.Account.hasMany(db.Transaction, {
  foreignKey: "member_id", // atau buat FK account_id di tabel transactions
  as: "mutations",
});

db.Transaction.belongsTo(db.Account, {
  foreignKey: "member_id",
  as: "account",
});

// --- FINANCING & LOAN ---
db.SukukOrder.belongsTo(db.SukukIssue, {
  foreignKey: "sukuk_issue_id",
  as: "issue",
});
db.LoanProduct.hasMany(db.MemberLoan, {
  foreignKey: "product_id",
  as: "loans",
});
db.MemberLoan.belongsTo(db.LoanProduct, {
  foreignKey: "product_id",
  as: "product",
});
db.Member.hasMany(db.MemberLoan, {
  foreignKey: "member_id",
  as: "member_loans",
});
db.MemberLoan.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

// --- SAVINGS PRODUCT ---
db.Member.hasMany(db.MemberSavingsAccount, {
  foreignKey: "member_id",
  as: "savings_accounts",
});
db.MemberSavingsAccount.belongsTo(db.Member, {
  foreignKey: "member_id",
  as: "member",
});
db.SavingsProduct.hasMany(db.MemberSavingsAccount, {
  foreignKey: "savings_product_id", // Ubah dari product_id ke savings_product_id
  as: "accounts",
});

db.MemberSavingsAccount.belongsTo(db.SavingsProduct, {
  foreignKey: "savings_product_id", // Ubah dari product_id ke savings_product_id
  as: "product",
});

// --- APPROVALS ---
db.MemberRegistration.belongsTo(db.ApprovalFlow, {
  foreignKey: "approval_flow_id",
  as: "flow",
});
db.MemberRegistration.belongsTo(db.ApprovalStep, {
  foreignKey: "current_step_id",
  as: "currentStep",
});
db.ApprovalFlow.hasMany(db.ApprovalStep, {
  foreignKey: "approval_flow_id",
  as: "steps",
});
db.ApprovalStep.belongsTo(db.ApprovalFlow, {
  foreignKey: "approval_flow_id",
  as: "flow",
});
db.ApprovalStep.belongsTo(db.UserRole, {
  foreignKey: "role_id",
  as: "verifierRole",
});
db.Approval.belongsTo(db.ApprovalStep, {
  foreignKey: "approval_step_id",
  as: "step",
});
db.Approval.belongsTo(db.Member, {
  foreignKey: "approver_member_id",
  as: "approver",
});

export default db;
