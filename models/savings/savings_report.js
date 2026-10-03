import { DataTypes } from "sequelize";

export default function SavingsReport(sequelize) {
  return sequelize.define(
    "SavingsReport",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      member_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "members",
          key: "member_id",
        },
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_pokok: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      total_wajib: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      total_sukarela: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      total_all: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
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
      tableName: "savings_reports",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["member_id", "year"],
        },
      ],
    }
  );
}
