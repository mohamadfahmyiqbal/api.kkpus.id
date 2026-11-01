import db from "../../models/index.js";
import { Op } from "sequelize";

const mapTransactionStatuses = (statusFilter) => {
  if (!statusFilter) return ["PAID", "PENDING_VERIFICATION", "PENDING", "SETTLED", "COMPLETED", "REJECTED", "FAILED"];
  const s = statusFilter.toLowerCase();
  if (s === "selesai") return ["PAID", "COMPLETED", "APPROVED", "SETTLED"];
  if (s.includes("verifikasi")) return ["PENDING_VERIFICATION"];
  if (s === "pending") return ["PENDING", "PENDING_VERIFICATION"];
  if (s === "ditolak") return ["REJECTED", "FAILED", "CANCELLED", "EXPIRED"];
  return [statusFilter];
};

const mapWithdrawalStatuses = (statusFilter) => {
  if (!statusFilter) return null;
  const s = statusFilter.toLowerCase();
  if (s === "selesai") return ["DISBURSED", "APPROVED", "COMPLETED"];
  if (s.includes("verifikasi") || s === "pending") return ["PENDING", "WAITING_APPROVAL", "READY_TO_PAY"];
  if (s === "ditolak") return ["REJECTED", "FAILED", "CANCELLED"];
  return [statusFilter];
};

const mapSavingsStatuses = (statusFilter) => {
  if (!statusFilter) return null;
  const s = statusFilter.toLowerCase();
  if (s === "selesai") return ["COMPLETED", "APPROVED"];
  if (s.includes("verifikasi") || s === "pending") return ["PENDING", "PENDING_VERIFICATION"];
  if (s === "ditolak") return ["REJECTED", "CANCELLED"];
  return [statusFilter];
};

