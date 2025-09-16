import { Sequelize } from "sequelize";
import pus from "../../config/pus.js";

const { DataTypes } = Sequelize;

const MAnggotaJob = pus.define(
  "anggota_job",
  {
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    pekerjaan: {
      type: DataTypes.STRING,
    },
    tempat_kerja: {
      type: DataTypes.STRING,
    },
    alamat_kerja: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    id: false,
  }
);

export default MAnggotaJob;
