import { Sequelize } from "sequelize";

const MembershipTermination = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define(
    "membership_terminations",
    {
      termination_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      member_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      supporting_document_path: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED", "COMPLETED"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      approval_flow_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      current_step_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      receipt_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      payment_status: {
        type: DataTypes.ENUM("PENDING", "PAID", "FAILED"),
        allowNull: true,
      },
      submitted_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "membership_terminations",
      timestamps: true,
      underscored: true,
    }
  );
};

export default MembershipTermination;
