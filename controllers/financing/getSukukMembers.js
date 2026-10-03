import db from "../../models/index.js";

const getSukukMembers = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID Sukuk diperlukan",
      });
    }

    const membersData = await db.SukukOrder.findAll({
      where: { sukuk_issue_id: id },
      include: [
        {
          model: db.Member,
          as: "member",
          attributes: ["full_name", "member_no"],
        },
        {
          model: db.SukukIssue,
          as: "sukukIssue",
          attributes: ["price", "coupon", "tenor"],
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    const data = membersData.map((order) => {
      const amount = parseFloat(order.amount);
      const price = parseFloat(order.sukukIssue?.price) || 100000;
      const lembar = Math.floor(amount / price);
      
      const couponStr = order.sukukIssue?.coupon || "0";
      const couponMatch = couponStr.match(/(\d+(\.\d+)?)/);
      const couponRate = couponMatch ? parseFloat(couponMatch[1]) / 100 : 0;
      
      const imbal_hasil = amount * couponRate;
      const pengembalian = amount + imbal_hasil;

      return {
        id: order.order_id,
        member_name: order.member?.full_name || "Unknown",
        member_no: order.member?.member_no || "-",
        amount: amount,
        lembar: lembar,
        imbal_hasil: imbal_hasil,
        pengembalian: pengembalian,
        status: order.status,
        transfer_proof: order.transfer_proof,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil data anggota",
      data,
    });
  } catch (error) {
    console.error("Error in getSukukMembers:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

export default getSukukMembers;
