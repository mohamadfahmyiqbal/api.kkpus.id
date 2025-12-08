import { Sequelize } from "sequelize";

const MemberRegistration = (sequelize) => {
  const { DataTypes } = Sequelize;

  const MemberRegistrationModel = sequelize.define(
    "member_registrations",
    {
      registration_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      member_id: {
        // FK ke tabel members
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      // Data input dari form registrasi:
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      registration_status: {
        type: DataTypes.ENUM(
          "verifikasi_dokumen",
          "verifikasi_pendaftaran",
          "aktif"
        ),
        allowNull: false,
        defaultValue: "verifikasi_dokumen",
      },
      registered_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },

      // =======================================================
      // ✅ KOLOM BARU UNTUK APPROVAL DINAMIS
      // =======================================================
      approval_flow_id: {
        // Tautan ke proses approval (FK ke approval_flows)
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "Foreign Key ke approval_flows.approval_flow_id",
      },
      current_step_id: {
        // Tautan ke langkah approval yang sedang berjalan (FK ke approval_steps)
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "Foreign Key ke approval_steps.approval_step_id saat ini",
      },
      final_status: {
        // Status akhir dari seluruh flow
        type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
        allowNull: false,
        defaultValue: "PENDING",
        comment: "Status akhir proses persetujuan",
      },
      // =======================================================
    },
    {
      timestamps: true, // Menyimpan createdAt dan updatedAt
      tableName: "member_registrations",
    }
  );

  // =======================================================
  // ✅ DEFINISI ASOSIASI (Relasi)
  // =======================================================
  MemberRegistrationModel.associate = (models) => {
    // 1. Relasi ke ApprovalFlows (Flow Induk)
    MemberRegistrationModel.belongsTo(models.ApprovalFlows, {
      foreignKey: "approval_flow_id",
      as: "approvalFlow",
      onDelete: "SET NULL",
    });

    // 2. Relasi ke ApprovalSteps (Langkah Saat Ini)
    MemberRegistrationModel.belongsTo(models.ApprovalSteps, {
      foreignKey: "current_step_id",
      as: "currentStep",
      onDelete: "SET NULL",
    });

    // 3. Relasi ke Members (setelah pendaftaran disetujui)
    MemberRegistrationModel.belongsTo(models.Members, {
      foreignKey: "member_id",
      as: "member",
      onDelete: "SET NULL",
    });
  };
  // =======================================================

  return MemberRegistrationModel;
};

export default MemberRegistration;
