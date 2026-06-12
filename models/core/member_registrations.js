import { Sequelize } from "sequelize";

const MemberRegistration = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define(
    "member_registrations",
    {
      registration_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      member_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      nik_ktp: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      address_ktp: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      province_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      province_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      city_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      city_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      district_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      district_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      subdistrict_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      subdistrict_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      rt: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      rw: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      member_type: {
        type: DataTypes.STRING(100),
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
      status_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      approval_flow_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      current_step_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      final_status: {
        type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      registered_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );
};

export default MemberRegistration;