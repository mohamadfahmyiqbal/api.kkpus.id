// 📁 controllers/financing/getFinancingDetail.js
import db from "../../models/index.js";

const getFinancingDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const detail = await db.FinancingApplication.findOne({
      where: { financing_id: id },
      include: [
        {
          model: db.Member,
          as: 'member',
          attributes: ['full_name', 'member_no', 'member_type'] 
        },
        {
          model: db.ApprovalStep,
          as: 'currentStep',
          attributes: ['step_name']
        },
        {
          model: db.Approval,
          as: "approvals",
          where: { entity_ref: 'financing_applications' },
          required: false,
          include: [
            {
              model: db.ApprovalStep,
              as: "step",
              include: [{ model: db.UserRole, as: "verifierRole", attributes: ["role_name"] }]
            },
            {
              model: db.Member,
              as: "approver",
              attributes: ["full_name"]
            }
          ]
        }
      ]
    });

    if (!detail) {
      return res.status(404).json({ status: false, message: "Data tidak ditemukan" });
    }

    const existingApprovals = detail.approvals || [];

    // DEBUG: Log approval data
    console.log('[getFinancingDetail] Approvals found:', existingApprovals.length);
    existingApprovals.forEach((a, i) => {
      console.log(`[getFinancingDetail] Approval ${i}:`, {
        decision: a.decision,
        stepId: a.approval_step_id,
        roleName: a.step?.verifierRole?.role_name,
        stepName: a.step?.step_name
      });
    });

    return res.json({
      status: true,
      data: {
        financing_id: detail.financing_id,
        // Field Utama
        purpose: detail.purpose,
        category: detail.category,
        arisan_batch_id: detail.arisan_batch_id,
        item_price: detail.item_price,         // Pastikan ini dikirim
        down_payment: detail.down_payment,     // Pastikan ini dikirim
        amount_requested: detail.amount_requested, // Mengirim required_amount sebagai amount_requested
        
        // Field Cicilan & Status
        cooperation_months: detail.cooperation_months,
        monthly_installment: detail.monthly_installment,
        status: detail.status,
        akad_type: detail.akad_type,
        
        // Metode Pencairan
        metode_pencairan: detail.metode_pencairan,
        nama_nasabah: detail.nama_nasabah,
        nama_peserta_2: detail.nama_peserta_2,
        keterangan: detail.keterangan,
        // Field untuk Non Tunai
        no_rekening: detail.no_rekening,
        bank_tujuan: detail.bank_tujuan,
        // Field untuk Tunai
        lokasi_pencairan: detail.lokasi_pencairan,
        tanggal_pencairan: detail.tanggal_pencairan,
        jam_pencairan: detail.jam_pencairan,
        file_evidence: detail.file_evidence,
        
        // Status Approval
        is_approved_pengawas: existingApprovals.some(a => 
          a.step?.verifierRole?.role_name?.toUpperCase() === 'PENGAWAS' && a.decision === 'APPROVED'
        ),
        is_approved_ketua: existingApprovals.some(a => 
          a.step?.verifierRole?.role_name?.toUpperCase() === 'KETUA' && a.decision === 'APPROVED'
        ),
        is_approved_bendahara: existingApprovals.some(a => 
          a.step?.verifierRole?.role_name?.toUpperCase() === 'BENDAHARA' && a.decision === 'APPROVED'
        ),
        is_rejected: existingApprovals.some(a => a.decision === 'REJECTED'),
        
        // Dynamic approval chain dari data approvals
        approvalChain: existingApprovals.map(a => ({
          role: a.step?.verifierRole?.role_name,
          stepName: a.step?.step_name,
          decision: a.decision,
          approvedAt: a.created_at,
          approverName: a.approver?.full_name
        })),
        
        // Timestamps & Relasi
        createdAt: detail.createdAt,
        updatedAt: detail.updatedAt,
        member: detail.member,
        currentStep: detail.currentStep
      }
    });
  } catch (error) {
    console.error("Detail Error:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export default getFinancingDetail;