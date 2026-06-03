import { Sequelize } from "sequelize";

const BillType = (sequelize) => {
  const { DataTypes } = Sequelize;

  const BillTypeModel = sequelize.define(
    "bill_type",
    {
      bill_type_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      // 🟢 TAMBAHKAN KOLOM INI
      tx_type: {
        type: DataTypes.ENUM("SETORAN", "PENARIKAN", "LAINNYA"),
        defaultValue: "SETORAN",
        allowNull: false,
      },
      // 🟢 TAMBAHKAN KOLOM INI
      category_map: {
        type: DataTypes.STRING(50),
        allowNull: true, // Boleh null jika tidak semua tipe tagihan punya kategori khusus
      },
      type_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      default_amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      period_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      underscored: true, // 👈 PENTING: Agar Sequelize mencari 'category_map' (snake_case) bukan 'categoryMap'
    }
  );

  return BillTypeModel;
};

export default BillType;
