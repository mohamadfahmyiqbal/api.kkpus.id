// 📁 models/approvals/approval_flows.js
import { Sequelize } from "sequelize";

const ApprovalFlow = (sequelize) => {
  const { DataTypes } = Sequelize;

  const ApprovalFlowModel = sequelize.define(
    "approval_flows",
    {
      approval_flow_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      flow_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      entity_ref: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      entity_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
      },
    },
    {
      freezeTableName: true,
      timestamps: true, // Sequelize akan otomatis map: createdAt -> created_at, updatedAt -> updated_at
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  ApprovalFlowModel.associate = (models) => {
    ApprovalFlowModel.hasMany(models.ApprovalStep, {
      foreignKey: "approval_flow_id",
      as: "steps",
    });
  };

  return ApprovalFlowModel;
};

export default ApprovalFlow;