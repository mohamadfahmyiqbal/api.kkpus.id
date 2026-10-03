import { DataTypes } from "sequelize";

export default function MemberFinancialSummary(sequelize) {
  return sequelize.define(
    "MemberFinancialSummary",
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
      simpanan_pokok: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      simpanan_wajib: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      simpanan_sukarela: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      tabungan_reguler: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      tabungan_details: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      jual_beli_total: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      jual_beli_sisa_cicilan: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      jual_beli_terbayar: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      jual_beli_belum_dibayar_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      pinjaman_total_tagihan: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      pinjaman_nominal_kredit: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      pinjaman_nominal_cicilan: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      pinjaman_sisa_cicilan: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      pinjaman_terbayar: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      arisan_total_tagihan: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      arisan_sisa_cicilan: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      arisan_terbayar: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      arisan_diikuti_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      total_investasi: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      total_pendanaan_syariah: {
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
      tableName: "member_financial_summaries",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
}
