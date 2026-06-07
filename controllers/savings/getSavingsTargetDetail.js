import db from "../../models/index.js";

export const getSavingsTargetDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the member saving target
    const target = await db.MemberSavingTarget.findOne({
      where: { member_saving_target_id: id }
    });

    if (!target) {
      return res.status(404).json({
        status: false,
        message: "Pengajuan tabungan tidak ditemukan."
      });
    }

    // Fetch the catalog mapping
    const catalog = await db.SavingTarget.findOne({
      where: { saving_target_id: target.saving_target_id }
    });

    // Fetch member
    const member = await db.Member.findOne({
      where: { member_id: target.member_id },
      attributes: ['full_name', 'member_no', 'member_type']
    });

    // Fetch approvals
    const approvals = await db.EntityStepApproval.findAll({
      where: { 
        entity_ref: 'member_saving_targets',
        entity_id: id.toString()
      },
      include: [
        {
          model: db.ApprovalStep,
          as: 'step',
          include: [{
            model: db.UserRole,
            as: 'verifierRole'
          }]
        }
      ]
    });

    // Also fetch detailed approval logs for decisions and notes
    const approvalLogs = await db.Approval.findAll({
      where: {
        entity_ref: 'member_saving_targets',
        entity_id: id.toString()
      },
      order: [['created_at', 'ASC']]
    });

    // Calculate specific flags based on standard roles
    const checkIsApproved = (val) => {
      if (Buffer.isBuffer(val)) return val[0] === 1;
      return val === 1 || val === true || val === '1';
    };

    const isApprovedPengawas = approvals.some(a => a.step?.verifierRole?.role_name?.toUpperCase() === 'PENGAWAS' && checkIsApproved(a.is_approved));
    const isApprovedKetua = approvals.some(a => a.step?.verifierRole?.role_name?.toUpperCase() === 'KETUA' && checkIsApproved(a.is_approved));
    const isApprovedBendahara = approvals.some(a => a.step?.verifierRole?.role_name?.toUpperCase() === 'BENDAHARA' && checkIsApproved(a.is_approved));
    const isRejected = approvals.some(a => !checkIsApproved(a.is_approved) && approvalLogs.some(l => l.decision === 'REJECTED' && l.approval_step_id === a.approval_step_id));

    console.log("[DEBUG] getSavingsTargetDetail approvals:", JSON.stringify(approvals, null, 2));
    console.log("[DEBUG] Flags:", { isApprovedPengawas, isApprovedKetua, isApprovedBendahara });

    return res.status(200).json({
      status: true,
      message: "Berhasil mengambil detail pengajuan",
      data: {
        member_saving_target_id: target.member_saving_target_id,
        status: target.status,
        current_balance: target.current_balance,
        start_period_month: target.start_period_month,
        start_period_year: target.start_period_year,
        created_at: target.created_at || target.createdAt,
        catalog: catalog ? {
          target_name: catalog.target_name,
          category: catalog.category,
          target_amount: catalog.target_amount,
          term_months: catalog.term_months,
          min_monthly_deposit: catalog.min_monthly_deposit
        } : null,
        member: member,
        approval_status: {
          is_approved_pengawas: isApprovedPengawas,
          is_approved_ketua: isApprovedKetua,
          is_approved_bendahara: isApprovedBendahara,
          is_rejected: isRejected,
          approvals: approvals,
          logs: approvalLogs
        }
      }
    });

  } catch (error) {
    console.error("Error in getSavingsTargetDetail:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan sistem saat mengambil detail pengajuan."
    });
  }
};
