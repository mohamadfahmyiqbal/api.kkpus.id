import { Sequelize } from "sequelize";

const MemberEmployment = (sequelize) => {
  const { DataTypes } = Sequelize;

  const MemberEmploymentModel = sequelize.define("member_employments", {
    employment_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // Foreign Key
    },
    occupation: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    employer_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    employer_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
  });

  return MemberEmploymentModel;
};

export default MemberEmployment;