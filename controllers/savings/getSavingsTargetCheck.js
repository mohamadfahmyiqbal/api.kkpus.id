import db from "../../models/index.js";

export const getSavingsTargetCheck = async (req, res) => {
  try {
    const memberId = req.userId;
    const { category } = req.query; // 'haji', 'umrah', etc.

    if (!category) {
      return res.status(400).json({ status: false, message: "Parameter category diperlukan" });
    }

    // Cari mapping target berdasarkan member & category
    const target = await db.MemberSavingTarget.findOne({
      where: { member_id: memberId },
      include: [
        {
          model: db.SavingTarget,
          as: "savingTarget",
          where: { category: category }, // Filter by category
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
        target_amount: target.savingTarget?.target_amount,
        target_name: target.savingTarget?.target_name,
        min_monthly_deposit: target.savingTarget?.min_monthly_deposit
      }
    });

  } catch (error) {
    console.error("Error getSavingsTargetCheck:", error);
    return res.status(500).json({ status: false, error: error.message });
  }
};
