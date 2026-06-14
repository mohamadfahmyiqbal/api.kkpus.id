import db from "../../models/index.js";
import { sendGlobalNotification } from "../../services/notificationHelper.js";

const createFinancingApplication = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const memberId = req.userId;

    const { category } = req.body;

    // Get valid loan product names to distinguish from general financing
    const loanProducts = await db.LoanProduct.findAll({ attributes: ['product_name'] });
    const loanProductNames = loanProducts.map(p => p.product_name);
    
    const isPinjaman = loanProductNames.includes(category);

    const whereClause = {
      member_id: memberId,
      status: {
        [db.Sequelize.Op.notIn]: ['COMPLETED', 'CANCELLED', 'REJECTED']
      }
    };

    // If applying for Pinjaman, check for active Pinjaman. Else, check for active Pembiayaan.
    if (isPinjaman) {
      whereClause.category = {
        [db.Sequelize.Op.in]: loanProductNames
      };
    } else {
      whereClause.category = {
        [db.Sequelize.Op.notIn]: loanProductNames
      };
    }

    // Cek apakah member sudah memiliki transaksi yang sama yang belum selesai
    const existingApplication = await db.FinancingApplication.findOne({
      where: whereClause,
      order: [['created_at', 'DESC']]
    });

    if (existingApplication) {
      const typeName = isPinjaman ? "Pinjaman" : "Pembiayaan";
      return res.status(400).json({
        status: false,
        message: `Anda memiliki ${typeName} yang sedang berjalan (Status: ${existingApplication.status}). Tidak dapat mengajukan ${typeName} baru sampai transaksi sebelumnya selesai.`,
        data: {
          existing_financing_id: existingApplication.financing_id,
          existing_status: existingApplication.status
        }
      });
    }

    const { 
      item_name, 
      amount_requested, 
      down_payment, 
      principal_amount, 
      tenure, 
      monthly_installment,
      margin_percent,
      margin_amount,
      total_tagihan
    } = req.body;

    const flow = await db.ApprovalFlow.findOne({ 
      where: { entity_ref: 'financing_applications' },
      transaction: t 
    });

    if (!flow) throw new Error("Approval Flow belum dikonfigurasi.");

    const firstStep = await db.ApprovalStep.findOne({
      where: { approval_flow_id: flow.approval_flow_id },
      order: [['step_order', 'ASC']],
      transaction: t
    });

    if (!firstStep) throw new Error("Approval Step belum dikonfigurasi.");

    // Prepare application data
    const applicationData = {
      member_id: memberId,
      category: category,
      purpose: item_name,
      item_price: amount_requested,
      down_payment: down_payment,
      amount_requested: principal_amount,
      cooperation_months: parseInt(tenure),
      monthly_installment: monthly_installment,
      margin_percent: margin_percent || 0,
      margin_amount: margin_amount || 0,
      total_tagihan: total_tagihan || 0,
      status: 'PENDING',
      approval_flow_id: flow.approval_flow_id,
      current_step_id: firstStep.approval_step_id,
      akad_type: 'Murabahah'
    };

    const newApplication = await db.FinancingApplication.create(applicationData, { transaction: t });

    await t.commit();

    // Kirim notifikasi dengan detail metode pencairan
    setImmediate(async () => {
      try {
        await sendGlobalNotification({
          memberId: memberId,
          title: "Pengajuan Pembiayaan",
          content: `Pengajuan ${category} (${item_name}) senilai Rp ${Number(principal_amount).toLocaleString('id-ID')} telah berhasil dikirim.`,
          type: "FINANCING",
          url: "/transaksi"
        });
      } catch (err) {
        console.error("Notification Error:", err.message);
      }
    });

    return res.status(201).json({
      status: true,
      message: "Pengajuan pembiayaan berhasil diproses.",
      data: { 
        financing_id: newApplication.financing_id
      }
    });

  } catch (error) {
    if (t && !t.finished) await t.rollback();
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};

export default createFinancingApplication;