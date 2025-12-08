import { DataTypes } from "sequelize";

// Nama fungsi model harus sama dengan nama file, biasanya jamak (plural)
// dan dimulai dengan huruf kapital (PascalCase)
const SavingsTransaction = (sequelize) => {
  const SavingsTransactionModel = sequelize.define(
    "SavingsTransaction",
    {
      // savings_tx_id (Primary Key, BigInt)
      savings_tx_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      // savings_account_id (Foreign Key ke tabel rekening tabungan)
      savings_account_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      // tx_type (Contoh: 'DEPOSIT', 'WITHDRAWAL', 'FEE')
      tx_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      // amount (Decimal 18, 2)
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      // tx_datetime
      tx_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      // method (Contoh: 'CASH', 'TRANSFER', 'VA')
      method: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // bank_name
      bank_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      // bank_account_no
      bank_account_no: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // approved_status (Contoh: 'APPROVED', 'PENDING', 'REJECTED')
      approved_status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "PENDING",
      },
      // invoice_id (Foreign Key ke tabel Invoice/Tagihan)
      invoice_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      // created_at dan updated_at dihandle otomatis oleh Sequelize
    },
    {
      // Opsi Sequelize
      tableName: "savings_transactions", // Nama tabel di database
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      // Tambahkan indeks untuk foreign keys
      indexes: [{ fields: ["savings_account_id"] }, { fields: ["invoice_id"] }],
    }
  );

  // 💡 Definisikan Asosiasi
  SavingsTransactionModel.associate = (models) => {
    // Relasi SavingsTransaction ke MemberSavings (Rekening Tabungan)
    // Asumsi nama model adalah MemberSavings
    models.SavingsTransaction.belongsTo(models.MemberSavings, {
      foreignKey: "savings_account_id",
      as: "account",
    });

    // Relasi SavingsTransaction ke Invoice (Asumsi Anda punya model Invoice)
    models.SavingsTransaction.belongsTo(models.Invoice, {
      foreignKey: "invoice_id",
      as: "invoice",
    });
  };

  return SavingsTransactionModel;
};

export default SavingsTransaction;
