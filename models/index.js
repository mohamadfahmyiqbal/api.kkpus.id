// src/models/index.js (FINAL & KOREKSI EagerLoadingError + SequelizeAssociationError)

// 🔥 PERUBAHAN UTAMA: Import instance Sequelize yang sudah terhubung
import sequelizeInstance from "../config/pus.js";
import { Sequelize } from "sequelize";

// ====================================================================
// A. IMPORT SEMUA MODELS
// ====================================================================

// 1. CORE & AUTH
import MemberStatus from "./core/member_status.js";
import Member from "./core/members.js";
import UserRole from "./core/user_roles.js";
import MemberRoleAssignment from "./core/member_role_assignments.js";
import MemberEmployment from "./core/member_employments.js";
import MemberEmergencyContact from "./core/member_emergency_contacts.js";
import MemberBankAccount from "./core/member_bank_accounts.js";
import MemberRegistration from "./core/member_registrations.js";
import Account from "./core/accounts.js";

// 🚨 BILLING MODELS (WAJIB DITAMBAH UNTUK FIX ERROR INI)
import Bill from "./billing/bills.js";
import BillItem from "./billing/bill_items.js"; // ✅ DITAMBAHKAN
import BillType from "./billing/bill_type.js"; // ✅ DITAMBAHKAN

// 2. CONTENT
import Article from "./content/articles.js";
import Notification from "./content/notifications.js";
import ActivityLog from "./content/activity_logs.js";

// 3. FINANCING
import BusinessProfile from "./financing/business_profiles.js";
import FinancingApplication from "./financing/financing_applications.js";
import SukukIssue from "./financing/sukuk_issues.js";
import SukukOrder from "./financing/sukuk_orders.js";

// 4. LOAN
import LoanProduct from "./loan/loan_products.js";
import MemberLoan from "./loan/member_loans.js";

// 5. SAVINGS
import SavingsProduct from "./savings/savings_products.js";
import MemberSavingsAccount from "./savings/member_savings_accounts.js";

// 6. APPROVALS
import ApprovalFlow from "./approvals/approval_flows.js";
import ApprovalStep from "./approvals/approval_steps.js";
import Approval from "./approvals/approvals.js";
import Transaction from "./billing/transactions.js";

// 7. INVENTORY (Asumsi: Model ini menyebabkan konflik alias 'items')
// Anda harus mengimpor model-model ini jika ada
// import Product from "./inventory/products.js";
// import ProductStock from "./inventory/product_stocks.js";

// Inisialisasi objek ekspor
const db = {};
db.sequelize = sequelizeInstance;
db.Sequelize = Sequelize;

// ====================================================================
// B. INISIALISASI SEMUA MODELS
// ====================================================================

// CORE & AUTH
db.MemberStatus = MemberStatus(sequelizeInstance);
db.Member = Member(sequelizeInstance);
db.UserRole = UserRole(sequelizeInstance);
db.MemberRoleAssignment = MemberRoleAssignment(sequelizeInstance);
db.MemberEmployment = MemberEmployment(sequelizeInstance);
db.MemberEmergencyContact = MemberEmergencyContact(sequelizeInstance);
db.MemberBankAccount = MemberBankAccount(sequelizeInstance);
db.MemberRegistration = MemberRegistration(sequelizeInstance);
db.Account = Account(sequelizeInstance);

// 🚨 BILLING MODELS DEFINITION (WAJIB DITAMBAHKAN UNTUK FIX ERROR INI)
db.Bill = Bill(sequelizeInstance);
db.BillItem = BillItem(sequelizeInstance); // ✅ DITAMBAHKAN
db.BillType = BillType(sequelizeInstance); // ✅ DITAMBAHKAN
db.Transaction = Transaction(sequelizeInstance); // 🛑 TAMBAHKAN INI
// CONTENT
db.Article = Article(sequelizeInstance);
db.Notification = Notification(sequelizeInstance);
db.ActivityLog = ActivityLog(sequelizeInstance);

// FINANCING
db.BusinessProfile = BusinessProfile(sequelizeInstance);
db.FinancingApplication = FinancingApplication(sequelizeInstance);
db.SukukIssue = SukukIssue(sequelizeInstance);
db.SukukOrder = SukukOrder(sequelizeInstance);

// LOAN
db.LoanProduct = LoanProduct(sequelizeInstance);
db.MemberLoan = MemberLoan(sequelizeInstance);

// SAVINGS
db.SavingsProduct = SavingsProduct(sequelizeInstance);
db.MemberSavingsAccount = MemberSavingsAccount(sequelizeInstance);

// APPROVALS
// Catatan: Menghapus argumen 'Sequelize' jika tidak digunakan di dalam definisi model.
db.ApprovalFlow = ApprovalFlow(sequelizeInstance);
db.ApprovalStep = ApprovalStep(sequelizeInstance);
db.Approval = Approval(sequelizeInstance);

// 🚨 INVENTORY MODELS DEFINITION (Jika diperlukan)
// db.Product = Product(sequelizeInstance);
// db.ProductStock = ProductStock(sequelizeInstance);

