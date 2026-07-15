import { Sequelize } from "sequelize";
import { syncFinancialSummary } from "../../services/financialSummarySyncService.js";

const MemberSavingTarget = (sequelize) => {
  const { DataTypes } = Sequelize;

  const MemberSavingTargetModel = sequelize.define("member_saving_targets", {
    member_saving_target_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    saving_target_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    start_period_month: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    start_period_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    current_balance: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: 0,
    },
    current_step_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    approval_flow_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'PENDING',
    },
    target_amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    term_months: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    monthly_deposit: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  MemberSavingTargetModel.addHook('afterSave', async (instance, options) => {
    setImmediate(() => syncFinancialSummary(sequelize, instance.member_id));
  });

  MemberSavingTargetModel.addHook('afterDestroy', async (instance, options) => {
    setImmediate(() => syncFinancialSummary(sequelize, instance.member_id));
  });

  return MemberSavingTargetModel;
};

export default MemberSavingTarget;
