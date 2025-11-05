import { Sequelize } from "sequelize";
import pus from "../../config/pus.js";
import MAnggota from "../anggota/MAnggota.js";

const { DataTypes } = Sequelize;

const MTrans = pus.define(
  "transaksi",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true,
    },
    id_master: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    jenis: {
      type: DataTypes.STRING,
    },
    nik: {
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.STRING,
    },
    orderId: {
      type: DataTypes.STRING,
    },
    jumlah: {
      type: DataTypes.STRING,
    },
    batch: {
      type: DataTypes.STRING,
    },
    payment_status: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

// 🔗 Relasi
MTrans.belongsTo(MAnggota, {
  foreignKey: "nik",
  targetKey: "nik",
  as: "anggota",
});

export default MTrans;
