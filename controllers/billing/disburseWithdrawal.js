import db from "../../models/index.js";
import { performFinalAction } from "../core/approvals/performFinalAction.js";
import iris from "../../utils/midtransIris.js";

export const disburseWithdrawal = async (req, res) => {
    const { withdrawal_id } = req.params;
    const adminId = req.userId; // ID Bendahara dari middleware

    let transaction;
    try {
        transaction = await db.sequelize.transaction();

        // 1. Cari data penarikan yang sudah APPROVED oleh Ketua
        const withdrawal = await db.SavingsWithdrawal.findOne({
            where: { withdrawal_id, status: 'APPROVED' },
            include: [{ model: db.Member, as: 'member' }],
            transaction
        });

        if (!withdrawal) {
            await transaction.rollback();
            return res.status(404).json({ message: "Data tidak ditemukan atau belum disetujui Ketua." });
        }

        // 2. Kirim instruksi Disbursement ke Midtrans
        const payoutRequest = {
            payouts: [{
                beneficiary_name: withdrawal.member.full_name,
                beneficiary_account: withdrawal.bank_account_no,
                beneficiary_bank: withdrawal.bank_name,
                amount: withdrawal.amount.toString(),
                notes: `Penarikan ID ${withdrawal_id}`
            }]
        };

        const result = await iris.createPayouts(payoutRequest);
        const referenceNo = result.payouts[0].reference_no;

        // 3. Eksekusi pemotongan saldo internal & mutasi
        await performFinalAction({
            entityRef: "savings_withdrawal",
            entity: withdrawal,
            transaction,
            approverId: adminId
        });

        // 4. Update status ke PAID dan simpan Ref No Midtrans
        await withdrawal.update({ 
            status: 'PAID',
            bank_account_no: referenceNo // Menggunakan kolom yang ada untuk simpan Ref Midtrans
        }, { transaction });

        await transaction.commit();

        return res.status(200).json({ 
            status: true, 
            message: "Pembayaran berhasil diproses. Saldo anggota telah dipotong.",
            reference_no: referenceNo
        });

    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("Midtrans Disbursement Error:", error);
        return res.status(500).json({ 
            status: false, 
            message: "Gagal memproses pembayaran: " + error.message 
        });
    }
};