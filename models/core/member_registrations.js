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
   // PERUBAHAN: Mengganti 'name' menjadi 'full_name'
   full_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
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
   // PENAMBAHAN: nik_ktp
   nik_ktp: {
    type: DataTypes.STRING(30),
    allowNull: true,
   },

   // KOLOM TAMBAHAN YANG DIBUTUHKAN OLEH submitRegistration.js:
   address_ktp: { // Diambil dari submitRegistration.js
    type: DataTypes.TEXT,
    allowNull: true,
   },
   member_type: { // Diambil dari submitRegistration.js
    type: DataTypes.ENUM("calon", "reguler", "alb"),
    allowNull: false,
    defaultValue: "calon",
   },
   ktp_photo_path: { // Diambil dari submitRegistration.js
    type: DataTypes.STRING(255),
    allowNull: true,
   },
   selfie_photo_path: { // Diambil dari submitRegistration.js
    type: DataTypes.STRING(255),
    allowNull: true,
   },
   bank_name: { // Diambil dari submitRegistration.js
    type: DataTypes.STRING(100),
    allowNull: true,
   },
   account_number: { // Diambil dari submitRegistration.js
    type: DataTypes.STRING(50),
    allowNull: true,
   },
   account_holder_name: { // Diambil dari submitRegistration.js
    type: DataTypes.STRING(100),
    allowNull: true,
   },
   registration_date: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
   },

   // Approval Flow Columns:
   registration_status: {
    type: DataTypes.ENUM(
     "verifikasi_dokumen",
     "verifikasi_pendaftaran",
     "aktif"
    ),
    allowNull: false,
    defaultValue: "verifikasi_dokumen",
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
    comment: "Status akhir proses persetujuan",
   },
   registered_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
   },
   // =======================================================
  },
  {
   timestamps: true, // Menyimpan createdAt dan updatedAt
   tableName: "member_registrations",
  }
 );

 // =======================================================
 // DEFINISI ASOSIASI (Relasi)
 // =======================================================
 MemberRegistrationModel.associate = (models) => {
  MemberRegistrationModel.belongsTo(models.ApprovalFlows, {
   foreignKey: "approval_flow_id",
   as: "approvalFlow",
   onDelete: "SET NULL",
  });

  MemberRegistrationModel.belongsTo(models.ApprovalSteps, {
   foreignKey: "current_step_id",
   as: "currentStep",
   onDelete: "SET NULL",
  });

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