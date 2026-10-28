import { Op } from "sequelize";
import db from "../../models/index.js";
import { syncJualBeliReport } from "../../services/jualBeliReportSyncService.js";
import { syncFinancialSummary } from "../../services/financialSummarySyncService.js";

const { FinancingApplication, BillItem, Approval, GeneralTransaction } = db;

export const deleteJualBeli = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "ID transaksi jual beli diperlukan" });
    }

    // Cek apakah ada di FinancingApplication
    const financing = await FinancingApplication.findOne({
      where: { financing_id: id },
      transaction: t,
    });

    let memberId = null;

    if (financing) {
      memberId = financing.member_id;
      const financingId = financing.financing_id;

      // Hapus bill_items terkait
      await BillItem.destroy({
        where: { financing_application_id: financingId },
        transaction: t,
      }).catch(() => {});

      // Hapus approvals terkait jika ada
      if (Approval) {
        await Approval.destroy({
          where: {
            entity_ref: "financing_applications",
            entity_id: financingId,
          },
          transaction: t,
        }).catch(() => {});
      }

      // Hapus financing application
      await financing.destroy({ transaction: t });
    } else {
      // Cek apakah ada di GeneralTransaction
      const generalTx = await GeneralTransaction.findOne({
        where: { transaction_id: id },
        transaction: t,
      });

      if (generalTx) {
        memberId = generalTx.member_id;
        await generalTx.destroy({ transaction: t });
      } else {
        await t.rollback();
        return res.status(404).json({ success: false, message: "Transaksi tidak ditemukan" });
      }
    }

    await t.commit();

    // Trigger sync setelah transaksi selesai
    if (memberId) {
      setImmediate(async () => {
        try {
          await syncJualBeliReport(db.sequelize, memberId);
          await syncFinancialSummary(db.sequelize, memberId);
        } catch (e) {
          console.error("Sync error after delete:", e);
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data transaksi jual beli berhasil dihapus",
    });
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    console.error("Delete JualBeli Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Gagal menghapus data transaksi",
    });
  }
};

export const deleteBatchJualBeli = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Daftar ID transaksi tidak valid atau kosong",
      });
    }

    // Ambil data pembiayaan yang akan dihapus untuk dapatkan member_id list
    const financings = await FinancingApplication.findAll({
      where: {
        financing_id: { [Op.in]: ids },
      },
      attributes: ["financing_id", "member_id"],
      transaction: t,
    });

    const financingIds = financings.map((f) => f.financing_id);
    const memberIds = [...new Set(financings.map((f) => f.member_id))];

    if (financingIds.length > 0) {
      // Hapus bill items terkait
      await BillItem.destroy({
        where: { financing_application_id: { [Op.in]: financingIds } },
        transaction: t,
      }).catch(() => {});

      // Hapus approvals terkait jika ada
      if (Approval) {
        await Approval.destroy({
          where: {
            entity_ref: "financing_applications",
            entity_id: { [Op.in]: financingIds },
          },
          transaction: t,
        }).catch(() => {});
      }

      // Hapus financing applications
      await FinancingApplication.destroy({
        where: {
          financing_id: { [Op.in]: financingIds },
        },
        transaction: t,
      });
    }

    // Periksa juga jika ada di GeneralTransaction
    const generalTxs = await GeneralTransaction.findAll({
      where: { transaction_id: { [Op.in]: ids } },
      attributes: ["transaction_id", "member_id"],
      transaction: t,
    });

    if (generalTxs.length > 0) {
      const gMemberIds = generalTxs.map((g) => g.member_id);
      memberIds.push(...gMemberIds);
      await GeneralTransaction.destroy({
        where: { transaction_id: { [Op.in]: ids } },
        transaction: t,
      });
    }

    await t.commit();

    // Trigger sync setelah transaksi selesai
    if (memberIds.length > 0) {
      setImmediate(async () => {
        for (const mId of [...new Set(memberIds)]) {
          try {
            await syncJualBeliReport(db.sequelize, mId);
            await syncFinancialSummary(db.sequelize, mId);
          } catch (e) {
            console.error("Sync error after batch delete:", e);
          }
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: `Berhasil menghapus ${ids.length} data transaksi terpilih`,
      data: { deletedCount: ids.length },
    });
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    console.error("Delete Batch JualBeli Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Gagal menghapus data transaksi",
    });
  }
};
