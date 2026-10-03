import db from "../../models/index.js";

const getInvestasiReport = async (req, res) => {
  try {
    const orders = await db.SukukOrder.findAll({
      include: [
        {
          model: db.Member,
          as: "member",
          attributes: ["full_name", "member_no", "member_id"],
        },
        {
          model: db.SukukIssue,
          as: "sukukIssue",
          attributes: ["issue_name", "price", "coupon", "tenor", "issue_id"],
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    let totalSetoran = 0;
    let totalImbalHasil = 0;
    let totalPengembalian = 0;

    const listData = orders.map((order, index) => {
      const amount = parseFloat(order.amount);
      const price = parseFloat(order.sukukIssue?.price) || 100000;
      const lembar = Math.floor(amount / price);
      
      const couponStr = order.sukukIssue?.coupon || "0";
      const couponMatch = couponStr.match(/(\d+(\.\d+)?)/);
      const couponRate = couponMatch ? parseFloat(couponMatch[1]) / 100 : 0;
      
      const imbal_hasil = amount * couponRate;
      const pengembalian = amount + imbal_hasil;

      if (order.status === 'APPROVED' || order.status === 'PAID') {
        totalSetoran += amount;
        totalImbalHasil += imbal_hasil;
        totalPengembalian += pengembalian;
      }

      return {
        id: order.order_id,
        no: index + 1,
        member_name: order.member?.full_name || "Unknown",
        member_no: order.member?.member_no || "-",
        issue_name: order.sukukIssue?.issue_name || "Unknown",
        amount: amount,
        lembar: lembar,
        imbal_hasil: imbal_hasil,
        pengembalian: pengembalian,
        status: order.status,
        date: order.createdAt
      };
    });

    const jurnal = {
      totalSetoran,
      totalImbalHasil,
      totalPengembalian
    };

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil report investasi",
      data: {
        listData,
        jurnal
      }
    });
  } catch (error) {
    console.error("Error in getInvestasiReport:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

export default getInvestasiReport;
