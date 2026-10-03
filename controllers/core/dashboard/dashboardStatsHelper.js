// PATH: controllers/core/dashboard/dashboardStatsHelper.js

import db from "../../../models/index.js";
import { Op } from "sequelize";

export const formatRp = (amount) => {
  if (!amount || amount === 0) return "Rp 0";
  const val = parseFloat(amount);
  return `Rp ${val.toLocaleString("id-ID")}`;
};

export const fetchAdminDashboardStats = async (programCategories) => {
  // Total Anggota
  const finalTotalAnggota = await db.Member.count();

  // Total Simpanan (Pokok, Wajib, Sukarela)
  const totalSimpanan = await db.Account.sum("current_balance", {
    where: {
      account_type: { [Op.in]: ["SAVINGS", "SW_POKOK", "SW_WAJIB", "SS_SUKARELA"] },
    },
  });

  // Total Jual Beli (FinancingApplication di luar kategori program)
  let totalJualBeli = 0;
  if (programCategories.length > 0) {
    totalJualBeli = await db.FinancingApplication.sum("amount_requested", {
      where: {
        status: { [Op.in]: ["ACTIVE", "APPROVED", "COMPLETED"] },
        category: { [Op.notIn]: programCategories },
      },
    });
  } else {
    totalJualBeli = await db.FinancingApplication.sum("amount_requested", {
      where: { status: { [Op.in]: ["ACTIVE", "APPROVED", "COMPLETED"] } },
    });
  }

  // Total Program (FinancingApplication dalam kategori program)
  let totalProgram = 0;
  if (programCategories.length > 0) {
    totalProgram = await db.FinancingApplication.sum("amount_requested", {
      where: {
        status: { [Op.in]: ["ACTIVE", "APPROVED", "COMPLETED"] },
        category: { [Op.in]: programCategories },
      },
    });
  }

  // Total Tabungan & Investasi
  const totalTabungan = await db.Account.sum("current_balance", {
    where: { account_type: "TABUNGAN_DEPOSIT" },
  });

  const totalInvestasi = await db.Account.sum("current_balance", {
    where: { account_type: "SUKUK_INVESTMENT" },
  });

  return [
    { title: "Total Anggota", value: finalTotalAnggota.toString(), icon: "Users", color: "primary", trend: "Anggota" },
    { title: "Total Simpanan", value: formatRp(totalSimpanan || 0), icon: "Wallet", color: "success", trend: "Simpanan" },
    { title: "Total Jual Beli", value: formatRp(totalJualBeli || 0), icon: "ShoppingCart", color: "info", trend: "Jual Beli" },
    { title: "Total Program", value: formatRp(totalProgram || 0), icon: "Heart", color: "danger", trend: "Program" },
    { title: "Total Tabungan", value: formatRp(totalTabungan || 0), icon: "Bank", color: "warning", trend: "Tabungan" },
    { title: "Total Investasi", value: formatRp(totalInvestasi || 0), icon: "TrendUp", color: "dark", trend: "Investasi" },
  ];
};
