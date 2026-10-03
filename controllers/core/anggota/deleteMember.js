import db from "../../../models/index.js";

export const deleteMember = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { member_id } = req.params;

    if (!member_id) {
      return res.status(400).json({
        success: false,
        message: "Member ID tidak valid",
      });
    }

    const member = await db.Member.findByPk(member_id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member tidak ditemukan",
      });
    }

    // Try to delete member. If foreign keys exist and don't cascade, they will throw an error.
    // So we first attempt to delete related data manually if needed.
    const modelsWithMemberId = [
      db.MemberRoleAssignment,
      db.Account,
      db.MemberFinancialSummary,
      db.MemberRegistration,
      db.MemberBankAccount,
      db.MemberEmployment,
      db.MemberEmergencyContact,
      db.Bill,
      db.Transaction,
      db.GeneralTransaction,
      db.SukukOrder,
      db.MemberLoan,
      db.FinancingApplication,
      db.JualBeliReport,
      db.SavingsReport,
      db.SavingsReportList,
      db.MemberSavingsAccount,
      db.SavingsWithdrawal,
      db.MemberSavingTarget,
      db.PushSubscription,
      db.ForgotPasswordSession,
      db.ArisanParticipant,
      db.ArisanPayment,
      db.Evaluation,
      db.MaterialNote,
      db.Ranking,
    ];

    for (const model of modelsWithMemberId) {
      if (model) {
        await model.destroy({ where: { member_id }, transaction: t }).catch(() => {});
      }
    }

    // Additional models where member_id might be named differently or need specific handling
    if (db.Approval) {
      await db.Approval.destroy({ where: { approver_member_id: member_id }, transaction: t }).catch(() => {});
    }

    if (db.ArisanDraw) {
      await db.ArisanDraw.destroy({ where: { winner_member_id: member_id }, transaction: t }).catch(() => {});
    }

    await db.Member.destroy({
      where: { member_id },
      transaction: t,
    });

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Berhasil menghapus anggota dan data terkait",
    });
  } catch (error) {
    await t.rollback();
    console.error("Delete Member Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus anggota: " + error.message,
    });
  }
};
