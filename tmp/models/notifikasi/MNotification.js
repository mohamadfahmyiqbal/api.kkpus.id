// models/MNotification.js
import { Sequelize } from "sequelize";
import pus from "../../config/pus.js"; // pastikan koneksi Sequelize

const { DataTypes } = Sequelize;

const MNotification = pus.define(
  "notifications", // nama tabel
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true, // aktifkan timestamps
    createdAt: "created_at", // kolom created_at custom
    updatedAt: false, // tidak pakai updatedAt
    paranoid: true, // aktifkan soft delete
    deletedAt: "deleted_at", // kolom deleted_at custom
  }
);

export default MNotification;
