import db from "../../models/index.js";
import { syncFinancialSummary } from "../../services/financialSummarySyncService.js";
import { syncJualBeliReport } from "../../services/jualBeliReportSyncService.js";

/**
 * Manual sync endpoint triggered by frontend after successful payment
 * Useful for local development where webhooks are not reachable.
 */
export const manualSyncSummary = async (req, res) => {
  try {
    const memberId = req.userId;

    if (!memberId) {
      return res.status(401).json({ status: false, message: "Otorisasi gagal." });
    }

    await syncFinancialSummary(db.sequelize, memberId);
    await syncJualBeliReport(db.sequelize, memberId);

    return res.status(200).json({ 
      status: true, 
      message: "Sinkronisasi laporan berhasil dipicu." 
    });
  } catch (error) {
    console.error("MANUAL_SYNC_ERROR:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};
