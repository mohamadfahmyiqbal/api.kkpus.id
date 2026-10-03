// 📁 controllers/account/getAccountDetail.js
import db from "../../models/index.js";

export const getAccountDetail = async (req, res) => {
  try {
    const memberId = req.userId;
    const { category } = req.query;

    // 1. Ambil data Akun Utama Simpanan berdasarkan Member dan Kategori Produk
    const account = await db.MemberSavingsAccount.findOne({
      where: { member_id: memberId },
      include: [
        {
          model: db.Member,
          as: "member",
          attributes: ["full_name"],
        },
        {
          model: db.SavingsProduct,
          as: "savingsProduct",
          where: category ? { product_code: category } : {},
          attributes: ["name", "akad_type", "product_code", "savings_product_id"],
        },
      ],
      attributes: ["current_balance", "account_no", "savings_product_id"],
    });

    // --- PERBAIKAN: Jika account tidak ditemukan, jangan biarkan frontend error ---
    if (!account) {
      // Ambil data member dasar agar nama tetap muncul di UI
      const member = await db.Member.findByPk(memberId, { attributes: ["full_name"] });
      const product = category ? await db.SavingsProduct.findOne({ where: { product_code: category } }) : null;

      return res.status(200).json({ 
        status: true, 
        data: {
          member_name: member?.full_name || "Anggota",
          balance: 0,
          account_no: "-",
          product_name: product?.name || "Simpanan",
          akad: product?.akad_type || "Wadi'ah",
          billItemIds: []
        } 
      });
    }

    // 2. Jika kategori adalah POKOK, cari daftar Bill Item ID (Logika tetap sama)
    let billItemIds = [];
    if (category === "SW_POKOK") {
      const transaction = await db.Transaction.findOne({
        where: {
          member_id: memberId,
          tx_category: "MEMBER_REGISTRATION",
        },
        attributes: ["bill_id"],
        order: [["created_at", "DESC"]],
      });

      if (transaction && transaction.bill_id) {
        const items = await db.BillItem.findAll({
          where: { bill_id: transaction.bill_id },
          attributes: ["bill_item_id"],
        });
        billItemIds = items.map(item => item.bill_item_id);
      }
    }

    // 3. Gabungkan Data
    const formattedData = {
      member_name: account.member?.full_name,
      balance: parseFloat(account.current_balance || 0),
      account_no: account.account_no,
      product_name: account.savingsProduct?.name,
      akad: account.savingsProduct?.akad_type || "Wadi'ah",
      billItemIds: billItemIds 
    };

    return res.status(200).json({ status: true, data: formattedData });
  } catch (error) {
    console.error("Error getAccountDetail:", error);
    return res.status(500).json({ status: false, error: error.message });
  }
};