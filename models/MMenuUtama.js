import { Sequelize } from "sequelize";
import pus from "../config/pus.js";

const { DataTypes } = Sequelize;

const MMenuUtama = pus.define(
  "menu_utama",
  {
    id_menu: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_menu: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ikon: {
      type: DataTypes.STRING,
    },
    deskripsi: {
      type: DataTypes.TEXT,
    },
    urutan: {
      type: DataTypes.INTEGER,
    },
    status_aktif: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default MMenuUtama;
