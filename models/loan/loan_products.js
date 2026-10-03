import { Sequelize } from "sequelize";

const LoanProduct = (sequelize) => {
  const { DataTypes } = Sequelize;

  const LoanProductModel = sequelize.define(
    "loan_products",
    {
      loan_product_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.getDataValue("loan_product_id");
        },
      },
      product_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      loan_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      akad_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      default_term: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return LoanProductModel;
};

export default LoanProduct;
