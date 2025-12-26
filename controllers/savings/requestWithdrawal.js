import db from "../../models/index.js";

const requestWithdrawal = async (req, res) => {
    const memberId = req.userId;
    const { amount, category, method, bank_name, bank_account_no } = req.body;

    // Mulai Transaksi Database
    const t = await db.sequelize.transaction();

    try {
        // 1. Validasi Input Dasar
        if (!amount || parseFloat(amount) <= 0) {
            return res.status(400).json({
                status: false,
                message: "Jumlah penarikan harus lebih besar dari 0."
            });
        }

        // 2. Cari akun dan kunci untuk pengecekan saldo
        const account = await db.MemberSavingsAccount.findOne({
            where: {
                member_id: memberId,
                account_type: category
            },
            transaction: t
        });

        if (!account) {
            await t.rollback();
            return res.status(404).json({
                status: false,
                message: `Akun simpanan untuk kategori '${category}' tidak ditemukan.`
            });
        }

        // 3. Validasi Saldo
        if (parseFloat(account.current_balance) < parseFloat(amount)) {
            await t.rollback();
            return res.status(400).json({
                status: false,
                message: "Maaf, saldo Anda tidak mencukupi."
            });
        }

        // 4. Cari Step Pertama Approval (Flow ID 3)
        const firstStep = await db.ApprovalStep.findOne({
            where: {
                approval_flow_id: 3,
                step_order: 1
            },
            transaction: t
        });

        if (!firstStep) {
            await t.rollback();
            return res.status(500).json({
                status: false,
                message: "Konfigurasi alur persetujuan tidak ditemukan. Silahkan hubungi admin."
            });
        }

        // 5. Simpan Pengajuan
        const newRequest = await db.SavingsWithdrawal.create({
            member_id: memberId,
            savings_account_id: account.savings_account_id,
            amount: amount,
            request_datetime: new Date(),
            status: 'PENDING',
            method: method || 'TRANSFER',
            bank_name: method === 'TRANSFER' ? bank_name : null,
            bank_account_no: method === 'TRANSFER' ? bank_account_no : null,
            approval_flow_id: 3,
            current_step_id: firstStep.approval_step_id
        }, { transaction: t });

        // Komit Transaksi
        await t.commit();

        return res.status(200).json({
            status: true,
            message: "Pengajuan berhasil dikirim. Menunggu persetujuan Pengawas.",
            data: {
                withdrawal_id: newRequest.withdrawal_id,
                amount: newRequest.amount,
                status: newRequest.status,
                next_approver: "Pengawas" // Anda bisa mengambil role_name dari firstStep jika ada join
            }
        });

    } catch (error) {
        // Batalkan semua perubahan jika terjadi error
        if (t) await t.rollback();

        console.error("Request Withdrawal Error:", error);
        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan: " + error.message
        });
    }
};

export default requestWithdrawal;