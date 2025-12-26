import db from "../../models/index.js";
import iris from "../utility/midtransIris.js";

export const disburseWithdrawal = async (req, res) => {
    const { withdrawal_id } = req.params;
    const adminId = req.userId;

    let transaction;
    try {
        transaction = await db.sequelize.transaction();

        // 1. Ambil data penarikan yang sudah disetujui Ketua
        const withdrawal = await db.SavingsWithdrawal.findOne({
            where: { withdrawal_id, status: 'APPROVED' },
            include: [{ model: db.Member, as: 'member' }],
            transaction
        });

        if (!withdrawal) {
            await transaction.rollback();
            return res.status(404).json({ message: "Data tidak ditemukan atau belum disetujui Ketua." });
        }

        // 2. Kirim instruksi Disbursement ke Midtrans Iris
        const payoutRequest = {
            payouts: [{
                beneficiary_name: withdrawal.member.full_name,
                beneficiary_account: withdrawal.bank_account_no,
                beneficiary_bank: withdrawal.bank_name,
                amount: withdrawal.amount.toString(),
                notes: `Withdrawal-${withdrawal_id}`
            }]
        };

        const result = await iris.createPayouts(payoutRequest);
        
        // Simpan Reference No dari Midtrans untuk pelacakan di webhook nanti
        const referenceNo = result.payouts[0].reference_no;

        // 3. Update status ke 'PROCESSING' agar tidak diklik dua kali
        await withdrawal.update({ 
            status: 'PROCESSING',
            reference_no: referenceNo // Pastikan kolom ini ada di tabel
        }, { transaction });

        await transaction.commit();

        return res.status(200).json({ 
            status: true, 
            message: "Instruksi pembayaran dikirim ke Midtrans.",
            reference_no: referenceNo
        });

    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({ status: false, message: error.message });
    }
};