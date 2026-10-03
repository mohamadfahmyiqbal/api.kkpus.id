// models/financing/financing_categories.js
import { Sequelize } from "sequelize";

const FinancingCategory = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define("financing_categories", {
    category_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    category_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });
};

export default FinancingCategory;