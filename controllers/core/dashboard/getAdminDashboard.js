// PATH: controllers/core/dashboard/getAdminDashboard.js

import db from "../../../models/index.js";
import { fetchAdminDashboardStats } from "./dashboardStatsHelper.js";
import { fetchPendingApprovals } from "./dashboardPendingHelper.js";

/**
 * Controller untuk mengambil data ringkasan admin dashboard:
 * 1. Financial statistic cards
 * 2. Categorized pending approvals
 * 3. Recent system notifications
 */
export const getAdminDashboard = async (req, res) => {
  try {
    // Ambil daftar nama produk pinjaman untuk membedakan kategori Program vs Jual Beli
    const loanProducts = await db.LoanProduct.findAll({ attributes: ["product_name"] });
    const programCategories = loanProducts.map((p) => p.product_name) || [];
    programCategories.push("Arisan");

    // 1. STATS CARDS
    const stats = await fetchAdminDashboardStats(programCategories);

    // 2. PENDING TRANSACTIONS (CATEGORIZED APPROVALS)
    const pendingCategorized = await fetchPendingApprovals(programCategories);

    // 3. RECENT NOTIFICATIONS
    const recentNotifications = await db.Notification.findAll({
      limit: 3,
      order: [["sent_datetime", "DESC"]],
    });

    const notifications =
      recentNotifications.length > 0
        ? recentNotifications.map((n, idx) => ({
            id: n.notification_id || idx,
            title: n.title,
            body: n.content,
            type: n.type?.toLowerCase() === "error" ? "danger" : n.type?.toLowerCase() || "info",
            time: n.sent_datetime,
          }))
        : [
            {
              id: 1,
              title: "Sistem Backup Berhasil",
              body: "Database telah di-backup otomatis.",
              type: "info",
              time: new Date(),
            },
          ];

    return res.status(200).json({
      success: true,
      data: {
        stats,
        pendingCategorized,
        notifications,
      },
    });
  } catch (error) {
    console.error("Error in getAdminDashboard:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil data dashboard.",
      error: error.message,
    });
  }
};

export default getAdminDashboard;
