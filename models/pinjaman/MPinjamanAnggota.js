// models/MPinjamanAnggota.js
import { DataTypes } from "sequelize";
import pus from "../../config/pus.js";
import MAnggota from "../anggota/MAnggota.js";

const MPinjamanAnggota = pus.define(
  "pinjaman_anggota",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nik: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jenis: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nominal: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    term: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    evidence: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "pinjaman_anggota",
    timestamps: true,
  }
);

// 🔗 Relasi
MPinjamanAnggota.belongsTo(MAnggota, {
  foreignKey: "nik",
  targetKey: "nik",
  as: "anggota",
});

export default MPinjamanAnggota;
