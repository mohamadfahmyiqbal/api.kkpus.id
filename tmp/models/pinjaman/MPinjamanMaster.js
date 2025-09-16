// models/MPinjamanMaster.js
import { DataTypes } from "sequelize";
import MAnggota from "../anggota/MAnggota.js";
import pus from "../../config/pus.js";

const MPinjamanMaster = pus.define(
  "pinjaman_master",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nik: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    akun: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    jumlah: {
      type: DataTypes.STRING, // Bisa juga DECIMAL jika seharusnya angka
      allowNull: true,
    },
    saldo: {
      type: DataTypes.STRING, // Bisa juga DECIMAL jika seharusnya angka
      allowNull: true,
    },
  },
  {
    tableName: "pinjaman_master",
    timestamps: true, // untuk createdAt dan updatedAt
  }
);

// 🔗 Relasi
MPinjamanMaster.belongsTo(MAnggota, {
  foreignKey: "nik",
  targetKey: "nik",
  as: "anggota",
});

export default MPinjamanMaster;
