import db from "../../models/index.js";
import { Op } from "sequelize";

export const getAdminSavingsTransactions = async (req, res) => {
  try {
    const { type, tx_category, page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    let results = [];
    let count = 0;

    // Check if we should fetch from Billing system (including Sukarela if it exists there)
    // Most deposits (Pokok, Wajib, Sukarela Setoran) are likely in Billing Transactions
    if (tx_category !== "PENCAIRAN") {
      const { count: tCount, rows: transactions } = await db.Transaction.findAndCountAll({
        where: {
          status: "PAID",
        },
        include: [
          {
            model: db.Member,
            as: "member",
            attributes: ["full_name", "member_id"],
            where: search ? {
              full_name: { [Op.like]: `%${search}%` }
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
          
          return {
            id: t.transaction_id,
            date: t.created_at,
            member: t.member?.full_name || "Unknown",
            member_id: t.member_id,
            type: "Setoran",
            amount: itemAmount,
            balance: "-", 
            status: "Selesai",
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
            attributes: ["full_name", "member_id"],
            where: search ? {
              full_name: { [Op.like]: `%${search}%` }
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
        const { count: wCount, rows: withdrawals } = await db.SavingsWithdrawal.findAndCountAll({
          where: {
            member_saving_target_id: {
              [Op.is]: null
            }
          },
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
        
        console.log("DEBUG TRANSACTIONS:", JSON.stringify(results.map(r => ({id: r.id, approvals_count: r.approvals?.length, notes: r.approvals?.map(a => a.note)})), null, 2));
      } else {
        const { count: tCount, rows: transactions } = await db.SavingsTransaction.findAndCountAll({
          include: [includeAccounts],
          where: {
            tx_type: { [Op.in]: ["SETORAN", "DEPOSIT"] }
          },
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
          type: "Setoran",
          amount: t.amount,
          balance: t.savingsAccount?.current_balance,
          status: t.approved_status === "APPROVED" ? "Selesai" : t.approved_status,
          product_name: t.savingsAccount?.savingsProduct?.name
        }));
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
