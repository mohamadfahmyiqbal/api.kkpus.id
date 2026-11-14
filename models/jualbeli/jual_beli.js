// models/transaction/general_transactions.js
import { DataTypes } from "sequelize";

export default function GeneralTransaction(sequelize, Sequelize) {
  return sequelize.define(
    "GeneralTransaction",
    {
      transaction_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      member_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "members",
          key: "member_id",
        },
      },
      transaction_type: {
        type: DataTypes.ENUM("PEMBELIAN", "PEMBAYARAN", "TOPUP", "LAINNYA"),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      item_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED", "COMPLETED"),
        defaultValue: "PENDING",
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
      tableName: "general_transactions",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          name: "idx_gt_tx_type",
          fields: ["transaction_type"],
        },
        {
          name: "idx_gt_status",
          fields: ["status"],
        },
        {
          name: "idx_gt_created_at",
          fields: ["created_at"],
        },
      ],
    },
  );
}
