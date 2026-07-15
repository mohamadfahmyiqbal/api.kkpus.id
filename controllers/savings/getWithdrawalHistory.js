import db from "../../models/index.js";

export const getWithdrawalHistory = async (req, res) => {
  try {
    const { category } = req.query;
    const member_id = req.userId; // Dari middleware MidAnggota

    if (!member_id) {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    const history = await db.SavingsWithdrawal.findAll({
      where: { member_id },
      include: [{
        model: db.MemberSavingsAccount,
        as: "savingsAccount",
        include: [{
          model: db.SavingsProduct,
          as: "savingsProduct",
          where: category ? { product_code: category } : {},
          required: true
        }]
      },
      {
        model: db.Approval,
        as: 'approvals',
        attributes: ['note', 'decision', 'created_at']
      }],
      attributes: ["withdrawal_id", "amount", "status", "method", "created_at"],
      order: [["created_at", "DESC"]]
    });

    // Kirim sinyal via Socket.io jika tersedia
    if (req.io) {
      req.io.to(String(member_id)).emit("WITHDRAWAL_UPDATED", {
        message: "Riwayat penarikan diperbarui",
        data: history,
        category: category
      });
    }

    return res.status(200).json({ status: true, data: history });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};