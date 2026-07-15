import db from "../../models/index.js";

export const getSavingsTargetCheck = async (req, res) => {
  try {
    const memberId = req.userId;
    const { saving_target_id } = req.query; 

    if (!saving_target_id) {
      return res.status(400).json({ status: false, message: "Parameter saving_target_id diperlukan" });
    }

    // Cari mapping target berdasarkan member & saving_target_id
    const target = await db.MemberSavingTarget.findOne({
      where: { 
        member_id: memberId,
        saving_target_id: saving_target_id
      },
      include: [
        {
          model: db.SavingTarget,
          as: "savingTarget",
        }
      ],
      order: [['created_at', 'DESC']]
    });

    if (!target) {
      return res.status(200).json({ 
        status: true, 
        data: {
          hasAccount: false,
          state: 'EMPTY'
        }
      });
    }

    // Jika ada target, cek statusnya
    return res.status(200).json({
      status: true,
      data: {
        hasAccount: true,
        state: target.status, // 'PENDING', 'APPROVED', 'REJECTED'
        member_saving_target_id: target.member_saving_target_id,
        current_balance: target.current_balance,
        target_amount: target.target_amount,
        target_name: target.savingTarget?.target_name,
        min_monthly_deposit: target.monthly_deposit
      }
    });

  } catch (error) {
    console.error("Error getSavingsTargetCheck:", error);
    return res.status(500).json({ status: false, error: error.message });
  }
};
