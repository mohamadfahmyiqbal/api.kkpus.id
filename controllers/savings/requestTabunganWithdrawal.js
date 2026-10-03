// 📁 controllers/savings/requestTabunganWithdrawal.js
import db from "../../models/index.js";

export const requestTabunganWithdrawal = async (req, res) => {
    const memberId = req.userId;
    const { id } = req.params; // member_saving_target_id
    const { 
        method, 
        bank_name, 
        bank_account_no,
        cash_name,
        cash_time,
        cash_location 
    } = req.body;

    const t = await db.sequelize.transaction();

    try {
        // 1. Cari MemberSavingTarget
        const target = await db.MemberSavingTarget.findOne({
            where: { 
                member_saving_target_id: id,
                member_id: memberId
            },
            transaction: t
        });

        if (!target) {
            await t.rollback();
            return res.status(404).json({
                status: false,
                message: "Program tabungan tidak ditemukan."
            });
        }

        // 2. Cek Aturan Bisnis Utama: Saldo harus >= target
        const currentBalance = parseFloat(target.current_balance || 0);
        const targetAmount = parseFloat(target.target_amount || 0);

        if (currentBalance < targetAmount) {
            await t.rollback();
            return res.status(400).json({
                status: false,
                message: `Tabungan baru bisa dicairkan jika target nominal terpenuhi (Target: Rp ${targetAmount.toLocaleString('id-ID')}, Saldo: Rp ${currentBalance.toLocaleString('id-ID')}).`
            });
        }
        
        // Pastikan tidak ada pengajuan pencairan yang masih pending untuk tabungan ini
        const pendingWithdrawal = await db.SavingsWithdrawal.findOne({
            where: {
                member_saving_target_id: id,
                status: 'PENDING'
            },
            transaction: t
        });

        if (pendingWithdrawal) {
            await t.rollback();
            return res.status(400).json({
                status: false,
                message: "Anda sudah memiliki pengajuan pencairan yang sedang diproses untuk tabungan ini."
            });
        }

        // 3. Cari Approval Flow
        const approvalFlow = await db.ApprovalFlow.findOne({
            where: { entity_ref: 'tabungan_withdrawals' },
            transaction: t
        });

        if (!approvalFlow) {
            await t.rollback();
            return res.status(500).json({
                status: false,
                message: "Sistem error: Approval Flow untuk penarikan tidak ditemukan."
            });
        }

        const firstStep = await db.ApprovalStep.findOne({
            where: { approval_flow_id: approvalFlow.approval_flow_id, step_order: 1 },
            transaction: t
        });

        // 4. Buat Pengajuan Pencairan (menggunakan seluruh saldo terkumpul)
        const newRequest = await db.SavingsWithdrawal.create({
            member_id: memberId,
            savings_account_id: null,
            member_saving_target_id: id,
            amount: currentBalance, // Cairkan seluruhnya
            request_datetime: new Date(),
            status: 'PENDING',
            method: method || 'TRANSFER',
            bank_name: method === 'TRANSFER' ? bank_name : null,
            bank_account_no: method === 'TRANSFER' ? bank_account_no : null,
            cash_name: method === 'TUNAI' ? cash_name : null,
            cash_time: method === 'TUNAI' ? cash_time : null,
            cash_location: method === 'TUNAI' ? cash_location : null,
            approval_flow_id: approvalFlow.approval_flow_id,
            current_step_id: firstStep?.approval_step_id || null
        }, { transaction: t });

        await t.commit();

        return res.status(200).json({
            status: true,
            message: "Pengajuan pencairan tabungan berhasil dikirim. Menunggu persetujuan Pengawas.",
            data: { withdrawal_id: newRequest.withdrawal_id }
        });

    } catch (error) {
        if (t) await t.rollback();
        console.error("Request Tabungan Withdrawal Error:", error);
        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan: " + error.message
        });
    }
};