export const getAdminSavingsTransactions = async (req, res) => {
  try {
    const { type, tx_category, page = 1, limit = 10, search = "", status = "" } = req.query;
    const offset = (page - 1) * limit;

    let results = [];
    let count = 0;

    // Check if we should fetch from Billing system (including Sukarela if it exists there)
    // Most deposits (Pokok, Wajib, Sukarela Setoran) are likely in Billing Transactions
    if (tx_category !== "PENCAIRAN") {
      const { count: tCount, rows: transactions } = await db.Transaction.findAndCountAll({
        where: {
          status: { [Op.in]: mapTransactionStatuses(status) },
        },
        include: [
          {
            model: db.Member,
            as: "member",
            attributes: ["full_name", "member_id", "member_no"],
            where: search ? {
              [Op.or]: [
                { full_name: { [Op.like]: `%${search}%` } },
                { member_no: { [Op.like]: `%${search}%` } },
              ]
            } : {}
          },
          {
            model: db.Bill,
            as: "bill",
            required: true,
            include: [
              {
                model: db.BillItem,
                as: "items",
                required: true,
                where: {
                  [Op.or]: [
                    { description: { [Op.like]: `%${type}%` } },
                    { category_code: { [Op.like]: `%${type}%` } }
                  ]
                },
                attributes: ["amount", "description"]
              }
            ]
          }
        ],
        order: [["created_at", "DESC"]],
        limit: parseInt(limit),
        offset: offset
      });

      if (tCount > 0) {
        count = tCount;
        results = transactions.map(t => {
          // Calculate amount from matched items (e.g., only Pokok or only Wajib)
          let itemAmount = t.amount;
          if (t.bill && t.bill.items && t.bill.items.length > 0) {
            itemAmount = t.bill.items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
          }
          
          const isPending = t.status === "PENDING_VERIFICATION";

          return {
            id: t.transaction_id,
            date: t.created_at,
            member: t.member?.full_name || "Unknown",
            member_id: t.member_id,
            member_no: t.member?.member_no || "-",
            type: "Setoran",
            amount: itemAmount,
            balance: "-", 
            status: isPending ? "Menunggu Verifikasi" : "Selesai",
            raw_status: t.status,
            proof_of_transfer: t.proof_of_transfer,
            sender_name: t.sender_name,
            sender_bank: t.sender_bank,
            is_manual_payment: isPending,
            product_name: t.bill?.items?.[0]?.description || type
          };
        });
      }
    }

    // If no results found in Billing, or if it's a PENCAIRAN, check Savings system
    if (results.length === 0) {
      let includeAccounts = {
        model: db.MemberSavingsAccount,
        as: "savingsAccount",
        include: [
          {
            model: db.Member,
            as: "member",
            attributes: ["full_name", "member_id", "member_no"],
            where: search ? {
              [Op.or]: [
                { full_name: { [Op.like]: `%${search}%` } },
                { member_no: { [Op.like]: `%${search}%` } },
              ]
            } : {}
          },
          {
            model: db.SavingsProduct,
            as: "savingsProduct",
            attributes: ["name", "product_code"],
            where: {
              [Op.or]: [
                { name: { [Op.like]: `%${type}%` } },
                { product_code: { [Op.like]: `%${type}%` } }
              ]
            }
          }
        ]
      };

      if (tx_category === "PENCAIRAN") {
        const wdStatusFilter = mapWithdrawalStatuses(status);
        const wdWhere = {
          member_saving_target_id: {
            [Op.is]: null
          }
        };
        if (wdStatusFilter) {
          wdWhere.status = { [Op.in]: wdStatusFilter };
        }

        const { count: wCount, rows: withdrawals } = await db.SavingsWithdrawal.findAndCountAll({
          where: wdWhere,
          include: [
            includeAccounts,
            { 
              model: db.ApprovalFlow, 
              as: 'flow', 
              include: [{ 
                model: db.ApprovalStep, 
                as: 'steps', 
                include: [{ model: db.UserRole, as: 'verifierRole' }] 
              }] 
            },
            { 
              model: db.ApprovalStep, 
              as: 'currentStep',
              include: [{ model: db.UserRole, as: 'verifierRole' }]
            },
            {
              model: db.Approval,
              as: "approvals",
              required: false,
              include: [
                {
                  model: db.ApprovalStep,
                  as: "step",
                  include: [{ model: db.UserRole, as: "verifierRole", attributes: ["role_name"] }]
                }
              ]
            }
          ],
          order: [["created_at", "DESC"]],
          limit: parseInt(limit),
          offset: offset
        });

        count = wCount;
        results = withdrawals.map(w => ({
          id: w.withdrawal_id,
          date: w.created_at,
          member: w.savingsAccount?.member?.full_name || "Unknown",
          member_id: w.savingsAccount?.member_id,
          member_no: w.savingsAccount?.member?.member_no || "-",
          type: "Pencairan",
          amount: w.amount,
          balance: w.savingsAccount?.current_balance,
          status: w.status,
          product_name: w.savingsAccount?.savingsProduct?.name,
          flow: w.flow,
          currentStep: w.currentStep,
          final_status: w.status,
          approvals: w.approvals?.map(a => typeof a.toJSON === 'function' ? a.toJSON() : a)
        }));
      } else {
        const stWhere = {
          tx_type: { [Op.in]: ["SETORAN", "DEPOSIT"] }
        };
        if (status) {
          const s = status.toLowerCase();
          if (s === "selesai") stWhere.approved_status = "APPROVED";
          else if (s.includes("verifikasi") || s === "pending") stWhere.approved_status = "PENDING";
          else if (s === "ditolak") stWhere.approved_status = "REJECTED";
        }

        const { count: tCount, rows: transactions } = await db.SavingsTransaction.findAndCountAll({
          include: [includeAccounts],
          where: stWhere,
          order: [["created_at", "DESC"]],
          limit: parseInt(limit),
          offset: offset
        });

        count = tCount;
        results = transactions.map(t => ({
          id: t.savings_tx_id,
          date: t.created_at,
          member: t.savingsAccount?.member?.full_name || "Unknown",
          member_id: t.savingsAccount?.member_id,
          member_no: t.savingsAccount?.member?.member_no || "-",
          type: "Setoran",
          amount: t.amount,
          balance: t.savingsAccount?.current_balance,
          status: t.approved_status === "APPROVED" ? "Selesai" : t.approved_status,
          product_name: t.savingsAccount?.savingsProduct?.name
        }));

        // Jika tidak ada data di SavingsTransaction, ambil dari tabel utama db.Savings (data import / setoran langsung)
        if (results.length === 0 && db.Savings) {
          const savingsWhere = {};
          if (type) {
            savingsWhere.savings_type = type.toUpperCase();
          }
          const svStatusFilter = mapSavingsStatuses(status);
          if (svStatusFilter) {
            savingsWhere.status = { [Op.in]: svStatusFilter };
          }

          const { count: sCount, rows: directSavings } = await db.Savings.findAndCountAll({
            where: savingsWhere,
            include: [
              {
                model: db.Member,
                as: "member",
                attributes: ["full_name", "member_id", "member_no"],
                where: search ? {
                  [Op.or]: [
                    { full_name: { [Op.like]: `%${search}%` } },
                    { member_no: { [Op.like]: `%${search}%` } },
                  ]
                } : {},
                required: !!search
              }
            ],
            order: [["transaction_date", "DESC"], ["created_at", "DESC"]],
            limit: parseInt(limit),
            offset: offset
          });

          count = sCount;
          results = directSavings.map(s => ({
            id: s.savings_id,
            date: s.transaction_date || s.created_at,
            member: s.member?.full_name || "Anggota",
            member_id: s.member_id,
            member_no: s.member?.member_no || "-",
            type: "Setoran",
            amount: parseFloat(s.amount) || 0,
            balance: "-",
            status: s.status === "COMPLETED" ? "Selesai" : (s.status === "APPROVED" ? "Disetujui" : s.status),
            raw_status: s.status,
            product_name: s.savings_type
          }));
        }
      }
    }

    return res.status(200).json({
      status: true,
      message: "Data transaksi simpanan berhasil diambil",
      data: {
        transactions: results,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_records: count,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error("Error getAdminSavingsTransactions:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};
