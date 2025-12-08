// src/models/bills.js

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
      member_no: {
        type: DataTypes.STRING(20), // Member_no sesuai dengan data user: "000512251717"
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2), // Menyimpan jumlah dengan dua desimal
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATE, // Batas waktu pembayaran
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "pending", // Status: 'pending', 'paid', 'cancelled'
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
