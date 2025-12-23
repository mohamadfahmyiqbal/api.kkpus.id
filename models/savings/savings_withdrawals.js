import { Sequelize } from "sequelize";

const SavingsWithdrawal = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define("savings_withdrawals", {
    withdrawal_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    savings_account_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    member_id: { // Tambahkan ini sesuai tabel
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    method: { // Tambahkan ini
      type: DataTypes.STRING(50),
    },
    bank_name: { // Tambahkan ini
      type: DataTypes.STRING(100),
    },
    bank_account_no: { // Tambahkan ini
      type: DataTypes.STRING(50),
    },
    request_datetime: { // Sesuaikan nama dengan tabel
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING(20), // Gunakan STRING agar fleksibel
      defaultValue: "PENDING",
    },
    approval_flow_id: { // Penting untuk sistem approval
      type: DataTypes.BIGINT,
    },
    current_step_id: { // Tambahkan ini jika menggunakan multi-step approval
      type: DataTypes.BIGINT,
    },
    invoice_id: {
      type: DataTypes.BIGINT,
    }
  }, { 
    freezeTableName: true, 
    timestamps: true,
    underscored: true // Pastikan ini true jika tabel menggunakan created_at
  });
};

export default SavingsWithdrawal;