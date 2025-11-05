import { Sequelize } from "sequelize";
import pus from "../../config/pus.js";

const { DataTypes } = Sequelize;

const MSimpananCategory = pus.define(
  "simpanan_category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Primary Key",
    },
    name: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      comment: "Create Time",
    },
    updatedAt: {
      type: DataTypes.DATE,
      comment: "Update Time",
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default MSimpananCategory;
