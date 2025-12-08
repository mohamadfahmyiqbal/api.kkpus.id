import { Sequelize } from "sequelize";

const MemberLoan = (sequelize) => {
  const { DataTypes } = Sequelize;

  const MemberLoanModel = sequelize.define("member_loans", {
    loan_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // Foreign Key
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // Foreign Key
    },
    principal_amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    tenor_months: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    margin_amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    total_repayment: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    disbursement_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'DISBURSED', 'PAID'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
  });

  return MemberLoanModel;
};

export default MemberLoan;