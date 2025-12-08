// models/approval_flows.js

import { Sequelize } from "sequelize";

const ApprovalFlows = (sequelize) => {
  const { DataTypes } = Sequelize;

  const ApprovalFlowsModel = sequelize.define(
    "approval_flows",
    {
      approval_flow_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      flow_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment:
          'Nama deskriptif untuk flow ini (e.g., "Pendaftaran Anggota Baru")',
      },
      entity_ref: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment:
          'Nama tabel entitas yang disetujui (e.g., "member_registrations")',
      },
      entity_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment:
          "ID entitas yang disetujui (e.g., registration_id dari member_registrations)",
      },
      // Kolom `created_at` dan `updated_at` otomatis dari `timestamps: true`
    },
    {
      timestamps: true,
      tableName: "approval_flows",
    }
  );

  ApprovalFlowsModel.associate = (models) => {
    // Satu Flow memiliki banyak Langkah
    ApprovalFlowsModel.hasMany(models.ApprovalSteps, {
      foreignKey: "approval_flow_id",
      as: "steps",
    });
    // Satu Flow memiliki banyak Log Approval
    ApprovalFlowsModel.hasMany(models.Approvals, {
      foreignKey: "approval_flow_id",
      as: "logs",
    });
    // Relasi ke tabel yang diapprove (misal: member_registrations)
    // Relasi ini bersifat dinamis (polimorfik) dan biasanya dikelola di sisi kode.
  };

  return ApprovalFlowsModel;
};

export default ApprovalFlows;
