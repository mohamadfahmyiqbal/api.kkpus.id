// 📁 models/billing/transactions.js

import { Sequelize } from "sequelize";

const Transaction = (sequelize) => {
  const { DataTypes } = Sequelize;

  const TransactionModel = sequelize.define(
    "transactions",
    {
      transaction_id: {
        type: DataTypes.BIGINT, // PK (Otomatis BIGINT)
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      member_id: {
        type: DataTypes.BIGINT, // ✅ BIGINT (Mencocokkan members.member_id)
        allowNull: false,
      },
      bill_id: {
        type: DataTypes.BIGINT, // ✅ BIGINT (Mencocokkan bills.bill_id)
        allowNull: false,
      },
      midtrans_order_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true, // Harus unik
      },
      midtrans_transaction_id: {
        type: DataTypes.STRING(100),
        allowNull: true, // Diisi saat Midtrans callback
      },
      tx_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "MIDTRANS_SNAP",
      },
      tx_category: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "MIDTRANS_SNAP",
      },
      payment_method: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      settlement_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(
          "PENDING",
          "PAID",
          "EXPIRED",
          "CANCELED",
          "FAILED"
        ),
        allowNull: false,
        defaultValue: "PENDING",
      },
      status_message: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      midtrans_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  return TransactionModel;
};

export default Transaction;
