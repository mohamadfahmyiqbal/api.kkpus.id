// 📁 models/core/accounts.js

import { Sequelize } from "sequelize";
import { syncFinancialSummary } from "../../services/financialSummarySyncService.js";

const Account = (sequelize) => {
  const { DataTypes } = Sequelize;

  const AccountModel = sequelize.define(
    "accounts",
    {
      account_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      member_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      account_type: {
        type: DataTypes.STRING(50), // Sesuai: varchar(50)
        allowNull: false,
      },
      account_no: {
        type: DataTypes.STRING(50), // Sesuai: varchar(50)
        allowNull: true,
      },
      open_date: {
        type: DataTypes.DATEONLY, // Sesuai: date
        allowNull: true,
      },
      akad_type: {
        type: DataTypes.STRING(50), // Sesuai: varchar(50)
        allowNull: true,
      },
      current_balance: {
        type: DataTypes.DECIMAL(18, 2), // Sesuai: decimal(18,2)
        allowNull: false,
        defaultValue: 0.0,
      },
    },
    {
      tableName: "accounts",
      freezeTableName: true,
      timestamps: true,
      createdAt: "created_at", // Sesuai skema Anda
      updatedAt: "updated_at", // Sesuai skema Anda
    }
  );

  AccountModel.addHook('afterSave', async (instance, options) => {
    setImmediate(() => syncFinancialSummary(sequelize, instance.member_id));
  });

  AccountModel.addHook('afterDestroy', async (instance, options) => {
    setImmediate(() => syncFinancialSummary(sequelize, instance.member_id));
  });

  return AccountModel;
};

export default Account;
