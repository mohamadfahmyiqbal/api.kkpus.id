export default (sequelize, DataTypes) => {
  return sequelize.define(
    "feature_configs",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      menu: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      submenu: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      akad_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "feature_configs",
      timestamps: false,
    }
  );
};
