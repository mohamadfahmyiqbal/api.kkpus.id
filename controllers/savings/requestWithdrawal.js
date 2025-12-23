import db from "../../models/index.js";

const requestWithdrawal = async (req, res) => {
    const memberId = req.userId; // Menggunakan userId dari MidAnggota
    const { amount, category } = req.body; // Dari Frontend

    try {
        // 1. Cari akun berdasarkan member_id dan account_type
        const account = await db.MemberSavingsAccount.findOne({
            where: {
                member_id: memberId,
                account_type: category
            }
        });
        console.log(account);

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

        // 3. Simpan Pengajuan (Gunakan kolom primary key yang sudah diperbaiki)
        const newRequest = await db.SavingsWithdrawal.create({
            savings_account_id: account.savings_account_id, // Primary key yang benar
            amount: amount,
            withdrawal_date: new Date(),
            status: 'PENDING'
        });

        return res.status(200).json({
            status: true,
            message: "Pengajuan pencairan berhasil dikirim. Menunggu persetujuan admin.",
            data: newRequest
        });

    } catch (error) {
        console.log(error);

        console.error("Request Withdrawal Error:", error);
        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan pada server saat memproses data."
        });
    }
};

export default requestWithdrawal;