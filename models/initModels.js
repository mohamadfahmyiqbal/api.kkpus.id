// models/initModels.js
import MemberStatus from "./core/member_status.js";
import Member from "./core/members.js";
import UserRole from "./core/user_roles.js";
import MemberRoleAssignment from "./core/member_role_assignments.js";
import MemberEmployment from "./core/member_employments.js";
import MemberEmergencyContact from "./core/member_emergency_contacts.js";
import MemberBankAccount from "./core/member_bank_accounts.js";
import MemberRegistration from "./core/member_registrations.js";
import MembershipTermination from "./core/membership_terminations.js";
import Account from "./core/accounts.js";
import Bill from "./billing/bills.js";
import BillItem from "./billing/bill_items.js";
import BillType from "./billing/bill_type.js";
import Transaction from "./billing/transactions.js";
import GeneralTransaction from "./jualbeli/jual_beli.js";
import Savings from "./savings/savings.js";
import Article from "./content/articles.js";
import Notification from "./content/notifications.js";
import ActivityLog from "./content/activity_logs.js";
import BusinessProfile from "./financing/business_profiles.js";
import FinancingApplication from "./financing/financing_applications.js";
import FinancingCategory from "./financing/financing_categories.js";
import FinancingTerm from "./financing/financing_terms.js";
import SukukIssue from "./financing/sukuk_issues.js";
import SukukOrder from "./financing/sukuk_orders.js";
import LoanProduct from "./loan/loan_products.js";
import MemberLoan from "./loan/member_loans.js";
import SavingsProduct from "./savings/savings_products.js";
import SavingTarget from "./savings/saving_targets.js";
import MemberSavingTarget from "./savings/member_saving_targets.js";
import MemberSavingsAccount from "./savings/member_savings_accounts.js";
import SavingsTransaction from "./savings/savings_transactions.js";
import SavingsWithdrawal from "./savings/savings_withdrawals.js";
import MidtransDisbursement from "./savings/midtrans_disbursements.js";
import ApprovalFlow from "./approvals/approval_flows.js";
import ApprovalStep from "./approvals/approval_steps.js";
import ApprovalStatus from "./approvals/approval_statuses.js";
import Approval from "./approvals/approvals.js";
import EntityStepApproval from "./approvals/EntityStepApproval.js";
import PushSubscription from "./content/pushSubscription.js";
import ForgotPasswordSession from "./content/forgotPasswordSession.js";
import PasswordResetToken from "./content/passwordResetToken.js";
import ProgramOption from "./program/program_options.js";
import ArisanProgram from "./program/arisan_programs.js";
import ArisanBatch from "./program/arisan_batches.js";
import ArisanParticipant from "./program/arisan_participants.js";
import Curriculum from "./training/curriculums.js";
import Material from "./training/materials.js";
import Evaluation from "./training/evaluations.js";
import MaterialNote from "./training/material_notes.js";
import Ranking from "./training/rankings.js";
import LandingService from "./landing/landing_services.js";
import LandingStats from "./landing/landing_stats.js";
import LandingAbout from "./landing/landing_about.js";
import LandingContact from "./landing/landing_contact.js";
import ContactForm from "./landing/contact_forms.js";

