export default (sequelize, DataTypes) => {
  return sequelize.define(
    "payment_fee_configs",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      payment_type: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      payment_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fee_type: {
        type: DataTypes.ENUM("FLAT", "PERCENTAGE", "FLAT_AND_PERCENTAGE"),
        allowNull: false,
        defaultValue: "FLAT",
      },
      flat_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      percentage_fee: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "payment_fee_configs",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};
