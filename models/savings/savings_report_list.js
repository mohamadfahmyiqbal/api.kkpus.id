import { DataTypes } from "sequelize";

export default function SavingsReportList(sequelize) {
  return sequelize.define(
    "SavingsReportList",
    {
      member_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "members",
          key: "member_id",
        },
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tahun_ini_pokok: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      tahun_ini_wajib: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      tahun_ini_sukarela: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      tahun_ini_total: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      tahun_lalu_pokok: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      tahun_lalu_wajib: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      tahun_lalu_sukarela: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      tahun_lalu_total: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      tahun_lalu2_pokok: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      tahun_lalu2_wajib: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      tahun_lalu2_sukarela: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      tahun_lalu2_total: {
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
      tableName: "savings_report_lists",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
}
