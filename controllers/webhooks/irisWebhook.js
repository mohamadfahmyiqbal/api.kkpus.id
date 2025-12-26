import db from "../../models/index.js";
import { performFinalAction } from "../core/approvals/performFinalAction.js";

export const irisNotification = async (req, res) => {
    const { reference_no, status } = req.body; // status: 'completed' atau 'failed'
    let transaction;

    try {
        transaction = await db.sequelize.transaction();

        const withdrawal = await db.SavingsWithdrawal.findOne({
            where: { reference_no: reference_no },
            transaction
        });

        if (!withdrawal) return res.status(404).send("Reference Not Found");

        if (status === 'completed') {
            // A. POTONG SALDO & CATAT MUTASI
            await performFinalAction({
                entityRef: "savings_withdrawal",
                entity: withdrawal,
                transaction,
                approverId: null // Otomatis sistem
            });

            // B. UPDATE STATUS FINAL
            await withdrawal.update({ status: 'SUCCESS' }, { transaction });
        } else if (status === 'failed' || status === 'rejected') {
            // Jika gagal, kembalikan status ke APPROVED agar Bendahara bisa coba lagi
            await withdrawal.update({ status: 'APPROVED' }, { transaction });
        }

        await transaction.commit();
        res.status(200).send('OK');
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).send(error.message);
    }
};