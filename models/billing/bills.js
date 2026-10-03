// src/models/bills.js
import { Sequelize } from "sequelize";

const Bill = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define(
    "bills",
    {
      bill_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      member_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      bill_type_id: {
        type: DataTypes.UUID,
        allowNull: true,
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
    },
    {
      tableName: "bills",
      // Mengaktifkan underscored agar Sequelize secara otomatis memetakan 
      // camelCase (JS) ke snake_case (DB) untuk semua field otomatis.
      underscored: true,
      timestamps: true,
      // Mapping manual tetap dipertahankan untuk keamanan redundansi
      createdAt: "created_at",
      updatedAt: "updated_at",
      // Explicit mapping untuk menghindari field 'id' default
      omitNull: true
    }
  );
};

export default Bill;