import db from "../../models/index.js";

const getSukukOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await db.SukukOrder.findOne({
      where: { order_id: id },
      include: [
        {
          model: db.Member,
          as: "member",
          attributes: ["full_name", "member_no", "member_type"],
        },
        {
          model: db.SukukIssue,
          as: "sukukIssue",
          attributes: ["issue_name", "issuer", "type", "coupon"],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ status: false, message: "Order tidak ditemukan" });
    }

    return res.json({
      status: true,
      data: {
        financing_id: order.order_id,
        category: "SUKUK",
        purpose: `Investasi Sukuk – ${order.sukukIssue?.issue_name || ""}`,
        amount_requested: order.amount,
        status: order.status,

        // Approval flags (flat — sesuai format TransactionDetailPage)
        is_approved_pengawas: order.is_approved_pengawas,
        is_approved_ketua: order.is_approved_ketua,
        is_approved_bendahara: order.is_approved_bendahara,
        is_rejected: order.status === "REJECTED",
        rejected_reason: order.rejected_reason,

        // Relasi
        member: order.member,
        sukuk: order.sukukIssue,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error("getSukukOrderDetail error:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export default getSukukOrderDetail;
