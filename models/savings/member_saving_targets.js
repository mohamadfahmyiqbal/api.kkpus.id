import { Sequelize } from "sequelize";

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
  }, { 
    freezeTableName: true, 
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return MemberSavingTargetModel;
};

export default MemberSavingTarget;