export default function initModels(db, sequelizeInstance, DataTypes) {
  db.MemberStatus = MemberStatus(sequelizeInstance, DataTypes);
  db.Member = Member(sequelizeInstance, DataTypes);
  db.UserRole = UserRole(sequelizeInstance, DataTypes);
  db.MemberRoleAssignment = MemberRoleAssignment(sequelizeInstance, DataTypes);
  db.MemberEmployment = MemberEmployment(sequelizeInstance, DataTypes);
  db.MemberEmergencyContact = MemberEmergencyContact(
    sequelizeInstance,
    DataTypes,
  );
  db.MemberBankAccount = MemberBankAccount(sequelizeInstance, DataTypes);
  db.MemberRegistration = MemberRegistration(sequelizeInstance, DataTypes);
  db.MembershipTermination = MembershipTermination(
    sequelizeInstance,
    DataTypes,
  );
  db.Account = Account(sequelizeInstance, DataTypes);
  db.Bill = Bill(sequelizeInstance, DataTypes);
  db.BillItem = BillItem(sequelizeInstance, DataTypes);
  db.BillType = BillType(sequelizeInstance, DataTypes);
  db.Transaction = Transaction(sequelizeInstance, DataTypes);
  db.GeneralTransaction = GeneralTransaction(sequelizeInstance, DataTypes);
  db.Savings = Savings(sequelizeInstance, DataTypes);
  db.Article = Article(sequelizeInstance, DataTypes);
  db.Notification = Notification(sequelizeInstance, DataTypes);
  db.ActivityLog = ActivityLog(sequelizeInstance, DataTypes);
  db.BusinessProfile = BusinessProfile(sequelizeInstance, DataTypes);
  db.FinancingApplication = FinancingApplication(sequelizeInstance, DataTypes);
  db.FinancingCategory = FinancingCategory(sequelizeInstance, DataTypes);
  db.FinancingTerm = FinancingTerm(sequelizeInstance, DataTypes);
  db.SukukIssue = SukukIssue(sequelizeInstance, DataTypes);
  db.SukukOrder = SukukOrder(sequelizeInstance, DataTypes);
  db.LoanProduct = LoanProduct(sequelizeInstance, DataTypes);
  db.MemberLoan = MemberLoan(sequelizeInstance);
  db.SavingsProduct = SavingsProduct(sequelizeInstance, DataTypes);
  db.SavingTarget = SavingTarget(sequelizeInstance, DataTypes);
  db.MemberSavingTarget = MemberSavingTarget(sequelizeInstance, DataTypes);
  db.MemberSavingsAccount = MemberSavingsAccount(sequelizeInstance, DataTypes);
  db.SavingsTransaction = SavingsTransaction(sequelizeInstance, DataTypes);
  db.SavingsWithdrawal = SavingsWithdrawal(sequelizeInstance, DataTypes);
  db.MidtransDisbursement = MidtransDisbursement(sequelizeInstance, DataTypes);
  db.ApprovalFlow = ApprovalFlow(sequelizeInstance, DataTypes);
  db.ApprovalStep = ApprovalStep(sequelizeInstance, DataTypes);
  db.ApprovalStatus = ApprovalStatus(sequelizeInstance, DataTypes);
  db.Approval = Approval(sequelizeInstance, DataTypes);
  db.EntityStepApproval = EntityStepApproval(sequelizeInstance, DataTypes);
  db.PushSubscription = PushSubscription(sequelizeInstance, DataTypes);
  db.ForgotPasswordSession = ForgotPasswordSession(
    sequelizeInstance,
    DataTypes,
  );
  db.PasswordResetToken = PasswordResetToken(sequelizeInstance, DataTypes);
  db.ProgramOption = ProgramOption(sequelizeInstance, DataTypes);
  db.ArisanProgram = ArisanProgram(sequelizeInstance, DataTypes);
  db.ArisanBatch = ArisanBatch(sequelizeInstance, DataTypes);
  db.ArisanParticipant = ArisanParticipant(sequelizeInstance, DataTypes);
  db.Curriculum = Curriculum(sequelizeInstance, DataTypes);
  db.Material = Material(sequelizeInstance, DataTypes);
  db.Evaluation = Evaluation(sequelizeInstance, DataTypes);
  db.MaterialNote = MaterialNote(sequelizeInstance, DataTypes);
  db.Ranking = Ranking(sequelizeInstance, DataTypes);
  db.LandingService = LandingService(sequelizeInstance, DataTypes);
  db.LandingStats = LandingStats(sequelizeInstance, DataTypes);
  db.LandingAbout = LandingAbout(sequelizeInstance, DataTypes);
  db.LandingContact = LandingContact(sequelizeInstance, DataTypes);
  db.ContactForm = ContactForm(sequelizeInstance, DataTypes);
}
