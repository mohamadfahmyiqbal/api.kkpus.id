import { DataTypes } from "sequelize";

// Nama fungsi model harus sama dengan nama file, biasanya jamak (plural)
// dan dimulai dengan huruf kapital (PascalCase)
const LoanPayment = (sequelize) => {
  const LoanPaymentModel = sequelize.define(
    "LoanPayment",
    {
      // loan_payment_id (Primary Key, BigInt)
      loan_payment_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      // loan_bill_id (Foreign Key ke tabel tagihan pinjaman)
      loan_bill_id: {
        type: DataTypes.UUID,
        allowNull: false,
        // 💡 Relasi ini akan didefinisikan di index.js
      },
      // paid_datetime
      paid_datetime: {
        type: DataTypes.DATE,
        allowNull: true, // Asumsi bisa NULL jika pembayaran belum selesai
      },
      // amount (Decimal 18, 2)
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      // payment_status (varchar 50)
      payment_status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "PENDING", // Nilai default yang disarankan
      },
      // invoice_id (Foreign Key ke tabel Invoice/Tagihan)
      invoice_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      // created_at dan updated_at dihandle otomatis oleh Sequelize
      // jika `timestamps: true` tidak didefinisikan ulang
    },
    {
      // Opsi Sequelize
      tableName: "loan_payments", // Nama tabel di database
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      // Tambahkan indeks untuk foreign keys
      indexes: [{ fields: ["loan_bill_id"] }, { fields: ["invoice_id"] }],
    }
  );

  // 💡 Definisikan Asosiasi di sini jika model lain sudah diimpor,
  // namun lebih baik di file index.js

  LoanPaymentModel.associate = (models) => {
    // Relasi LoanPayment ke LoanBill (Tagihan Pinjaman)
    // Asumsi Anda memiliki model LoanBill
    models.LoanPayment.belongsTo(models.LoanBill, {
      foreignKey: "loan_bill_id",
      as: "loanBill",
    });

    // Relasi LoanPayment ke Invoice (Asumsi Anda punya model Invoice)
    models.LoanPayment.belongsTo(models.Invoice, {
      foreignKey: "invoice_id",
      as: "invoice",
    });
  };

  return LoanPaymentModel;
};

export default LoanPayment;
