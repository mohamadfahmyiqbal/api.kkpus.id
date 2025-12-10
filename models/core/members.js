// models/members.js
import { Sequelize } from "sequelize";

const Member = (sequelize) => {
  const { DataTypes } = Sequelize;

  const MemberModel = sequelize.define(
    "members",
    {
      member_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      // Menggunakan full_name (Sesuai skema database yang Anda berikan)
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
      // Kolom lain sesuai skema
      gender: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      join_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      member_no: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      member_type: {
        type: DataTypes.ENUM("calon", "reguler", "alb"),
        allowNull: false,
      },
      nik_ktp: {
        type: DataTypes.STRING(30),
        allowNull: true,
        unique: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      password_hash: { // Ditambahkan, karena ada di skema tapi tidak di model
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "members",
      timestamps: true,
      underscored: false,
    }
  );

  return MemberModel;
};

export default Member;