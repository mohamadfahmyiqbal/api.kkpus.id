// PATH: controllers/core/approvals/approvalEntityConfigs.js

export const EntityConfigs = {
  members: { 
    modelName: "MemberRegistration", 
    pk: "registration_id", 
    memberField: "member_id", 
    statusField: "final_status" 
  },
  financing_applications: { 
    modelName: "FinancingApplication", 
    pk: "financing_id", 
    memberField: "member_id", 
    statusField: "status" 
  },
  savings_withdrawal: { 
    modelName: "SavingsWithdrawal", 
    pk: "withdrawal_id", 
    memberField: "member_id", 
    statusField: "status" 
  },
  exit_requests: { 
    modelName: "MembershipTermination", 
    pk: "termination_id", 
    memberField: "member_id", 
    statusField: "status" 
  },
  tabungan_withdrawals: { 
    modelName: "SavingsWithdrawal", 
    pk: "withdrawal_id", 
    memberField: "member_id", 
    statusField: "status" 
  },
  transactions: { 
    modelName: "Transaction", 
    pk: "transaction_id", 
    memberField: "member_id", 
    statusField: "status" 
  },
  investments: { 
    modelName: "SukukOrder", 
    pk: "order_id", 
    memberField: "member_id", 
    statusField: "status" 
  },
  member_saving_targets: { 
    modelName: "MemberSavingTarget", 
    pk: "member_saving_target_id", 
    memberField: "member_id", 
    statusField: "status" 
  },
};
