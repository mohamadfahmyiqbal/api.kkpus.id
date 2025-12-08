import { Sequelize } from "sequelize";

const MemberRoleAssignment = (sequelize) => {
  const { DataTypes } = Sequelize;

  const MemberRoleAssignmentModel = sequelize.define("member_role_assignments", {
    member_role_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // Foreign Key
    },
    role_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // Foreign Key
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
  });

  return MemberRoleAssignmentModel;
};

export default MemberRoleAssignment;