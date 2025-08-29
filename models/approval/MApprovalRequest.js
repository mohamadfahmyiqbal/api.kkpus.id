import { Sequelize } from "sequelize";
import pus from "../../config/pus.js";

const { DataTypes } = Sequelize;

const MApprovalRequest = pus.define(
  "approval_requests",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    requester_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "Jenis request, contoh: pendaftaran_anggota",
    },
    flow: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Data dinamis sesuai tipe request",
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: false, // pakai created_at dan updated_at manual
    id: false,
  }
);

export default MApprovalRequest;
