// 📁 src/models/core/accounts.js

import { DataTypes } from "sequelize";

const Account = (sequelize) => {
  const AccountModel = sequelize.define(
    "Account",
    {
      // account_id: bigint
      account_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      // member_id: bigint
      member_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      // account_type: varchar(50)
      account_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      // account_no: varchar(50)
      account_no: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true, // Nomor rekening biasanya unik
      },
      // open_date: date
      open_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      // akad_type: varchar(50)
      akad_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // current_balance: decimal(18,2)
      current_balance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      // created_at & updated_at dihandle oleh timestamps: true
    },
    {
      tableName: "accounts",
      timestamps: true,
      createdAt: "created_at", // mapping ke created_at di tabel
      updatedAt: "updated_at", // mapping ke updated_at di tabel
      underscored: true,
      freezeTableName: true,
    }
  );

  return AccountModel;
};

export default Account;
