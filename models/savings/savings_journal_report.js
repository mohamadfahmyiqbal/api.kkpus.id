import { DataTypes } from "sequelize";

export default function SavingsJournalReport(sequelize) {
  return sequelize.define(
    "SavingsJournalReport",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      period: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      account_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      account_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      debet: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      kredit: {
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
      tableName: "savings_journal_reports",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["period", "account_code"],
        },
      ],
    }
  );
}
