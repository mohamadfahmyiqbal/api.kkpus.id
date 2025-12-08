import { Sequelize } from "sequelize";

const UserRole = (sequelize) => {
  const { DataTypes } = Sequelize;

  const UserRoleModel = sequelize.define("user_roles", {
    role_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    role_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  }, { 
    freezeTableName: true, 
    timestamps: false,
  });

  return UserRoleModel;
};

export default UserRole;