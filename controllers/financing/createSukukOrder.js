import db from "../../models/index.js";

const createSukukOrder = async (req, res) => {
  try {
    const memberId = req.user?.member_id || req.user?.id;
    const { sukuk_id, nominal } = req.body;

    if (!memberId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Member ID not found.",
      });
    }

    if (!sukuk_id || !nominal) {
      return res.status(400).json({
        success: false,
        message: "ID Sukuk dan nominal investasi wajib diisi",
      });
    }

    const sukuk = await db.SukukIssue.findOne({
      where: { issue_id: sukuk_id },
    });

    if (!sukuk) {
      return res.status(404).json({
        success: false,
        message: "Sukuk tidak ditemukan",
      });
    }

    if (parseFloat(nominal) < parseFloat(sukuk.min_investment)) {
      return res.status(400).json({
        success: false,
        message: `Minimal investasi adalah Rp ${sukuk.min_investment}`,
      });
    }

    // Create the order
    const order = await db.SukukOrder.create({
      member_id: memberId,
      sukuk_issue_id: sukuk_id,
      amount: nominal,
      status: 'PENDING',
    });

    return res.status(201).json({
      success: true,
      message: "Berhasil membuat pesanan sukuk",
      data: order,
    });
  } catch (error) {
    console.error("Error in createSukukOrder:", error);
    import('fs').then(fs => fs.writeFileSync('order_error.log', error.stack));
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

export default createSukukOrder;
