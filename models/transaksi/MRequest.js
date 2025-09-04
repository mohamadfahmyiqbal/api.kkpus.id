import { Sequelize } from "sequelize";
import pus from "../../config/pus.js";

const { DataTypes } = Sequelize;

const MRequest = pus.define(
  "request",
  {
    token: {
      type: DataTypes.STRING,
    },
    nik: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipe_request: {
      type: DataTypes.STRING,
    },
    tipe_anggota: {
      type: DataTypes.STRING,
    },
    status_payment: {
      type: DataTypes.STRING,
    },
    status_approval: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: true, // otomatis bikin createdAt & updatedAt
  }
);

export default MRequest;
