// 📁 models/approvals.js (FINAL & LENGKAP)

import { Sequelize } from "sequelize";

const Approval = (sequelize) => {
  const { DataTypes } = Sequelize;

  const ApprovalModel = sequelize.define(
    "Approval", // Nama Model: Approval
    {
      approval_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      approval_step_id: {
        type: DataTypes.BIGINT,
        allowNull: false, // Foreign Key ke approval_steps
      },
      approver_member_id: {
        type: DataTypes.BIGINT,
        allowNull: true, // Foreign Key ke members.member_id
      },
      decision: {
        type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED", "SKIPPED"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      decision_datetime: {
        type: DataTypes.DATE,
        allowNull: true, // Null sampai ada keputusan
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // ✅ TAMBAHAN KRITIS UNTUK SISTEM GENERIK
      entity_ref: {
        type: DataTypes.STRING(50), // Contoh: 'member_registration', 'financing_application'
        allowNull: false, // Wajib diisi!
      },
      entity_id: {
        type: DataTypes.BIGINT, // ID dari tabel entitas (e.g., registration_id)
        allowNull: false, // Wajib diisi!
      },
      // Kolom untuk created_at dan updated_at (timestamps: true)
    },
    {
      tableName: "approvals", // Nama Tabel di database
      freezeTableName: true,
      timestamps: true, // Mengaktifkan created_at dan updated_at
    }
  );

  ApprovalModel.associate = (models) => {
    // Approval milik satu Step
    ApprovalModel.belongsTo(models.ApprovalStep, {
      foreignKey: "approval_step_id",
      as: "step",
    });

    // Approval disetujui oleh satu Member
    ApprovalModel.belongsTo(models.Member, {
      foreignKey: "approver_member_id",
      as: "approver",
    });

    // CATATAN: Relasi ke MemberRegistration, FinancingApplication, dsb. tidak dibuat di sini
    // karena Approval adalah tabel generik (menggunakan entity_ref dan entity_id)
  };

  return ApprovalModel;
};

export default Approval;
