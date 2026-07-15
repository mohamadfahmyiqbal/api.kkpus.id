import db from "../../models/index.js";

export const getAdminTabunganBills = async (req, res) => {
  try {
    const { id } = req.params; // member_saving_target_id

    if (!id) {
      return res.status(400).json({ status: false, message: "ID Tabungan diperlukan." });
    }

    const { BillItem, Transaction } = db;

    let bills = await BillItem.findAll({
      where: {
        category_code: `TAB_DEP_${id}`
      },
      order: [["due_date", "ASC"]]
    });

    return res.status(200).json({
      status: true,
      message: "Daftar tagihan tabungan berhasil diambil (Admin).",
      data: bills
    });

  } catch (error) {
    console.error("Error pada getAdminTabunganBills:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan pada server.",
      error: error.message
    });
  }
};
