import db from "../../models/index.js";

const getSukukPortfolio = async (req, res) => {
  try {
    const memberId = req.user?.member_id || req.user?.id; // Assuming auth middleware sets req.user

    if (!memberId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Member ID not found.",
      });
    }

    const portfolio = await db.SukukOrder.findAll({
      where: {
        member_id: memberId,
      },
      include: [
        {
          model: db.SukukIssue,
          as: "issue",
        },
      ],
      order: [["order_date", "DESC"]],
    });

    // Transform data to match frontend expectations
    const formattedPortfolio = portfolio.map((order) => {
      // Calculate profit if needed, for now just dummy profit if it's paid
      const profit = order.status === 'PAID' ? 2.5 : 0; 
      
      return {
        id: order.order_id,
        issueId: order.sukuk_issue_id,
        name: order.issue?.issue_name || "Unknown Sukuk",
        purchaseDate: order.order_date,
        units: 1, // Assuming 1 unit for now, or calculate based on amount/price
        purchasePrice: order.issue?.price || 100,
        currentValue: (parseFloat(order.issue?.price || 100) + profit).toFixed(2),
        profit: profit,
        status: order.status.toLowerCase(),
      };
    });

    return res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan portofolio sukuk",
      data: formattedPortfolio,
    });
  } catch (error) {
    console.error("Error in getSukukPortfolio:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

export default getSukukPortfolio;
