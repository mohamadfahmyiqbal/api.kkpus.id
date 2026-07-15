import db from "../../models/index.js";
import { Op } from "sequelize";

export const getAdminTabunganTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    // We only fetch tabungan withdrawals (entity_ref = 'tabungan_withdrawals')
    // and they are stored in SavingsWithdrawal with member_saving_target_id NOT NULL
    
    // We only want withdrawals
    const { count, rows: withdrawals } = await db.SavingsWithdrawal.findAndCountAll({
      where: {
        member_saving_target_id: { [Op.not]: null }
      },
      include: [
        {
          model: db.MemberSavingTarget,
          as: "savingTarget", // Must match the association name in SavingsWithdrawal model
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
              as: "savingsProduct"
            }
          ]
        },
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

    const results = withdrawals.map(w => {
      const target = w.savingTarget || {};
      const member = target.member || {};
      const product = target.savingsProduct || {};
      
      return {
        id: w.withdrawal_id,
        date: w.created_at,
        member: member.full_name || "Unknown",
        member_id: member.member_id,
        type: "Pencairan Tabungan",
        amount: w.amount,
        balance: target.current_balance,
        status: w.status,
        product_name: target.target_name || product.name || "Program Tabungan",
        flow: w.flow,
        currentStep: w.currentStep,
        final_status: w.status,
        approvals: w.approvals?.map(a => typeof a.toJSON === 'function' ? a.toJSON() : a)
      };
    });

    return res.status(200).json({
      status: true,
      message: "Data transaksi tabungan berhasil diambil",
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
    console.error("Error getAdminTabunganTransactions:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};
