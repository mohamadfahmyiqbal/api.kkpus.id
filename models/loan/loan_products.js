import { Sequelize } from "sequelize";

const LoanProduct = (sequelize) => {
  const { DataTypes } = Sequelize;

  const LoanProductModel = sequelize.define("loan_products", {
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
    max_amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    min_amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    max_tenor_months: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    margin_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false, // Margin rate per tahun
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
  });

  return LoanProductModel;
};

export default LoanProduct;