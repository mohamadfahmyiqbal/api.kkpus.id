// models/approvals.js

import { Sequelize } from "sequelize";

const Approvals = (sequelize) => {
  const { DataTypes } = Sequelize;

  const ApprovalsModel = sequelize.define(
    "approvals",
    {
      approval_id: {
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
      approval_step_id: {
        // FK ke tabel approval_steps
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      approver_member_id: {
        // FK ke tabel users/members (Siapa yang menyetujui/menolak)
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "ID anggota/admin yang membuat keputusan",
      },
      action: {
        type: DataTypes.ENUM("APPROVE", "REJECT"),
        allowNull: false,
        comment: "Keputusan yang diambil",
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Catatan atau alasan penolakan",
      },
      approved_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Waktu keputusan dibuat",
      },
      // Kolom `created_at` dan `updated_at` otomatis dari `timestamps: true`
    },
    {
      timestamps: true,
      tableName: "approvals",
      // Untuk memastikan satu langkah hanya disetujui sekali oleh satu approver (opsional)
      // indexes: [{ unique: true, fields: ['approval_step_id', 'approver_member_id'] }]
    }
  );

  ApprovalsModel.associate = (models) => {
    // Log milik satu Flow
    ApprovalsModel.belongsTo(models.ApprovalFlows, {
      foreignKey: "approval_flow_id",
      as: "flow",
    });
    // Log milik satu Langkah
    ApprovalsModel.belongsTo(models.ApprovalSteps, {
      foreignKey: "approval_step_id",
      as: "step",
    });
    // Siapa yang membuat keputusan
    ApprovalsModel.belongsTo(models.Members, {
      // Asumsi: Members/Users adalah nama model untuk approver
      foreignKey: "approver_member_id",
      as: "approver",
    });
  };

  return ApprovalsModel;
};

export default Approvals;
