import { Sequelize } from "sequelize";
import pus from "../../config/pus.js";

const { DataTypes } = Sequelize;

const MAnggota = pus.define(
  "anggota",
  {
    nik: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING,
    },
    no_tlp: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    status_anggota: {
      type: DataTypes.STRING,
    },
    roles: {
      type: DataTypes.INTEGER,
    },
    password: {
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default MAnggota;
