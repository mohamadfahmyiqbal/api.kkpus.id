// 📁 controllers/savings/requestWithdrawal.js
import db from "../../models/index.js";

const requestWithdrawal = async (req, res) => {
    const memberId = req.userId;
    const { 
        amount, 
        category, // Ini berisi 'SS_SUKARELA' dari frontend
        method, 
        bank_name, 
        bank_account_no,
        cash_name,
        cash_time,
        cash_location 
    } = req.body;

    const t = await db.sequelize.transaction();

    try {
        // 1. Cari dulu ID Produk berdasarkan kodenya
        const product = await db.SavingsProduct.findOne({
            where: { product_code: category },
            transaction: t
        });

        if (!product) {
            await t.rollback();
            return res.status(404).json({
                status: false,
                message: "Kategori simpanan tidak valid."
            });
        }

        // 2. Cari akun simpanan member menggunakan saving_product_id
        const account = await db.MemberSavingsAccount.findOne({
            where: { 
                member_id: memberId,
                savings_product_id: product.savings_product_id // atau product_id tergantung nama kolom Anda
            },
            transaction: t
        });

        // Jika akun tidak ditemukan (berarti belum ada setoran awal)
        if (!account) {
            await t.rollback();
            return res.status(404).json({
                status: false,
                message: `Akun untuk ${product.type_name} belum tersedia. Silahkan lakukan setoran terlebih dahulu.`
            });
        }

        // 3. Validasi Saldo
        const withdrawalAmount = parseFloat(amount);
        if (parseFloat(account.current_balance) < withdrawalAmount) {
            await t.rollback();
            return res.status(400).json({
                status: false,
                message: "Maaf, saldo Anda tidak mencukupi."
            });
        }

        // 4. Cari Step Pertama Approval (Flow ID 7 untuk Penarikan Simpanan)
        const firstStep = await db.ApprovalStep.findOne({
            where: { approval_flow_id: 7, step_order: 1 },
            transaction: t
        });

        // 5. Buat Pengajuan Penarikan
        const newRequest = await db.SavingsWithdrawal.create({
            member_id: memberId,
            savings_account_id: account.savings_account_id,
            amount: withdrawalAmount,
            request_datetime: new Date(),
            status: 'approval_pengawas', // Menunggu persetujuan pertama
            method: method || 'TRANSFER',
            // Data Transfer
            bank_name: method === 'TRANSFER' ? bank_name : null,
            bank_account_no: method === 'TRANSFER' ? bank_account_no : null,
            // Data Tunai
            cash_name: method === 'TUNAI' ? cash_name : null,
            cash_time: method === 'TUNAI' ? cash_time : null,
            cash_location: method === 'TUNAI' ? cash_location : null,
            approval_flow_id: 7,
            current_step_id: firstStep?.approval_step_id || null
        }, { transaction: t });

        await t.commit();

        return res.status(200).json({
            status: true,
            message: "Pengajuan berhasil dikirim. Menunggu persetujuan Pengawas.",
            data: { withdrawal_id: newRequest.withdrawal_id }
        });

    } catch (error) {
        if (t) await t.rollback();
        console.error("Request Withdrawal Error:", error);
        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan: " + error.message
        });
    }
};

export default requestWithdrawal;