import db from "../../models/index.js";

const requestSukukWithdrawal = async (req, res) => {
    const memberId = req.userId;
    const { orderId } = req.params;
    const { method, bank_name, bank_account_no, cash_name, cash_time, cash_location } = req.body;

    const t = await db.sequelize.transaction();

    try {
        // 1. Cari Order Sukuk
        const order = await db.SukukOrder.findOne({
            where: { order_id: orderId, member_id: memberId },
            transaction: t
        });

        if (!order) {
            await t.rollback();
            return res.status(404).json({
                status: false,
                message: "Pesanan sukuk tidak ditemukan."
            });
        }

        // 2. Validasi Status Order dan SukukIssue
        if (order.status !== 'PAID') {
            await t.rollback();
            return res.status(400).json({
                status: false,
                message: "Hanya pesanan yang sudah lunas (PAID) yang dapat dicairkan."
            });
        }

        const issue = await db.SukukIssue.findOne({
            where: { issue_id: order.sukuk_issue_id },
            transaction: t
        });

        if (!issue || issue.status !== 'COMPLETED') {
            await t.rollback();
            return res.status(400).json({
                status: false,
                message: "Pencairan belum dapat dilakukan. Masa investasi belum selesai (KOMPLET)."
            });
        }

        // 3. Set status order jadi WITHDRAWAL_REQUESTED dan simpan info rekening di tabel jika perlu
        // Karena kita belum ada tabel khusus withdrawal sukuk, kita cukup update status order.
        // Nanti Admin akan mentransfer ke rekening member yang ada di profil (atau rekening asal).
        
        await order.update({ status: 'WITHDRAWAL_REQUESTED' }, { transaction: t });

        await t.commit();

        return res.status(200).json({
            status: true,
            message: "Pengajuan pencairan investasi berhasil dikirim. Menunggu proses transfer dari admin.",
            data: { order_id: order.order_id }
        });

    } catch (error) {
        if (t) await t.rollback();
        console.error("Request Sukuk Withdrawal Error:", error);
        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan: " + error.message
        });
    }
};

export default requestSukukWithdrawal;
