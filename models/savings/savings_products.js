import { Sequelize } from "sequelize";

const SavingsProduct = (sequelize) => {
  const { DataTypes } = Sequelize;

  const SavingsProductModel = sequelize.define("savings_products", {
    // Sesuai dengan savings_product_id (Primary Key)
    savings_product_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    // Sesuai dengan product_code varchar(50)
    product_code: {
      type: DataTypes.STRING(50),
      allowNull: true, // Karena di deskripsi database YES
    },
    // Sesuai dengan name varchar(255)
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // Sesuai dengan akad_type varchar(50)
    akad_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  }, { 
    freezeTableName: true, 
    timestamps: true, // Ini akan menangani created_at dan updated_at secara otomatis
    underscored: true, // Agar Sequelize mencari created_at bukan createdAt
  });

  return SavingsProductModel;
};

export default SavingsProduct;