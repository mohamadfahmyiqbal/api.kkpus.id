// 📁 controllers/webhooks/irisWebhook.js
import db from "../../models/index.js";
import { performFinalAction } from "../core/approvals/performFinalAction.js";
import { syncFinancialSummary } from "../../services/financialSummarySyncService.js";
import { syncSavingsReportList } from "../../services/savingsReportSyncService.js";

export const irisNotification = async (req, res) => {
    // Iris mengirimkan data dalam format yang sedikit berbeda tergantung tipenya
    const { reference_no, status, error_message } = req.body; 
    let transaction;

    try {
        // 1. Cek awal tanpa lock untuk efisiensi
        const withdrawal = await db.SavingsWithdrawal.findOne({
            where: { midtrans_transaction_id: reference_no } // Sesuaikan field nama di DB
        });

        if (!withdrawal) return res.status(404).send("Reference Not Found");

        // CEGAH DOUBLE PROCESSING: Jika sudah sukses, langsung OK
        if (withdrawal.status === 'SUCCESS' || withdrawal.status === 'COMPLETED') {
            return res.status(200).send("Already Processed");
        }

        transaction = await db.sequelize.transaction();

        // 2. Lock record untuk update
        const lockedWd = await db.SavingsWithdrawal.findByPk(withdrawal.withdrawal_id, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        // 3. Update Log Midtrans Disbursement (Audit Trail)
        await db.MidtransDisbursement.update(
            { 
                status: status.toUpperCase(),
                response_data: JSON.stringify(req.body),
                error_message: error_message || null
            },
            { 
                where: { midtrans_transaction_id: reference_no },
                transaction 
            }
        );

        if (status === 'completed') {
            // A. EKSEKUSI PEMBUKUAN (Potong Saldo & Ledger)
            // Pastikan performFinalAction menangani pengurangan current_balance di tabel accounts
            await performFinalAction({
                entityRef: "savings_withdrawal",
                entityId: lockedWd.withdrawal_id, // Kirim ID saja agar performFinalAction bisa lock ulang jika perlu
                transaction,
                approverId: null 
            });

            // B. UPDATE STATUS FINAL
            await lockedWd.update({ 
                status: 'COMPLETED',
                disbursement_at: new Date() 
            }, { transaction });

        } else if (status === 'failed' || status === 'rejected') {
            // C. HANDLING GAGAL
            // Status dikembalikan ke READY_TO_PAY atau APPROVED agar tombol "Bayar" muncul lagi
            await lockedWd.update({ 
                status: 'READY_TO_PAY',
                note: `Gagal cair: ${error_message}` 
            }, { transaction });
        }

        await transaction.commit();
        
        if (status === 'completed') {
            await syncFinancialSummary(db.sequelize, withdrawal.member_id);
            await syncSavingsReportList(db.sequelize);
        }
        
        // 4. Notifikasi ke User (Optional)
        // Anda bisa memicu socket.io atau Push Notification di sini setelah commit
        
        res.status(200).send('OK');
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error("IRIS_WEBHOOK_ERROR:", error);
        res.status(500).send(error.message);
    }
};