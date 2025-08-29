// models/MApproval.js
import { Model, DataTypes } from "sequelize";
import pus from "../../config/pus.js"; // <- gunakan config, bukan ../index.js

class MApproval extends Model {}

MApproval.init(
  {
    approver_id: {
      type: DataTypes.INTEGER, // ubah sesuai tipe sebenarnya di DB (INTEGER atau STRING)
      primaryKey: true,
    },
    level: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    nama: DataTypes.STRING,
    nik: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize: pus,
    modelName: "approvals",
    tableName: "approvals",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    id: false, // penting: hentikan Sequelize menambahkan kolom id otomatis
  }
);

export default MApproval;
