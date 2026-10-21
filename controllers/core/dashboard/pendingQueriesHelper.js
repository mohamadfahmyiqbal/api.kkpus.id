// PATH: controllers/core/dashboard/pendingQueriesHelper.js

import db from "../../../models/index.js";
import { Op } from "sequelize";
import { getApprovalIncludes } from "./pendingApprovalFormatters.js";

/**
 * Fetch pending simpanan withdrawals (bukan target tabungan)
 */
export const fetchPendingWithdrawals = async (approvalIncludes) => {
  return db.SavingsWithdrawal.findAll({
    where: {
      status: "PENDING",
      member_saving_target_id: { [Op.is]: null },
    },
    include: [
      {
        model: db.MemberSavingsAccount,
        as: "savingsAccount",
        include: [{ model: db.Member, as: "member" }],
      },
      ...approvalIncludes,
    ],
    limit: 10,
    order: [["created_at", "DESC"]],
  });
};

/**
 * Fetch pending pembiayaan kategori Jual Beli
 */
export const fetchPendingJualBeli = async (programCategories, approvalIncludes) => {
  const jualBeliCategoryCondition =
    programCategories.length > 0
      ? { [Op.notIn]: [...programCategories, "Pendanaan Syariah UMKM"] }
      : { [Op.ne]: "Pendanaan Syariah UMKM" };

  return db.FinancingApplication.findAll({
    where: {
      status: "PENDING",
      category: jualBeliCategoryCondition,
    },
    include: [
      { model: db.Member, as: "member", attributes: ["full_name", "member_id"] },
      {
        model: db.BillItem,
        as: "installments",
        where: { category_code: "TRANSACTION_DOWN_PAYMENT" },
        required: false,
        include: [
          {
            model: db.Bill,
            as: "bill",
            required: false,
            include: [
              {
                model: db.Transaction,
                as: "payments",
                required: false,
              },
            ],
          },
        ],
      },
      ...approvalIncludes,
    ],
    limit: 10,
    order: [["created_at", "DESC"]],
  });
};

/**
 * Fetch pending pembiayaan kategori Program (Pinjaman / Arisan / dll)
 */
export const fetchPendingFinancings = async (programCategories, approvalIncludes) => {
  if (!programCategories || programCategories.length === 0) return [];
  return db.FinancingApplication.findAll({
    where: {
      status: "PENDING",
      category: { [Op.in]: programCategories },
    },
    include: [
      { model: db.Member, as: "member", attributes: ["full_name"] },
      ...approvalIncludes,
    ],
    limit: 10,
    order: [["created_at", "DESC"]],
  });
};

/**
 * Fetch pending pembiayaan kategori Pendanaan Syariah UMKM (untuk Investasi)
 */
export const fetchPendingPendanaanSyariah = async () => {
  return db.FinancingApplication.findAll({
    where: {
      status: "PENDING",
      category: "Pendanaan Syariah UMKM",
    },
    include: [
      { model: db.Member, as: "member", attributes: ["full_name"] },
      ...getApprovalIncludes(false),
    ],
    limit: 10,
    order: [["created_at", "DESC"]],
  });
};

/**
 * Fetch pending target tabungan berjangka & pencairan tabungan
 */
export const fetchPendingTabunganData = async (approvalIncludes) => {
  const [targets, withdrawals] = await Promise.all([
    db.MemberSavingTarget.findAll({
      where: { status: "PENDING" },
      include: [
        { model: db.Member, as: "member", attributes: ["full_name"] },
        { model: db.SavingTarget, as: "savingTarget" },
        ...approvalIncludes,
      ],
      limit: 10,
      order: [["created_at", "DESC"]],
    }),
    db.SavingsWithdrawal.findAll({
      where: {
        status: "PENDING",
        member_saving_target_id: { [Op.not]: null },
      },
      include: [
        { model: db.Member, as: "member", attributes: ["full_name"] },
        { model: db.MemberSavingTarget, as: "savingTarget" },
        ...approvalIncludes,
      ],
      limit: 10,
      order: [["created_at", "DESC"]],
    }),
  ]);

  return { targets, withdrawals };
};

/**
 * Fetch pending order Sukuk
 */
export const fetchPendingSukukOrders = async () => {
  return db.SukukOrder.findAll({
    where: { status: "PENDING" },
    include: [
      { model: db.Member, as: "member", attributes: ["full_name"] },
      { model: db.SukukIssue, as: "sukukIssue" },
    ],
    limit: 10,
    order: [["createdAt", "DESC"]],
  });
};
