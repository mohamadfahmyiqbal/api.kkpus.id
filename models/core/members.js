// models/members.js
import { Sequelize } from "sequelize";

const Member = (sequelize) => {
  const { DataTypes } = Sequelize;

  const MemberModel = sequelize.define(
    "members",
    {
      member_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      member_no: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255), // Sesuai skema varchar(255)
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(50), // Sesuai skema varchar(50)
        allowNull: true,
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      member_type: {
        type: DataTypes.STRING(20), // Ubah dari ENUM ke VARCHAR sesuai skema
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(20), // Sesuai skema varchar(20)
        allowNull: true,
      },
      date_of_brith: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      join_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      nik_ktp: {
        type: DataTypes.STRING(50), // Sesuai skema varchar(50)
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      // --- KOLOM BARU UNTUK ALAMAT GRANULAR (STEP 1) ---
      province_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      district_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      subdistrict_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      rt: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
      rw: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
    },
    {
      tableName: "members",
      timestamps: true, // Menggunakan createdAt & updatedAt secara otomatis
      underscored: false, // Tetap false agar mengikuti camelCase (createdAt)
    },
  );

  return MemberModel;
};

export default Member;
