// PATH: models/approval.js

import { Sequelize } from "sequelize";

const Approval = (sequelize) => {
  const { DataTypes } = Sequelize;

  const ApprovalModel = sequelize.define(
    "Approval",
    {
      approval_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      // FIX: Menambahkan approval_flow_id yang sebelumnya hilang dari model
      approval_flow_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      approval_step_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      approver_member_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      decision: {
        type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED", "CANCELLED"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      decision_datetime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      entity_ref: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      entity_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "approvals",
      freezeTableName: true,
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at', // Perbaikan typo minor: updated_at -> updatedAt (Sequelize mapping)
    }
  );

  ApprovalModel.associate = (models) => {
    // FIX: Menambahkan asosiasi ke ApprovalFlow
    ApprovalModel.belongsTo(models.ApprovalFlow, {
      foreignKey: "approval_flow_id",
      as: "flow",
    });

    ApprovalModel.belongsTo(models.ApprovalStep, {
      foreignKey: "approval_step_id",
      as: "step",
    });

    ApprovalModel.belongsTo(models.Member, {
      foreignKey: "approver_member_id",
      as: "approver",
    });
  };

  return ApprovalModel;
};

export default Approval;