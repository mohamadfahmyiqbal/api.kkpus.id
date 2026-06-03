// 📁 src/models/savings/savings_withdrawals.js
import { DataTypes } from "sequelize";

const SavingsWithdrawal = (sequelize) => {
  return sequelize.define(
    "SavingsWithdrawal",
    {
      withdrawal_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      savings_account_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "member_savings_accounts",
          key: "savings_account_id",
        },
      },
      member_id: {
        type: DataTypes.BIGINT,
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
        type: DataTypes.BIGINT,
        references: {
          model: "approval_flows",
          key: "approval_flow_id",
        },
      },
      current_step_id: {
        type: DataTypes.BIGINT,
        references: {
          model: "approval_steps",
          key: "approval_step_id",
        },
      },
      invoice_id: {
        type: DataTypes.BIGINT,
      },
      midtrans_transaction_id: {
        type: DataTypes.STRING(100),
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
};

export default SavingsWithdrawal;