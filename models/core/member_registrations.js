// models/member_registrations.js
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
        allowNull: true, // Disesuaikan dengan kebutuhan Anda
      },
      full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      nik_ktp: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      address_ktp: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      member_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      ktp_photo_path: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      selfie_photo_path: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      registration_status: {
        type: DataTypes.ENUM(
          "verifikasi_dokumen",
          "wawancara",
          "verifikasi_final",
          "pembayaran",
          "selesai",
          "menunggu_pembayaran"
        ),
        allowNull: false,
        defaultValue: "verifikasi_dokumen",
        comment: "Status proses pendaftaran",
      },
      // 🔥 DITAMBAHKAN: Kolom 'registered_at'
      registered_at: {
        type: DataTypes.DATE, // Menggunakan DataTypes.DATE untuk tipe datetime
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: "Tanggal/waktu pendaftaran pertama kali dikirim",
      },
      approval_flow_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "Foreign Key ke approval_flows.approval_flow_id",
      },
      current_step_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "Foreign Key ke approval_steps.approval_step_id saat ini",
      },
      final_status: {
        type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
        allowNull: false,
        defaultValue: "PENDING",
        comment: "Status akhir pendaftaran",
      },
      // Kolom 'createdAt' dan 'updatedAt' akan ditangani oleh 'timestamps: true' di opsi model.
    },
    {
      freezeTableName: true,
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["member_id", "final_status"],
          where: { final_status: { [Sequelize.Op.ne]: "REJECTED" } }, // Hanya satu PENDING/APPROVED per member
          name: "unique_active_registration_per_member",
        },
      ],
    }
  );

  // Asosiasi (jika ada)
  MemberRegistrationModel.associate = (models) => {
    MemberRegistrationModel.belongsTo(models.Member, {
      foreignKey: "member_id",
      as: "member",
    });
    // Tambahkan asosiasi lain ke ApprovalFlow, ApprovalStep, dll.
  };

  return MemberRegistrationModel;
};

export default MemberRegistration;
