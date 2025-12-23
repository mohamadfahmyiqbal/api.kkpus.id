// 📁 src/controllers/billing/createDepositSukarela.js

import db from "../../models/index.js";

export const createDepositSukarela = async (req, res) => {
  const { amount, category } = req.body;

  // Middleware MidAnggota menyimpan member_id ke req.userId
  const member_id = req.userId;

  if (!amount || amount < 10000) {
    return res.status(400).json({
      status: false,
      message: "Minimal setoran adalah Rp 10.000",
    });
  }

  const transaction = await db.sequelize.transaction();

  try {
    // 1. Ambil member_no dari database karena tidak ada di middleware
    const member = await db.Member.findByPk(member_id, { transaction });
    if (!member) {
      throw new Error("Data anggota tidak ditemukan.");
    }

    // 2. Cari bill_type_id untuk Simpanan Sukarela
    const typeInfo = await db.BillType.findOne({
      where: { category_map: "Simpanan Sukarela" },
      transaction,
    });

    if (!typeInfo) {
      throw new Error("Tipe tagihan Simpanan Sukarela tidak ditemukan.");
    }

    // 3. Buat record di tabel Bills
    const newBill = await db.Bill.create(
      {
        bill_type_id: typeInfo.bill_type_id,
        member_id: member_id,
        member_no: member.member_no, // Menggunakan member_no dari hasil findByPk
        description: `Setoran ${category || "Simpanan Sukarela"}`,
        amount: amount,
        due_date: new Date(),
        status: "PENDING",
      },
      { transaction }
    );

    // 4. Buat record di tabel BillItems
    await db.BillItem.create(
      {
        bill_id: newBill.bill_id,
        description: `${category || "Simpanan Sukarela"}`,
        amount: amount,
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      status: true,
      message: "Berhasil membuat instruksi setoran sukarela",
      data: {
        bill_id: newBill.bill_id,
        amount: newBill.amount,
      },
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error createDepositSukarela:", error.message);
    return res.status(500).json({
      status: false,
      message: error.message || "Gagal memproses setoran sukarela",
    });
  }
};
