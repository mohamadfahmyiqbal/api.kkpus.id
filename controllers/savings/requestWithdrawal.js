import db from "../../models/index.js";

const requestWithdrawal = async (req, res) => {
    const memberId = req.userId; // Menggunakan userId dari MidAnggota
    const { amount, category, method, bank_name, bank_account_no } = req.body; 

    try {
        // 1. Cari akun berdasarkan member_id dan account_type (kategori)
        const account = await db.MemberSavingsAccount.findOne({
            where: {
                member_id: memberId,
                account_type: category
            }
        });

        if (!account) {
            return res.status(404).json({
                status: false,
                message: `Akun simpanan untuk kategori '${category}' tidak ditemukan.`
            });
        }

        // 2. Validasi Saldo menggunakan current_balance
        if (parseFloat(account.current_balance) < parseFloat(amount)) {
            return res.status(400).json({
                status: false,
                message: "Maaf, saldo Anda tidak mencukupi untuk melakukan penarikan ini."
            });
        }

        // 3. Cari Step Pertama untuk Approval Flow Penarikan (Flow ID 3)
        // Berdasarkan data Anda, ini akan mencari Step Order 1 yang menghasilkan ID 13
        const firstStep = await db.ApprovalStep.findOne({
            where: {
                approval_flow_id: 3,
                step_order: 1
            }
        });

        if (!firstStep) {
            return res.status(500).json({
                status: false,
                message: "Konfigurasi alur persetujuan (Approval Flow) belum tersedia."
            });
        }

        // 4. Simpan Pengajuan ke tabel savings_withdrawals
        const newRequest = await db.SavingsWithdrawal.create({
            member_id: memberId,
            savings_account_id: account.savings_account_id,
            amount: amount,
            request_datetime: new Date(),
            status: 'PENDING',
            method: method || 'TRANSFER',
            bank_name: bank_name || null,
            bank_account_no: bank_account_no || null,
            approval_flow_id: 3, 
            current_step_id: firstStep.approval_step_id // Otomatis mengisi ID 13 (Pengawas)
        });

        return res.status(200).json({
            status: true,
            message: "Pengajuan pencairan berhasil dikirim. Menunggu persetujuan Pengawas.",
            data: {
                withdrawal_id: newRequest.withdrawal_id,
                amount: newRequest.amount,
                status: newRequest.status,
                next_approver: "Pengawas"
            }
        });

    } catch (error) {
        console.error("Request Withdrawal Error:", error);
        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan pada server saat memproses data: " + error.message
        });
    }
};

export default requestWithdrawal;