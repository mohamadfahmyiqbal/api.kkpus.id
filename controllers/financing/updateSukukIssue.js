import db from "../../models/index.js";

const updateSukukIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      issue_name, total_amount, start_date, end_date, 
      status, issuer, type, coupon, min_investment, price 
    } = req.body;

    const sukuk = await db.SukukIssue.findOne({ where: { issue_id: id } });
    if (!sukuk) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    await sukuk.update({
      issue_name,
      total_amount,
      start_date,
      end_date,
      status,
      issuer,
      type,
      coupon,
      min_investment,
      price,
    });

    return res.status(200).json({
      success: true,
      message: "Produk investasi berhasil diperbarui",
      data: sukuk,
    });
  } catch (error) {
    console.error("Error in updateSukukIssue:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

export default updateSukukIssue;
