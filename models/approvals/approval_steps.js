import { Sequelize } from "sequelize";

const ApprovalStep = (sequelize) => {
  const { DataTypes } = Sequelize;

  const ApprovalStepModel = sequelize.define(
    "approval_steps",
    {
      approval_step_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      approval_flow_id: {
        type: DataTypes.BIGINT,
        allowNull: false, // Foreign Key ke approval_flows
      },
      step_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role_id: {
        type: DataTypes.BIGINT,
        allowNull: false, // Foreign Key ke user_roles.role_id
      },
      step_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true, // Mengaktifkan created_at dan updated_at
    }
  );

  ApprovalStepModel.associate = (models) => {
    // Setiap Step milik satu Flow
    ApprovalStepModel.belongsTo(models.ApprovalFlow, {
      foreignKey: "approval_flow_id",
      as: "flow",
    });
    // Setiap Step membutuhkan Role tertentu untuk menyetujui
    ApprovalStepModel.belongsTo(models.UserRole, { // Mengacu pada models/user_roles.js
      foreignKey: "role_id",
      as: "required_role",
    });
    // Satu Step bisa memiliki banyak persetujuan (approvals)
    ApprovalStepModel.hasMany(models.Approval, {
      foreignKey: "approval_step_id",
      as: "approvals",
    });
  };

  return ApprovalStepModel;
};

export default ApprovalStep;