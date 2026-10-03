// 📁 src/models/savings/savings_withdrawals.js
import { DataTypes } from "sequelize";
import { syncFinancialSummary } from "../../services/financialSummarySyncService.js";

const SavingsWithdrawal = (sequelize) => {
  const SavingsWithdrawalModel = sequelize.define(
    "SavingsWithdrawal",
    {
      withdrawal_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      savings_account_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      member_saving_target_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      member_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "members",
          key: "member_id",
        },
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
      },
      method: {
        type: DataTypes.STRING(50),
      },
      bank_name: {
        type: DataTypes.STRING(100),
      },
      bank_account_no: {
        type: DataTypes.STRING(50),
      },
      request_datetime: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.STRING(50),
      },
      approval_flow_id: {
        type: DataTypes.UUID,
        references: {
          model: "approval_flows",
          key: "approval_flow_id",
        },
      },
      current_step_id: {
        type: DataTypes.UUID,
        references: {
          model: "approval_steps",
          key: "approval_step_id",
        },
      },
      invoice_id: {
        type: DataTypes.UUID,
      },
      midtrans_transaction_id: {
        type: DataTypes.UUID,
      },
      transfer_proof_path: {
        type: DataTypes.STRING(255),
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "savings_withdrawals",
      timestamps: false,
      underscored: true,
    }
  );

  SavingsWithdrawalModel.addHook('afterSave', async (instance, options) => {
    setImmediate(() => syncFinancialSummary(sequelize, instance.member_id));
  });

  SavingsWithdrawalModel.addHook('afterDestroy', async (instance, options) => {
    setImmediate(() => syncFinancialSummary(sequelize, instance.member_id));
  });

  return SavingsWithdrawalModel;
};

export default SavingsWithdrawal;