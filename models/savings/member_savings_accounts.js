// src/models/savings/member_savings_accounts.js
import { syncFinancialSummary } from "../../services/financialSummarySyncService.js";

export default (sequelize) => {
  const { DataTypes } = sequelize.Sequelize;

  const MemberSavingsAccountModel = sequelize.define("member_savings_accounts", {
    savings_account_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    member_id: { type: DataTypes.UUID, allowNull: false },
    savings_product_id: { type: DataTypes.UUID },
    account_no: { type: DataTypes.STRING }, // Sesuai kolom database Anda
    account_type: { type: DataTypes.STRING }, // Sesuai kolom database Anda
    open_date: { type: DataTypes.DATEONLY },
    nominal: { type: DataTypes.DECIMAL(18, 2) },
    current_balance: { type: DataTypes.DECIMAL(18, 2) },
  }, { 
    freezeTableName: true, 
    timestamps: true,
    // Mapping agar Sequelize mencari 'created_at' bukan 'createdAt'
    createdAt: 'created_at', 
    updatedAt: 'updated_at'
  });

  MemberSavingsAccountModel.addHook('afterSave', async (instance, options) => {
    setImmediate(() => syncFinancialSummary(sequelize, instance.member_id));
  });

  MemberSavingsAccountModel.addHook('afterDestroy', async (instance, options) => {
    setImmediate(() => syncFinancialSummary(sequelize, instance.member_id));
  });

  return MemberSavingsAccountModel;
};