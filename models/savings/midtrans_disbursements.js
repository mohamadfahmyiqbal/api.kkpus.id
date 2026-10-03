// 📁 src/models/savings/midtrans_disbursements.js
import { DataTypes } from "sequelize";

const MidtransDisbursement = (sequelize) => {
  return sequelize.define(
    "MidtransDisbursement",
    {
      disbursement_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      withdrawal_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "savings_withdrawals",
          key: "withdrawal_id",
        },
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
        allowNull: false,
      },
      request_payload: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      response_data: {
        type: DataTypes.JSON,
      },
      error_message: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED"),
        defaultValue: "PENDING",
      },
      midtrans_transaction_id: {
        type: DataTypes.UUID,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "midtrans_disbursements",
      timestamps: false,
      underscored: true,
    }
  );
};

export default MidtransDisbursement;