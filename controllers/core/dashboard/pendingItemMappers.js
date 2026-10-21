// PATH: controllers/core/dashboard/pendingItemMappers.js

import { formatRp } from "./dashboardStatsHelper.js";
import {
  normalizeApprovals,
  buildSukukApprovalProgress,
} from "./pendingApprovalFormatters.js";

export const mapWithdrawalItem = (w, itemLabel = "Pencairan Simpanan") => ({
  id: w.withdrawal_id,
  member_id: w.member_id,
  name: w.savingsAccount?.member?.full_name || w.member?.full_name || "Unknown",
  item: itemLabel,
  amount: formatRp(w.amount),
  date: w.created_at,
  flow: w.flow,
  currentStep: w.currentStep,
  final_status: w.status,
  approvals: normalizeApprovals(w.approvals),
});

export const mapJualBeliItem = (j) => {
  let dpPayment = null;
  if (j.installments && j.installments.length > 0) {
    for (const inst of j.installments) {
      if (inst.bill?.payments && inst.bill.payments.length > 0) {
        dpPayment = inst.bill.payments.find((p) => p.proof_of_transfer) || inst.bill.payments[0];
        if (dpPayment) break;
      }
    }
  }

  const proofUrl = dpPayment?.proof_of_transfer || j.proof_of_transfer || j.transfer_proof_path || null;
  const isDPPaid = j.installments?.some((inst) => inst.status === "PAID") || dpPayment?.status === "PAID";
  const hasUploadedDP = isDPPaid || !!proofUrl;

  return {
    id: j.financing_id,
    financing_id: j.financing_id,
    member_id: j.member_id,
    name: j.member?.full_name || "Unknown",
    item: `Jual Beli ${j.category || ""}`,
    amount: formatRp(j.item_price || j.amount_requested),
    date: j.createdAt || j.created_at,
    flow: j.flow,
    currentStep: j.currentStep,
    final_status: j.status,
    principal_amount: j.amount_requested,
    down_payment: j.down_payment || 0,
    tenure: j.cooperation_months || 0,
    monthly_installment: j.monthly_installment || 0,
    margin_amount: j.margin_amount || 0,
    total_tagihan: j.total_tagihan || 0,
    approvals: j.approvals,
    dp_payment: dpPayment,
    has_uploaded_dp: hasUploadedDP,
    has_paid_dp: isDPPaid,
    dp_proof_url: proofUrl,
  };
};

export const mapProgramFinancingItem = (f) => ({
  id: f.financing_id,
  member_id: f.member_id,
  name: f.member?.full_name || "Unknown",
  item: `Pembiayaan ${f.category || "Baru"}`,
  amount: formatRp(f.amount_requested),
  date: f.createdAt || f.created_at,
  flow: f.flow,
  currentStep: f.currentStep,
  final_status: f.status,
  principal_amount: f.amount_requested,
  down_payment: f.down_payment || 0,
  tenure: f.cooperation_months || 0,
  monthly_installment: f.monthly_installment || 0,
  disbursement_method: f.metode_pencairan || f.disbursement_method || "-",
  bank_name: f.bank_tujuan || f.bank_name || "",
  bank_account_no: f.no_rekening || f.bank_account_no || "",
  approvals: f.approvals,
});

export const mapTabunganTargetItem = (t) => {
  const targetAmount = t.target_amount || t.savingTarget?.target_amount || 0;
  const termMonths = t.term_months || t.savingTarget?.term_months || 0;
  const minMonthlyDeposit = t.monthly_deposit || t.savingTarget?.min_monthly_deposit || 0;
  const category = t.savingTarget?.category || t.category || "";
  const itemName = t.savingTarget?.target_name || category || "Target Tabungan";

  return {
    id: t.member_saving_target_id,
    member_id: t.member_id,
    name: t.member?.full_name || "Unknown",
    item: itemName,
    amount: formatRp(targetAmount),
    date: t.createdAt || t.created_at,
    category,
    term_months: termMonths,
    min_monthly_deposit: minMonthlyDeposit,
    target_amount: targetAmount,
    flow: t.flow,
    currentStep: t.currentStep,
    final_status: t.status,
    approvals: t.approvals,
  };
};

export const mapSukukOrderItem = (i) => {
  const { mockFlow, mockCurrentStep } = buildSukukApprovalProgress(i);
  return {
    id: i.order_id,
    member_id: i.member_id,
    name: i.member?.full_name || "Unknown",
    member_type: i.member?.member_type || "Anggota Reguler",
    item: i.sukukIssue?.name || "Investasi Sukuk",
    amount: formatRp(i.amount),
    date: i.createdAt || i.created_at,
    status: i.status,
    final_status: i.status,
    flow: mockFlow,
    currentStep: mockCurrentStep,
    sukuk_name: i.sukukIssue?.name || "Sukuk Halal",
    sukuk_publisher: i.sukukIssue?.publisher || "Pemerintah RI / Koperasi",
    sukuk_type: i.sukukIssue?.type || "Sukuk Ritel",
    sukuk_yield: i.sukukIssue?.yield_percentage || 0,
    is_approved_pengawas: i.is_approved_pengawas,
    is_approved_ketua: i.is_approved_ketua,
    is_approved_bendahara: i.is_approved_bendahara,
  };
};

export const mapPendanaanSyariahItem = (p) => ({
  id: p.financing_id,
  name: p.member?.full_name || "Unknown",
  item: "Pendanaan Syariah",
  amount: formatRp(p.amount_requested),
  date: p.createdAt || p.created_at,
  status: p.status,
  final_status: p.status,
  flow: p.flow,
  currentStep: p.currentStep,
  is_pendanaan: true,
  principal_amount: p.amount_requested,
  down_payment: p.down_payment || 0,
  tenure: p.cooperation_months || 0,
  monthly_installment: p.monthly_installment || 0,
  business_name: p.business_name || null,
  business_sector: p.business_sector || null,
  business_address: p.business_address || null,
  estimated_yearly_turnover: p.estimated_yearly_turnover || 0,
  estimated_monthly_turnover: p.estimated_monthly_turnover || 0,
  investor_profit_share: p.investor_profit_share || 0,
  file_evidence: p.file_evidence || null,
  contract_proof: p.contract_proof || null,
  additional_documents: p.additional_documents || null,
  purpose: p.purpose || null,
});
