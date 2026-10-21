export default (sequelize, DataTypes) => {
  return sequelize.define(
    "cooperative_bank_accounts",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      bank_code: {
        type: DataTypes.STRING(20),
        allowNull: false, // e.g. 'BCA', 'MANDIRI', 'BRI', 'BNI'
      },
      bank_name: {
        type: DataTypes.STRING(100),
        allowNull: false, // e.g. 'Bank Central Asia (BCA)'
      },
      account_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      account_holder: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      branch: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      qr_code_image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "cooperative_bank_accounts",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};
