// 📁 models/billing/transactions.js

import { Sequelize } from "sequelize";

const Transaction = (sequelize) => {
  const { DataTypes } = Sequelize;

  const TransactionModel = sequelize.define(
    "transactions",
    {
      transaction_id: {
        type: DataTypes.BIGINT.UNSIGNED, // 🚨 TAMBAHKAN .UNSIGNED
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      member_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      bill_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      midtrans_order_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      midtrans_transaction_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      midtrans_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      tx_type: {
        type: DataTypes.ENUM("SETORAN", "PENARIKAN"),
        allowNull: false,
        defaultValue: "SETORAN",
      },
      is_ledger_recorded: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Digunakan untuk menandai apakah sudah masuk ke saldo accounts
      },
      tx_category: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      payment_type: {
        // Kolom baru
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      payment_method: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      va_number: {
        // Kolom baru
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      bank_name: {
        // Kolom baru
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.0,
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
        defaultValue: "PENDING",
      },
      fraud_status: {
        // Kolom baru
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      status_message: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      pdf_url: {
        // Kolom baru
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "transactions",
      freezeTableName: true,
      timestamps: true,
      createdAt: "created_at", // Penyesuaian ke snake_case
      updatedAt: "updated_at", // Penyesuaian ke snake_case
    }
  );

  return TransactionModel;
};

export default Transaction;
