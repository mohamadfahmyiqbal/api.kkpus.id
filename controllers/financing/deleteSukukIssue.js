import db from "../../models/index.js";

const deleteSukukIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const sukuk = await db.SukukIssue.findOne({ where: { issue_id: id } });
    if (!sukuk) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    // Check if there are orders
    const orders = await db.SukukOrder.count({ where: { sukuk_issue_id: id } });
    if (orders > 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak dapat menghapus karena sudah ada transaksi pada produk ini",
      });
    }

    await sukuk.destroy();

    return res.status(200).json({
      success: true,
      message: "Produk investasi berhasil dihapus",
    });
  } catch (error) {
    console.error("Error in deleteSukukIssue:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

export default deleteSukukIssue;
