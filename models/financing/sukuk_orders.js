import { Sequelize } from "sequelize";

const SukukOrder = (sequelize) => {
  const { DataTypes } = Sequelize;

  const SukukOrderModel = sequelize.define("sukuk_orders", {
    order_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    sukuk_issue_id: {
      type: DataTypes.UUID,
      allowNull: false, // Foreign Key
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false, // Foreign Key Investor (UUID)
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
      type: DataTypes.ENUM('PENDING', 'READY_TO_PAY', 'WAITING_PAYMENT', 'APPROVED', 'PAID', 'REJECTED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    is_approved_pengawas: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_approved_ketua: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_approved_bendahara: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    rejected_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
  });

  return SukukOrderModel;
};

export default SukukOrder;