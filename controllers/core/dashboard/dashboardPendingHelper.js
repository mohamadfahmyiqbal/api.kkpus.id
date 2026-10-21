// PATH: controllers/core/dashboard/dashboardPendingHelper.js

import { getApprovalIncludes } from "./pendingApprovalFormatters.js";
import {
  fetchPendingWithdrawals,
  fetchPendingJualBeli,
  fetchPendingFinancings,
  fetchPendingPendanaanSyariah,
  fetchPendingTabunganData,
  fetchPendingSukukOrders,
} from "./pendingQueriesHelper.js";
import {
  fetchPendingManualPayments,
  categorizeManualPayments,
} from "./pendingManualPaymentsHelper.js";
import {
  mapWithdrawalItem,
  mapJualBeliItem,
  mapProgramFinancingItem,
  mapTabunganTargetItem,
  mapSukukOrderItem,
  mapPendanaanSyariahItem,
} from "./pendingItemMappers.js";

/**
 * Mengambil seluruh data pending approval untuk kategori dashboard admin
 * (Simpanan, Jual Beli, Program Pembiayaan, Tabungan Berjangka, Investasi Sukuk & Pendanaan, serta Pembayaran Manual)
 */
export const fetchPendingApprovals = async (programCategories = []) => {
  const approvalIncludes = getApprovalIncludes(true);

  // Jalankan query secara paralel agar performa dashboard optimal
  const [
    pendingWithdrawals,
    pendingJualBeli,
    pendingFinancings,
    pendingPendanaanSyariah,
    { targets: pendingTabungan, withdrawals: pendingTabunganWithdrawals },
    pendingInvestasi,
    pendingManualPayments,
  ] = await Promise.all([
    fetchPendingWithdrawals(approvalIncludes),
    fetchPendingJualBeli(programCategories, approvalIncludes),
    fetchPendingFinancings(programCategories, approvalIncludes),
    fetchPendingPendanaanSyariah(),
    fetchPendingTabunganData(approvalIncludes),
    fetchPendingSukukOrders(),
    fetchPendingManualPayments(),
  ]);

  // Kelompokkan setoran / pembayaran manual berdasarkan kategori
  const manual = categorizeManualPayments(pendingManualPayments, programCategories);

  return {
    registration: manual.registration,

    simpanan: [
      ...manual.simpanan,
      ...pendingWithdrawals.map((w) => mapWithdrawalItem(w, "Pencairan Simpanan")),
    ],

    jualBeli: [
      ...manual.jualBeli,
      ...pendingJualBeli.map(mapJualBeliItem),
    ],

    program: [
      ...manual.program,
      ...pendingFinancings.map(mapProgramFinancingItem),
    ],

    tabungan: [
      ...manual.tabungan,
      ...pendingTabungan.map(mapTabunganTargetItem),
      ...pendingTabunganWithdrawals.map((w) => mapWithdrawalItem(w, "Pencairan Tabungan")),
    ],

    investasi: [
      ...manual.investasi,
      ...pendingInvestasi.map(mapSukukOrderItem),
      ...pendingPendanaanSyariah.map(mapPendanaanSyariahItem),
    ],
  };
};
