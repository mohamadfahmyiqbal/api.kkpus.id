import { DataTypes } from "sequelize";

const SavingsProduct = (sequelize) => {
  const SavingsProductModel = sequelize.define("savings_products", {
    // Primary Key: savings_product_id
    savings_product_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    // product_code varchar(50)
    product_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    // name varchar(255)
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // akad_type varchar(50)
    akad_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
    // Mapping eksplisit agar Sequelize tidak mencari 'createdAt' (camelCase)
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    // underscored: true memastikan kolom lain hasil relasi juga menggunakan snake_case
    underscored: true, 
  });

  return SavingsProductModel;
};

export default SavingsProduct;