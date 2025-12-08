import { Sequelize } from "sequelize";

const SukukOrder = (sequelize) => {
  const { DataTypes } = Sequelize;

  const SukukOrderModel = sequelize.define("sukuk_orders", {
    order_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    sukuk_issue_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // Foreign Key
    },
    member_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // Foreign Key Investor
    },
    amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'PAID', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
  });

  return SukukOrderModel;
};

export default SukukOrder;