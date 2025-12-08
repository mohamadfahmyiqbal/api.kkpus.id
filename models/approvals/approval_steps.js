// models/approval_steps.js

import { Sequelize } from "sequelize";

const ApprovalSteps = (sequelize) => {
  const { DataTypes } = Sequelize;

  const ApprovalStepsModel = sequelize.define(
    "approval_steps",
    {
      approval_step_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      approval_flow_id: {
        // FK ke tabel approval_flows
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      step_order: {
        // KRUSIAL untuk dinamis: 1, 2, 3, dst.
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Urutan langkah persetujuan",
      },
      role_id: {
        // FK ke tabel user_roles
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Peran yang harus menyetujui langkah ini",
      },
      step_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nama langkah (e.g., "Persetujuan Pengawas")',
      },
      // Kolom `created_at` dan `updated_at` otomatis dari `timestamps: true`
    },
    {
      timestamps: true,
      tableName: "approval_steps",
    }
  );

  ApprovalStepsModel.associate = (models) => {
    // Langkah adalah bagian dari Flow (Induk)
    ApprovalStepsModel.belongsTo(models.ApprovalFlows, {
      foreignKey: "approval_flow_id",
      as: "flow",
    });
    // Langkah disetujui oleh Role tertentu
    ApprovalStepsModel.belongsTo(models.UserRoles, {
      // Asumsi: UserRoles adalah nama model untuk peran
      foreignKey: "role_id",
      as: "requiredRole",
    });
    // Langkah dapat memiliki banyak Log Approval (walaupun idealnya hanya satu log per langkah)
    ApprovalStepsModel.hasMany(models.Approvals, {
      foreignKey: "approval_step_id",
      as: "approvalLogs",
    });
  };

  return ApprovalStepsModel;
};

export default ApprovalSteps;
