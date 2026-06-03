// models/approvals/approval_steps.js
import { Sequelize } from "sequelize";

const ApprovalStep = (sequelize) => {
  const { DataTypes } = Sequelize;

  const Model = sequelize.define(
    "ApprovalStep",
    {
      approval_step_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      approval_flow_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      step_order: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      role_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      step_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      tableName: "approval_steps",
      freezeTableName: true,
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["approval_flow_id", "step_order"],
        },
      ],
    }
  );

  return Model;
};

export default ApprovalStep;
