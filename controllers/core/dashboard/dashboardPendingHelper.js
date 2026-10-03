// PATH: controllers/core/dashboard/dashboardPendingHelper.js

import db from "../../../models/index.js";
import { Op } from "sequelize";
import { formatRp } from "./dashboardStatsHelper.js";

export const fetchPendingApprovals = async (programCategories) => {
  // A. Simpanan (Pencairan)
  const pendingWithdrawals = await db.SavingsWithdrawal.findAll({
    where: {
      status: "PENDING",
      member_saving_target_id: { [Op.is]: null },
    },
    include: [
      { model: db.MemberSavingsAccount, as: "savingsAccount", include: [{ model: db.Member, as: "member" }] },
      {
        model: db.ApprovalFlow,
        as: "flow",
        include: [{ model: db.ApprovalStep, as: "steps", include: [{ model: db.UserRole, as: "verifierRole" }] }],
      },
      {
        model: db.ApprovalStep,
        as: "currentStep",
        include: [{ model: db.UserRole, as: "verifierRole" }],
      },
      {
        model: db.Approval,
        as: "approvals",
        required: false,
        include: [
          {
            model: db.ApprovalStep,
            as: "step",
            include: [{ model: db.UserRole, as: "verifierRole", attributes: ["role_name"] }],
          },
        ],
      },
    ],
    limit: 10,
    order: [["created_at", "DESC"]],
  });

  // B. Jual Beli
  const jualBeliCategoryCondition = programCategories.length > 0
    ? { [Op.notIn]: [...programCategories, "Pendanaan Syariah UMKM"] }
    : { [Op.ne]: "Pendanaan Syariah UMKM" };

  const pendingJualBeli = await db.FinancingApplication.findAll({
    where: {
      status: "PENDING",
      category: jualBeliCategoryCondition,
    },
    include: [
      { model: db.Member, as: "member", attributes: ["full_name"] },
      {
        model: db.ApprovalFlow,
        as: "flow",
        include: [{ model: db.ApprovalStep, as: "steps", include: [{ model: db.UserRole, as: "verifierRole" }] }],
      },
      { model: db.ApprovalStep, as: "currentStep", include: [{ model: db.UserRole, as: "verifierRole" }] },
      {
        model: db.Approval,
        as: "approvals",
        include: [{ model: db.ApprovalStep, as: "step", include: [{ model: db.UserRole, as: "verifierRole" }] }],
      },
    ],
    limit: 10,
    order: [["created_at", "DESC"]],
  });

  // C. Program (Pembiayaan)
  let pendingFinancings = [];
  if (programCategories.length > 0) {
    pendingFinancings = await db.FinancingApplication.findAll({
      where: {
        status: "PENDING",
        category: { [Op.in]: programCategories },
      },
      include: [
        { model: db.Member, as: "member", attributes: ["full_name"] },
        {
          model: db.ApprovalFlow,
          as: "flow",
          include: [{ model: db.ApprovalStep, as: "steps", include: [{ model: db.UserRole, as: "verifierRole" }] }],
        },
        { model: db.ApprovalStep, as: "currentStep", include: [{ model: db.UserRole, as: "verifierRole" }] },
        {
          model: db.Approval,
          as: "approvals",
          include: [{ model: db.ApprovalStep, as: "step", include: [{ model: db.UserRole, as: "verifierRole" }] }],
        },
      ],
      limit: 10,
      order: [["created_at", "DESC"]],
    });
  }

  // Pendanaan Syariah (For Investasi Tab)
  const pendingPendanaanSyariah = await db.FinancingApplication.findAll({
    where: {
      status: "PENDING",
      category: "Pendanaan Syariah UMKM",
    },
    include: [
      { model: db.Member, as: "member", attributes: ["full_name"] },
      {
        model: db.ApprovalFlow,
        as: "flow",
        include: [{ model: db.ApprovalStep, as: "steps", include: [{ model: db.UserRole, as: "verifierRole" }] }],
      },
      { model: db.ApprovalStep, as: "currentStep", include: [{ model: db.UserRole, as: "verifierRole" }] },
    ],
    limit: 10,
    order: [["created_at", "DESC"]],
  });

  // D. Tabungan (Targets & Withdrawals)
  const pendingTabungan = await db.MemberSavingTarget.findAll({
    where: { status: "PENDING" },
    include: [
      { model: db.Member, as: "member", attributes: ["full_name"] },
      { model: db.SavingTarget, as: "savingTarget" },
      {
        model: db.ApprovalFlow,
        as: "flow",
        include: [{ model: db.ApprovalStep, as: "steps", include: [{ model: db.UserRole, as: "verifierRole" }] }],
      },
      { model: db.ApprovalStep, as: "currentStep", include: [{ model: db.UserRole, as: "verifierRole" }] },
      {
        model: db.Approval,
        as: "approvals",
        required: false,
        include: [
          {
            model: db.ApprovalStep,
            as: "step",
            include: [{ model: db.UserRole, as: "verifierRole", attributes: ["role_name"] }],
          },
        ],
      },
    ],
    limit: 10,
    order: [["created_at", "DESC"]],
  });

  const pendingTabunganWithdrawals = await db.SavingsWithdrawal.findAll({
    where: {
      status: "PENDING",
      member_saving_target_id: { [Op.not]: null },
    },
    include: [
      { model: db.Member, as: "member", attributes: ["full_name"] },
      { model: db.MemberSavingTarget, as: "savingTarget" },
      {
        model: db.ApprovalFlow,
        as: "flow",
        include: [{ model: db.ApprovalStep, as: "steps", include: [{ model: db.UserRole, as: "verifierRole" }] }],
      },
      { model: db.ApprovalStep, as: "currentStep", include: [{ model: db.UserRole, as: "verifierRole" }] },
      {
        model: db.Approval,
        as: "approvals",
        required: false,
        include: [
          {
            model: db.ApprovalStep,
            as: "step",
            include: [{ model: db.UserRole, as: "verifierRole", attributes: ["role_name"] }],
          },
        ],
      },
    ],
    limit: 10,
    order: [["created_at", "DESC"]],
  });

  // E. Investasi (Sukuk)
  const pendingInvestasi = await db.SukukOrder.findAll({
    where: { status: "PENDING" },
    include: [
      { model: db.Member, as: "member", attributes: ["full_name"] },
      { model: db.SukukIssue, as: "sukukIssue" },
    ],
    limit: 10,
    order: [["createdAt", "DESC"]],
  });

  return {
    simpanan: pendingWithdrawals.map((w) => ({
      id: w.withdrawal_id,
      member_id: w.member_id,
      name: w.savingsAccount?.member?.full_name || "Unknown",
      item: "Pencairan Simpanan",
      amount: formatRp(w.amount),
      date: w.created_at,
      flow: w.flow,
      currentStep: w.currentStep,
      final_status: w.status,
      approvals: w.approvals?.map((a) => (typeof a.toJSON === "function" ? a.toJSON() : a)),
    })),
    jualBeli: pendingJualBeli.map((j) => ({
      id: j.financing_id,
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
    })),
    program: pendingFinancings.map((f) => ({
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
    })),
    tabungan: [
      ...pendingTabungan.map((t) => {
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
      }),
      ...pendingTabunganWithdrawals.map((w) => ({
        id: w.withdrawal_id,
        member_id: w.member_id,
        name: w.member?.full_name || "Unknown",
        item: "Pencairan Tabungan",
        amount: formatRp(w.amount),
        date: w.created_at,
        flow: w.flow,
        currentStep: w.currentStep,
        final_status: w.status,
        approvals: w.approvals?.map((a) => (typeof a.toJSON === "function" ? a.toJSON() : a)),
      })),
    ],
    investasi: [
      ...pendingInvestasi.map((i) => {
        const isPengawasDone = i.is_approved_pengawas;
        const isKetuaDone = i.is_approved_ketua;
        const isBendaharaDone = i.is_approved_bendahara;

        let currentStepOrder = 1;
        let currentStepName = "Persetujuan Pengawas";
        let currentRoleName = "Pengawas";

        if (isPengawasDone && !isKetuaDone) {
          currentStepOrder = 2;
          currentStepName = "Persetujuan Ketua";
          currentRoleName = "Ketua";
        } else if (isKetuaDone && !isBendaharaDone) {
          currentStepOrder = 3;
          currentStepName = "Persetujuan Bendahara";
          currentRoleName = "Bendahara";
        } else if (isBendaharaDone) {
          currentStepOrder = 4;
          currentStepName = "Selesai";
          currentRoleName = "Selesai";
        }

        const mockFlow = {
          steps: [
            { id: 1, step_order: 1, step_name: "Persetujuan Pengawas", verifierRole: { role_name: "Pengawas" } },
            { id: 2, step_order: 2, step_name: "Persetujuan Ketua", verifierRole: { role_name: "Ketua" } },
            { id: 3, step_order: 3, step_name: "Persetujuan Bendahara", verifierRole: { role_name: "Bendahara" } },
          ],
        };

        const mockCurrentStep = {
          step_order: currentStepOrder,
          step_name: currentStepName,
          verifierRole: { role_name: currentRoleName },
        };

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
      }),
      ...pendingPendanaanSyariah.map((p) => ({
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
      })),
    ],
  };
};
