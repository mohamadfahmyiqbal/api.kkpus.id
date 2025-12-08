import { Sequelize } from "sequelize";

const SavingsProduct = (sequelize) => {
  const { DataTypes } = Sequelize;

  const SavingsProductModel = sequelize.define("savings_products", {
    product_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    min_initial_deposit: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
  });

  return SavingsProductModel;
};

export default SavingsProduct;