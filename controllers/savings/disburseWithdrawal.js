import db from "../../models/index.js";
import { performFinalAction } from "../core/approvals/performFinalAction.js";

export const disburseWithdrawal = async (req, res) => {
  const { withdrawal_id } = req.params;
  const adminId = req.userId; // ID Bendahara yang membayar

  let transaction;
  try {
    transaction = await db.sequelize.transaction();

    // 1. Cari data yang sudah APPROVED oleh Ketua
    const withdrawal = await db.SavingsWithdrawal.findOne({
      where: { withdrawal_id, status: 'APPROVED' },
      transaction
    });

    if (!withdrawal) {
      await transaction.rollback();
      return res.status(404).json({ message: "Data penarikan tidak ditemukan atau belum disetujui Ketua." });
    }

    // 2. Panggil Final Action untuk POTONG SALDO
    await performFinalAction({
      entityRef: "savings_withdrawal",
      entity: withdrawal,
      transaction,
      approverId: adminId
    });

    // 3. Update status akhir menjadi PAID
    await withdrawal.update({ status: 'PAID' }, { transaction });

    await transaction.commit();
    return res.status(200).json({ status: true, message: "Pembayaran berhasil. Saldo telah dipotong." });

  } catch (error) {
    if (transaction) await transaction.rollback();
    return res.status(500).json({ status: false, message: error.message });
  }
};