// ====================================================================
// C. DEFINISIKAN ASOSIASI (Relasi antar Model)
// ====================================================================

// 1. CORE RELATIONS

// Asosiasi MemberStatus dan Member
db.MemberStatus.hasMany(db.Member, {
  foreignKey: "status_id",
  as: "members",
});
db.Member.belongsTo(db.MemberStatus, { foreignKey: "status_id", as: "status" });

// ✅ KOREKSI: Tambahkan Asosiasi Member dan MemberRoleAssignment
// Catatan: Ini adalah fix dari error sebelumnya.
db.Member.hasMany(db.MemberRoleAssignment, {
  foreignKey: "member_id",
  as: "roleAssignments",
});
db.MemberRoleAssignment.belongsTo(db.Member, {
  foreignKey: "member_id",
  as: "member",
});

// Asosiasi Member dan Account
db.Member.hasOne(db.Account, { foreignKey: "member_id", as: "account" });
db.Account.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

// Asosiasi UserRole dan MemberRoleAssignment
db.UserRole.hasMany(db.MemberRoleAssignment, {
  foreignKey: "role_id",
  as: "assignments",
});
db.MemberRoleAssignment.belongsTo(db.UserRole, {
  foreignKey: "role_id",
  as: "role",
});

// Asosiasi Member dan MemberRegistration
db.Member.hasMany(db.MemberRegistration, {
  foreignKey: "member_id",
  as: "registration",
});
db.MemberRegistration.belongsTo(db.Member, {
  foreignKey: "member_id",
  as: "member",
});

// 2. BILLING RELATIONS
// Bill milik satu Member (menggunakan member_no seperti yang sudah ada)
db.Member.hasMany(db.Bill, {
  foreignKey: "member_no",
  sourceKey: "member_no",
  as: "bills",
});
db.Bill.belongsTo(db.Member, {
  foreignKey: "member_no",
  targetKey: "member_no",
  as: "member", // WAJIB ada di getInvoiceDetail
});

// Bill memiliki banyak BillItem
db.Bill.hasMany(db.BillItem, {
  foreignKey: "bill_id",
  sourceKey: "bill_id",
  as: "items",
});
// BillItem milik satu Bill
db.BillItem.belongsTo(db.Bill, {
  foreignKey: "bill_id",
  targetKey: "bill_id",
  as: "bill",
});

// Bill memiliki satu BillType
db.Bill.belongsTo(db.BillType, {
  foreignKey: "bill_type_id",
  as: "billType",
});

// 🛑 RELASI TRANSAKSI BARU
// 1. Transaksi ke Bill (FK: bill_id)
db.Transaction.belongsTo(db.Bill, {
  foreignKey: "bill_id",
  as: "bill",
});
db.Bill.hasMany(db.Transaction, {
  foreignKey: "bill_id",
  as: "transactions",
});

// 2. Transaksi ke Member (FK: member_id)
// Catatan: Relasi ini menggunakan PK member_id (BIGINT), sedangkan relasi Bill-Member menggunakan member_no.
db.Transaction.belongsTo(db.Member, {
  foreignKey: "member_id",
  as: "member",
});
db.Member.hasMany(db.Transaction, {
  foreignKey: "member_id",
  as: "transactions",
});

// 3. CONTENT RELATIONS (Jika ada relasi ke Member, tambahkan di sini)

// 4. FINANCING RELATIONS
db.SukukOrder.belongsTo(db.SukukIssue, {
  foreignKey: "sukuk_issue_id",
  as: "issue",
});

// 5. LOAN RELATIONS
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

// 6. SAVINGS RELATIONS
db.Member.hasMany(db.MemberSavingsAccount, {
  foreignKey: "member_id",
  as: "savings_accounts",
});
db.MemberSavingsAccount.belongsTo(db.Member, {
  foreignKey: "member_id",
  as: "member",
});
db.SavingsProduct.hasMany(db.MemberSavingsAccount, {
  foreignKey: "product_id",
  as: "accounts",
});
db.MemberSavingsAccount.belongsTo(db.SavingsProduct, {
  foreignKey: "product_id",
  as: "product",
});

// 7. APPROVALS
// Relasi MemberRegistration dan Approval
db.MemberRegistration.belongsTo(db.ApprovalFlow, {
  foreignKey: "approval_flow_id",
  as: "flow",
});
db.MemberRegistration.belongsTo(db.ApprovalStep, {
  foreignKey: "current_step_id",
  as: "currentStep",
});

// Relasi Approval Flow dan Step
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

// Relasi Approval
db.Approval.belongsTo(db.ApprovalStep, {
  foreignKey: "approval_step_id",
  as: "step",
});
db.Approval.belongsTo(db.Member, {
  foreignKey: "approver_member_id",
  as: "approver",
});

// 8. 🚨 INVENTORY RELATIONS (Koreksi Alias untuk menghindari konflik dengan Bill.items)
// Anda harus memastikan model Product dan ProductStock diinisialisasi di B.
/*
db.Product.hasMany(db.ProductStock, {
  foreignKey: 'product_id',
  as: 'productStocks', // ✅ KOREKSI: Menggunakan alias UNIK 'productStocks'
});
*/

export default db;
