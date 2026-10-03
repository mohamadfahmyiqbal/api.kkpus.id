import db from "../../models/index.js";
import { Sequelize } from "sequelize";

export const getAdminTabungan = async (req, res) => {
  try {
    // 1. Fetch detailed list
    const tabunganData = await db.MemberSavingTarget.findAll({
      include: [
        {
          model: db.Member,
          as: "member",
          attributes: ["member_id", "full_name"]
        },
        {
          model: db.SavingTarget,
          as: "savingTarget",
          attributes: ["saving_target_id", "target_name", "category", "target_amount", "term_months", "min_monthly_deposit"]
        },
        { 
          model: db.ApprovalFlow, 
          as: 'flow', 
          include: [{ model: db.ApprovalStep, as: 'steps', include: [{ model: db.UserRole, as: 'verifierRole' }] }] 
        },
        { 
          model: db.ApprovalStep, 
          as: 'currentStep', 
          include: [{ model: db.UserRole, as: 'verifierRole' }] 
        },
        {
          model: db.Approval,
          as: 'approvals',
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
      order: [["created_at", "DESC"]]
    });

    // 2. Aggregate the detailed list for frontend Table (Group by Batch/Program)
    const programAggr = {};
    tabunganData.forEach(item => {
      const targetId = item.saving_target_id || `legacy_${item.member_saving_target_id}`;
      if (!programAggr[targetId]) {
        programAggr[targetId] = {
          id: targetId,
          kategori: item.savingTarget?.category || item.category || "Lainnya",
          nama: item.savingTarget?.target_name || "Tabungan Personal (Legacy)",
          saldo: 0,
          status: "Aktif",
          members: []
        };
      }
      programAggr[targetId].saldo += parseFloat(item.current_balance) || 0;
      programAggr[targetId].members.push({
        member_saving_target_id: item.member_saving_target_id,
        member_id: item.member_id,
        nama: item.member?.full_name || "Unknown",
        kategori: item.savingTarget?.category || item.category || "Lainnya",
        term: `${item.savingTarget?.term_months || item.term_months || 0} Bulan`,
        setoran: item.savingTarget?.min_monthly_deposit || item.monthly_deposit || 0,
        saldo: parseFloat(item.current_balance) || 0,
        target: item.savingTarget?.target_amount || item.target_amount || 0,
        kekurangan: Math.max(0, (item.savingTarget?.target_amount || item.target_amount || 0) - (parseFloat(item.current_balance) || 0)),
        status: item.status || "PENDING",
        created_at: item.created_at,
        flow: item.flow,
        currentStep: item.currentStep,
        approvals: item.approvals
      });
    });
    
    const formattedList = Object.values(programAggr);

    // 3. Aggregate totals for the Summary Cards
    // (We will group by category and sum current_balance)
    const summaryAggr = {};

    tabunganData.forEach(item => {
      const year = item.start_period_year || new Date(item.created_at).getFullYear();
      const cat = item.savingTarget?.category || item.category || "Lainnya";
      const balance = parseFloat(item.current_balance) || 0;
      
      if (!summaryAggr[year]) {
        summaryAggr[year] = {};
      }
      if (!summaryAggr[year][cat]) {
        summaryAggr[year][cat] = 0;
      }
      summaryAggr[year][cat] += balance;
    });

    return res.status(200).json({
      status: true,
      message: "Data tabungan berhasil diambil",
      data: {
        list: formattedList,
        summary: summaryAggr
      }
    });
  } catch (error) {
    console.error("Error getAdminTabungan:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};
