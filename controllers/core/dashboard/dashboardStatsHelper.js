// PATH: controllers/core/dashboard/dashboardStatsHelper.js

import db from "../../../models/index.js";
import { Op } from "sequelize";

export const formatRp = (amount) => {
  if (!amount || amount === 0) return "Rp 0";
  const val = parseFloat(amount);
  return `Rp ${val.toLocaleString("id-ID")}`;
};

export const fetchAdminDashboardStats = async (programCategories = []) => {
  // 1. Total Anggota
  const finalTotalAnggota = await db.Member.count();

  // 2. Total Simpanan (Pokok, Wajib, Sukarela dari tabel savings status COMPLETED)
  let totalSimpanan = 0;
  if (db.Savings) {
    totalSimpanan = await db.Savings.sum("amount", {
      where: { status: "COMPLETED" },
    });
  }
  // Jika tabel savings kosong, fallback ke tabel Account
  if (!totalSimpanan && db.Account) {
    totalSimpanan = await db.Account.sum("current_balance", {
      where: {
        account_type: { [Op.in]: ["SAVINGS", "SW_POKOK", "SW_WAJIB", "SS_SUKARELA"] },
      },
    });
  }

  // 3. Total Jual Beli (FinancingApplication di luar kategori program)
  let totalJualBeli = 0;
  if (db.FinancingApplication) {
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
  }

  // 4. Total Program (FinancingApplication dalam kategori program)
  let totalProgram = 0;
  if (db.FinancingApplication && programCategories.length > 0) {
    totalProgram = await db.FinancingApplication.sum("amount_requested", {
      where: {
        status: { [Op.in]: ["ACTIVE", "APPROVED", "COMPLETED"] },
        category: { [Op.in]: programCategories },
      },
    });
  }

  // 5. Total Tabungan (dari member_saving_targets atau accounts)
  let totalTabungan = 0;
  if (db.MemberSavingTarget) {
    totalTabungan = await db.MemberSavingTarget.sum("current_balance", {
      where: { status: { [Op.in]: ["ACTIVE", "COMPLETED"] } },
    });
    if (!totalTabungan) {
      totalTabungan = await db.MemberSavingTarget.sum("current_balance");
    }
  }
  if (!totalTabungan && db.Account) {
    totalTabungan = await db.Account.sum("current_balance", {
      where: { account_type: "TABUNGAN_DEPOSIT" },
    });
  }

  // 6. Total Investasi (dari sukuk_orders atau accounts)
  let totalInvestasi = 0;
  if (db.SukukOrder) {
    totalInvestasi = await db.SukukOrder.sum("amount", {
      where: { status: { [Op.in]: ["APPROVED", "COMPLETED", "ACTIVE"] } },
    });
    if (!totalInvestasi) {
      totalInvestasi = await db.SukukOrder.sum("amount");
    }
  }
  if (!totalInvestasi && db.Account) {
    totalInvestasi = await db.Account.sum("current_balance", {
      where: { account_type: "SUKUK_INVESTMENT" },
    });
  }

  return [
    { title: "Total Anggota", value: finalTotalAnggota.toString(), icon: "Users", color: "primary", trend: "Anggota" },
    { title: "Total Simpanan", value: formatRp(totalSimpanan || 0), icon: "Wallet", color: "success", trend: "Simpanan" },
    { title: "Total Jual Beli", value: formatRp(totalJualBeli || 0), icon: "ShoppingCart", color: "info", trend: "Jual Beli" },
    { title: "Total Program", value: formatRp(totalProgram || 0), icon: "Heart", color: "danger", trend: "Program" },
    { title: "Total Tabungan", value: formatRp(totalTabungan || 0), icon: "Bank", color: "warning", trend: "Tabungan" },
    { title: "Total Investasi", value: formatRp(totalInvestasi || 0), icon: "TrendUp", color: "dark", trend: "Investasi" },
  ];
};
