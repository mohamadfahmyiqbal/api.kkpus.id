// 📁 src/models/bills.js (FINAL & REKOMENDASI FOREIGN KEY)

import { Sequelize } from "sequelize";

const Bill = (sequelize) => {
  const { DataTypes } = Sequelize;

  const BillModel = sequelize.define(
    "bills",
    {
      bill_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      // 🚨 PENAMBAHAN 1: Foreign Key ke BillType (untuk relasi Bill -> BillType)
      bill_type_id: {
        type: DataTypes.BIGINT, 
        allowNull: true, 
      },
      // 🚨 PENAMBAHAN 2: Foreign Key ke Member (untuk relasi Bill -> Member)
      member_id: {
        type: DataTypes.INTEGER, // Asumsi Member PK adalah INTEGER
        allowNull: false, 
      },
      member_no: {
        type: DataTypes.STRING(20), // Tetap dipertahankan untuk referensi cepat
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2), 
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATE, 
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "pending", 
      },
      // Kolom timestamps (createdAt, updatedAt) otomatis ditambahkan oleh Sequelize
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  return BillModel;
};

export default Bill;