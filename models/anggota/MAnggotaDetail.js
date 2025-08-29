import { DataTypes } from "sequelize";
import pus from "../../config/pus.js";

const MAnggotaDetail = pus.define(
  "anggota_detail",
  {
    token: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    nik: {
      type: DataTypes.STRING,
    },
    jenis_kelamin: {
      type: DataTypes.STRING,
    },
    alamat: {
      type: DataTypes.STRING,
    },
    ktp: {
      type: DataTypes.STRING, // simpan path file KTP
    },
    ktp_mimeType: {
      type: DataTypes.STRING,
    },
    foto: {
      type: DataTypes.STRING, // simpan path file Foto
    },
    foto_mimeType: {
      type: DataTypes.STRING,
    },
    tlp_darurat: {
      type: DataTypes.INTEGER,
    },
    hubungan: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    id: false,
  }
);

// Setelah define, hapus atribut id default Sequelize:
MAnggotaDetail.removeAttribute("id");

export default MAnggotaDetail;
