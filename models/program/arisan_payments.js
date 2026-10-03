import { Sequelize } from "sequelize";

const ArisanPayment = (sequelize) => {
  const { DataTypes } = Sequelize;

  const ArisanPaymentModel = sequelize.define(
    "arisan_payments",
    {
      arisan_payment_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      arisan_batch_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      member_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      payment_month: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      payment_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'PENDING',
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return ArisanPaymentModel;
};

export default ArisanPayment;
