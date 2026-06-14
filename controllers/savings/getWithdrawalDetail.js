// controllers/savings/getWithdrawalDetail.js
import db from "../../models/index.js";

export const getWithdrawalDetail = async (req, res) => {
  try {
    const { withdrawalId } = req.params;

    const data = await db.SavingsWithdrawal.findByPk(withdrawalId, {
      include: [
        {
          model: db.Member,
          as: "member",
          attributes: ["full_name", "member_no"],
          include: [
            { model: db.MemberStatus, as: "status", attributes: ["status_name"] }
          ]
        },
        {
          model: db.MemberSavingsAccount,
          as: "savingsAccount",
          include: [
            { model: db.SavingsProduct, as: "savingsProduct", attributes: ["name", "product_code"] }
          ]
        },
        {
          model: db.ApprovalStep,
          as: "currentStep",
          include: [
            { 
              model: db.UserRole, 
              as: "verifierRole", 
              attributes: ["role_name"] 
            }
          ]
        },
        {
          model: db.Approval,
          as: "approvals",
          where: { entity_ref: 'savings_withdrawal' },
          required: false,
          include: [
            {
              model: db.ApprovalStep,
              as: "step",
              include: [{ model: db.UserRole, as: "verifierRole", attributes: ["role_name"] }]
            }
          ]
        }
      ]
    });

    if (!data) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    const existingApprovals = data.approvals || [];

    const approvalSteps = await db.ApprovalStep.findAll({
      where: { approval_flow_id: data.approval_flow_id },
      include: [
        { 
          model: db.UserRole, 
          as: "verifierRole", 
          attributes: ["role_name", "role_id"] 
        }
      ],
      order: [['step_order', 'ASC']]
    });

    const formattedApprovals = approvalSteps.map(step => {
      const approval = existingApprovals.find(a => a.approval_step_id === step.approval_step_id);
      return {
        step_id: step.approval_step_id,
        step_order: step.step_order,
        step_name: step.step_name,
        role_id: step.role_id,
        role_name: step.verifierRole?.role_name,
        decision: approval?.decision || 'PENDING',
        approver_member_id: approval?.approver_member_id || null,
        decision_datetime: approval?.decision_datetime || null,
        note: approval?.note || null
      };
    });

    const statusStr = data.status;
    const stepId = data.current_step_id;
    
    const currentStep = data.currentStep;

    const formattedData = {
      withdrawalId: data.withdrawal_id,
      invoiceNumber: data.invoice_no || `WDR-${data.withdrawal_id}`,
      displayName: data.savingsAccount?.savingsProduct?.name || "Simpanan",
      amount: parseFloat(data.amount || 0),
      adminFee: parseFloat(data.admin_fee || 0),
      method: data.method,
      status: statusStr,
      current_step_id: stepId,
      current_step_name: currentStep?.step_name || '',
      createdAt: data.created_at || data.createdAt,
      transfer_proof_path: data.transfer_proof_path || null,

      is_approved_pengawas: formattedApprovals.some(a => 
        a.role_name?.toUpperCase() === 'PENGAWAS' && a.decision === 'APPROVED'
      ),
      is_approved_ketua: formattedApprovals.some(a => 
        a.role_name?.toUpperCase() === 'KETUA' && a.decision === 'APPROVED'
      ),
      is_approved_bendahara: formattedApprovals.some(a => 
        a.role_name?.toUpperCase() === 'BENDAHARA' && a.decision === 'APPROVED'
      ),
      is_rejected: formattedApprovals.some(a => a.decision === 'REJECTED') || statusStr === "REJECTED",

      member: {
        name: data.member?.full_name, 
        memberId: data.member?.member_no,
        status: data.member?.status?.status_name
      },

      bank: {
        bankName: data.bank_name,
        accountName: data.account_name || data.member?.full_name,
        accountNo: data.bank_account_no 
      },

      cash: {
        name: data.member?.full_name,
        transactionTime: data.request_datetime,
        location: "Kantor Pusat"
      },

      approvals: formattedApprovals
    };

    return res.status(200).json({ 
      success: true, 
      data: formattedData 
    });

  } catch (error) {
    console.error("Error Get Withdrawal Detail:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};