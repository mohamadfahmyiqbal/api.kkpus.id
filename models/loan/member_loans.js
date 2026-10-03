import { DataTypes } from "sequelize";

const MemberLoan = (sequelize) => {
  const MemberLoanModel = sequelize.define(
    "member_loans",
    {
      loan_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      member_id: {
        type: DataTypes.UUID,
        allowNull: true, // Foreign Key - UUID format
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false, // Foreign Key
      },
      loan_product_id: {
        type: DataTypes.UUID,
        allowNull: false, // Foreign Key
      },
      nominal_principal: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      term_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      installment_amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      disbursement_method: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      disbursement_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      bank_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      bank_account_no: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      principal_amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        // STORED GENERATED
      },
      tenor_months: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // STORED GENERATED
      },
      margin_amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      interest_rate: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: true,
        defaultValue: 0.0,
      },
      monthly_payment: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        // STORED GENERATED
      },
      loan_amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        // STORED GENERATED
      },
      total_repayment: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        // STORED GENERATED
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return MemberLoanModel;
};

export default MemberLoan;
