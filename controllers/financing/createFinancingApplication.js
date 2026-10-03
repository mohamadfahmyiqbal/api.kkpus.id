import db from "../../models/index.js";
import { sendGlobalNotification } from "../../services/notificationHelper.js";

const createFinancingApplication = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const memberId = req.userId;

    const { category } = req.body;
    
    console.log("CREATE FINANCING APPLICATION PAYLOAD:", req.body);

    // Get valid loan product names to distinguish from general financing
    const loanProducts = await db.LoanProduct.findAll({ attributes: ['product_name'] });
    const loanProductNames = loanProducts.map(p => p.product_name);
    
    const isPinjaman = loanProductNames.includes(category);
    const isPelunasan = typeof category === 'string' && category.toLowerCase().includes('pelunasan');

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
    // Skip if it is Pelunasan, so members can apply for Pelunasan even when they have active financing
    let existingApplication = null;
    if (!isPelunasan) {
      existingApplication = await db.FinancingApplication.findOne({
        where: whereClause,
        order: [['created_at', 'DESC']]
      });

      // Cek apakah sebenarnya sudah lunas secara tagihan
      if (existingApplication && existingApplication.status === 'APPROVED') {
        const unpaidCount = await db.BillItem.count({
          where: {
            financing_application_id: existingApplication.financing_id,
            status: { [db.Sequelize.Op.in]: ['UNPAID', 'OVERDUE'] }
          }
        });
        const paidCount = await db.BillItem.count({
          where: {
            financing_application_id: existingApplication.financing_id,
            status: 'PAID'
          }
        });

        if (paidCount > 0 && unpaidCount === 0) {
          // Update status ke COMPLETED karena semua tagihan sudah lunas
          await db.FinancingApplication.update(
            { status: 'COMPLETED' },
            { where: { financing_id: existingApplication.financing_id }, transaction: t }
          );
          existingApplication = null; // Anggap tidak ada yang aktif
        }
      }
    }

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
      total_tagihan,
      operational_cost,
      // Pendanaan Syariah Extra Fields
      business_name,
      business_sector,
      business_address,
      estimated_yearly_turnover,
      estimated_monthly_turnover,
      investor_profit_share
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
      operational_cost: operational_cost || 0,
      status: 'PENDING',
      approval_flow_id: flow.approval_flow_id,
      current_step_id: firstStep.approval_step_id,
      akad_type: 'Murabahah',
      keterangan: req.body.keterangan || null,
      business_name: business_name || null,
      business_sector: business_sector || null,
      business_address: business_address || null,
      estimated_yearly_turnover: estimated_yearly_turnover || 0,
      estimated_monthly_turnover: estimated_monthly_turnover || 0,
      investor_profit_share: investor_profit_share || 0
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