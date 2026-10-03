// models/associations/memberAssociations.js
export default function defineMemberAssociations(db) {
  // Member & Status
  db.MemberStatus.hasMany(db.Member, { foreignKey: "status_id", as: "member" });
  db.Member.belongsTo(db.MemberStatus, { foreignKey: "status_id", as: "status" });

  // Member & Roles
  db.Member.hasMany(db.MemberRoleAssignment, { foreignKey: "member_id", as: "roleAssignments" });
  db.MemberRoleAssignment.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  db.UserRole.hasMany(db.MemberRoleAssignment, { foreignKey: "role_id", as: "assignments" });
  db.MemberRoleAssignment.belongsTo(db.UserRole, { foreignKey: "role_id", as: "role" });

  // Member & Account / Financial Summary
  db.Member.hasOne(db.Account, { foreignKey: "member_id", as: "account" });
  db.Account.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  db.Member.hasOne(db.MemberFinancialSummary, { foreignKey: "member_id", as: "financial_summary" });
  db.MemberFinancialSummary.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  // Member & Registration
  db.Member.hasMany(db.MemberRegistration, { foreignKey: "member_id", as: "registration" });
  db.MemberRegistration.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  // Member & Details (Bank Accounts, Employment, Emergency Contacts)
  db.Member.hasMany(db.MemberBankAccount, { foreignKey: "member_id", as: "bankAccounts" });
  db.MemberBankAccount.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  db.Member.hasMany(db.MemberEmployment, { foreignKey: "member_id", as: "employments" });
  db.MemberEmployment.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  db.Member.hasMany(db.MemberEmergencyContact, { foreignKey: "member_id", as: "emergencyContacts" });
  db.MemberEmergencyContact.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  // Member & Push Subscription
  db.Member.hasMany(db.PushSubscription, { foreignKey: "member_id", as: "pushSubscriptions" });
  db.PushSubscription.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  // Forgot Password & Reset Tokens
  db.Member.hasMany(db.ForgotPasswordSession, { foreignKey: "member_id", as: "forgotPasswordSessions" });
  db.ForgotPasswordSession.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  db.ForgotPasswordSession.hasMany(db.PasswordResetToken, {
    foreignKey: "session_id",
    as: "resetTokens",
    sourceKey: "session_id"
  });
  db.PasswordResetToken.belongsTo(db.ForgotPasswordSession, {
    foreignKey: "session_id",
    as: "session",
    targetKey: "session_id"
  });
  db.PasswordResetToken.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });
}
