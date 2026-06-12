// models/approvals/approval_statuses.js
import { Sequelize } from "sequelize";

const ApprovalStatus = (sequelize) => {
  const { DataTypes } = Sequelize;

  const Model = sequelize.define(
    "ApprovalStatus",
    {
      approval_status_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        
        allowNull: false,
      },
      approval_flow_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      status_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      is_active: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 1,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at", // Nama kolom fisik di DB
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at", // Nama kolom fisik di DB
      },
    },
    {
      tableName: "approval_statuses",
      freezeTableName: true,
      timestamps: true,
      underscored: false, // Dimatikan agar tidak memaksa snake_case pada timestamps
    }
  );

  return Model;
};

export default ApprovalStatus;