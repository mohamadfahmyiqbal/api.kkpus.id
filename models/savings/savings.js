// models/savings/savings.js
import { DataTypes } from "sequelize";

export default function Savings(sequelize, Sequelize) {
  return sequelize.define(
    "Savings",
    {
      savings_id: {
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
      savings_type: {
        type: DataTypes.ENUM("SUKARELA", "WAJIB", "BERJANGKA"),
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
      transaction_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED", "COMPLETED"),
        defaultValue: "PENDING",
      },
      approval_flow_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "approval_flows",
          key: "approval_flow_id",
        },
      },
      current_step_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "approval_steps",
          key: "approval_step_id",
        },
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
      tableName: "savings",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["member_id"],
        },
        {
          fields: ["savings_type"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["transaction_date"],
        },
        {
          fields: ["created_at"],
        },
      ],
    },
  );
}
