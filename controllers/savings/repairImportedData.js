import db from "../../models/index.js";
import { syncSavingsReportList } from "../../services/savingsReportSyncService.js";
import { syncFinancialSummary } from "../../services/financialSummarySyncService.js";

const {
  Savings, Member, BillItem, Bill, BillType, Transaction, Account
} = db;

/**
 * Repair imported simpanan data yang dibuat dengan code sebelumnya (tanpa bills & transactions).
 * Iterasi semua record Savings dan "repair" tagihan, ledger, dan riwayat transaksi anggota.
 *
 * Endpoint: POST /savings/repair-imported-data
 */
export const repairImportedData = async (req, res) => {
  let t;
  try {
    const savedRecords = await Savings.findAll({
      where: { status: "COMPLETED" },
      include: [
        { model: Member, as: "member", attributes: ["member_id", "member_no", "full_name"] }
      ],
      transaction: undefined
    });

    if (!savedRecords || savedRecords.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Tidak ada data simpanan anggota yang perlu direparasi.",
        data: { totalRepaired: 0 }
      });
    }

    t = await db.sequelize.transaction();

    let totalBillsPaid = 0;
    let totalBillsCreated = 0;
    let totalTransactionsCreated = 0;
    let totalAccountsUpdated = 0;

    for (const s of savedRecords) {
      const member = s.member;
      if (!member || !s.member_id) continue;

      // --- Ledger Account update ---
      if (Account) {
        const billTypeCode = s.savings_type === "POKOK" ? "SW_POKOK" : s.savings_type === "WAJIB" ? "SW_WAJIB" : "SS_SUKARELA";
        const shortMemberId = s.member_id.toString().substring(0, 8);

        const typeAcc = await Account.findOrCreate({
          where: { member_id: s.member_id, account_type: billTypeCode },
          defaults: { account_no: `ACC-${billTypeCode}-${shortMemberId}`, current_balance: 0 },
          transaction: t
        });
        if (typeAcc[0]) {
          await typeAcc[0].increment("current_balance", { by: parseFloat(s.amount), transaction: t });
          totalAccountsUpdated++;
        }

        const mainAcc = await Account.findOrCreate({
          where: { member_id: s.member_id, account_type: "SAVINGS" },
          defaults: { account_no: `ACC-TOTAL-${shortMemberId}`, current_balance: 0 },
          transaction: t
        });
        if (mainAcc[0]) {
          await mainAcc[0].increment("current_balance", { by: parseFloat(s.amount), transaction: t });
          totalAccountsUpdated++;
        }
      }

      // --- Bill / Transaction repair ---
      const billTypeCode = s.savings_type === "POKOK" ? "SW_POKOK" : s.savings_type === "WAJIB" ? "SW_WAJIB" : "SS_SUKARELA";
      let billType = null;
      if (BillType) {
        billType = await BillType.findOne({
          where: { type_code: billTypeCode },
          transaction: t
        });
      }

      // 1. Cek tagihan UNPAID
      let matchedUnpaidItem = null;
      if (BillItem && (s.savings_type === "POKOK" || s.savings_type === "WAJIB")) {
        matchedUnpaidItem = await BillItem.findOne({
          where: {
            member_id: s.member_id,
            category_code: billTypeCode,
            status: "UNPAID"
          },
          order: [["due_date", "ASC"]],
          transaction: t
        });
      }

      let targetBillId = null;

      if (matchedUnpaidItem) {
        await matchedUnpaidItem.update({
          status: "PAID",
          due_date: new Date(),
        }, { transaction: t });
        targetBillId = matchedUnpaidItem.bill_id;
        totalBillsPaid++;
      } else {
        if (Bill) {
          const newBill = await Bill.create({
            member_id: s.member_id,
            bill_type_id: billType ? billType.bill_type_id : null,
            description: `Repair Simpanan ${s.savings_type}`,
            amount: parseFloat(s.amount),
            due_date: new Date(),
            status: "PAID",
          }, { transaction: t });
          targetBillId = newBill.bill_id;
        }

        if (BillItem) {
          await BillItem.create({
            bill_id: targetBillId,
            member_id: s.member_id,
            bill_type_id: billType ? billType.bill_type_id : null,
            category_code: billTypeCode,
            description: `Repair Simpanan ${s.savings_type}`,
            amount: parseFloat(s.amount),
            due_date: new Date(),
            status: "PAID",
          }, { transaction: t });
          totalBillsCreated++;
        }
      }

      if (Transaction) {
        const shortMemberId = s.member_id.substring(0, 8);
        const midtransOrderId = `REP-${billTypeCode}-${shortMemberId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        await Transaction.create({
          member_id: s.member_id,
          bill_id: targetBillId,
          midtrans_order_id: midtransOrderId,
          amount: parseFloat(s.amount),
          tx_type: "SETORAN",
          tx_category: `Repair Simpanan ${s.savings_type === "POKOK" ? "Pokok" : s.savings_type === "WAJIB" ? "Wajib" : "Sukarela"}`,
          status: "COMPLETED",
          is_ledger_recorded: true,
          created_at: new Date(),
          updated_at: new Date(),
        }, { transaction: t });
        totalTransactionsCreated++;
      }
    }

    await t.commit();

    // --- Report sync ---
    try {
      await syncSavingsReportList(db.sequelize);
    } catch (err) {
      console.error("[Repair] syncSavingsReportList failed:", err.message);
    }

    // Financial summary per member
    const memberIds = new Set(savedRecords.map((s) => s.member_id));
    for (const mId of memberIds) {
      try {
        await syncFinancialSummary(db.sequelize, mId);
      } catch (err) {
        console.error(`[Repair] syncFinancialSummary failed for member ${mId}:`, err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Data simpanan anggota berhasil direparasi tanpa perlu import ulang.",
      data: {
        totalSavingsProcessed: savedRecords.length,
        totalAccountsUpdated,
        totalBillsPaid,
        totalBillsCreated,
        totalTransactionsCreated,
        membersSynced: memberIds.size,
      }
    });

  } catch (error) {
    if (t) await t.rollback();
    console.error("[Repair] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat reparasi data import.",
      error: error.message
    });
  }
};
