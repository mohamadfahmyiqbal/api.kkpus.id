import { Sequelize } from "sequelize";
import pus from "../../config/pus.js";

const { DataTypes } = Sequelize;

const MApprovalFlow = pus.define(
  "approval_flows",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    approver_id: {
      type: DataTypes.STRING,
      allowNull: false,
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

export default MApprovalFlow;
