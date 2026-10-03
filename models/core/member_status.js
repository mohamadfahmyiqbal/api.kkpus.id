import { Sequelize } from "sequelize";

const MemberStatus = (sequelize) => {
  const { DataTypes } = Sequelize;

  const MemberStatusModel = sequelize.define("member_status", {
    status_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    status_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  }, { 
    freezeTableName: true, 
    timestamps: false, // Asumsi tabel status tidak memerlukan timestamp
  });

  return MemberStatusModel;
};

export default MemberStatus;