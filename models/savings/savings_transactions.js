// 📁 src/models/savings/savings_transactions.js

import { DataTypes } from "sequelize";

const SavingsTransaction = (sequelize) => {
  const SavingsTransactionModel = sequelize.define(
    "SavingsTransaction",
    {
      // savings_tx_id: bigint (Primary Key)
      savings_tx_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      // savings_account_id: bigint (Foreign Key ke tabel accounts)
      savings_account_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      // tx_type: varchar(50) (Contoh: 'SETORAN', 'TARIKAN', 'ADMIN')
      tx_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      // amount: decimal(18,2)
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      // tx_datetime: datetime
      tx_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      // method: varchar(50) (Contoh: 'TRANSFER', 'MIDTRANS', 'CASH')
      method: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // bank_name: varchar(100)
      bank_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      // bank_account_no: varchar(50)
      bank_account_no: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // approved_status: varchar(50) (Contoh: 'APPROVED', 'PENDING', 'REJECTED')
      approved_status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "PENDING",
      },
      // invoice_id: bigint (Relasi ke tabel bills/invoices)
      invoice_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
    },
    {
      // Konfigurasi Tabel
      tableName: "savings_transactions",
      timestamps: true, // Mengaktifkan created_at & updated_at
      createdAt: "created_at", // Mapping ke nama kolom database
      updatedAt: "updated_at", // Mapping ke nama kolom database
      underscored: true,
      // Indeks untuk mempercepat pencarian berdasarkan akun
      indexes: [
        { fields: ["savings_account_id"] },
        { fields: ["invoice_id"] },
        { fields: ["approved_status"] },
      ],
    }
  );

  /**
   * Catatan: Asosiasi (Relasi) sekarang didefinisikan secara terpusat
   * di src/models/index.js untuk menjaga struktur yang bersih.
   */

  return SavingsTransactionModel;
};

export default SavingsTransaction;
