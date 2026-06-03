// 📁 src/controllers/billing/createVoluntaryBill.js
import db from "../../models/index.js";
import moment from "moment";

export const createVoluntaryBill = async (req, res) => {
  try {
    const { category, amount } = req.body;
    const memberId = req.userId; 

    // 1. Validasi Input
    if (!amount || amount < 1000) {
      return res.status(400).json({
        status: false,
        message: "Nominal setoran minimal Rp 1.000",
      });
    }

    // 2. Cari Tipe Tagihan (untuk mendapatkan bill_type_id)
    const billType = await db.BillType.findOne({
      where: { type_code: category }
    });
    
    if (!billType) {
      return res.status(404).json({
        status: false,
        message: `Kategori '${category}' tidak ditemukan.`,
      });
    }

    // 3. Buat BillItem Baru
    // Hasil dari .create() akan mengembalikan objek yang baru saja disimpan di DB
    const newItem = await db.BillItem.create({
      member_id: memberId,
      bill_type_id: billType.bill_type_id,
      category_code: category,
      amount: parseFloat(amount),
      description: `Setoran ${billType.type_name}`,
      due_date: moment().add(30, "days").toDate(),
      status: "UNPAID",
    });

    // 4. Ambil bill_item_id dari item yang BARU SAJA dibuat
    // Masukkan ke dalam array agar konsisten dengan kebutuhan InvoicePage
    const billItemIds = [newItem.bill_item_id];

    console.log("ID Tagihan baru saja dibuat:", billItemIds);

    return res.status(201).json({
      status: true,
      message: "Tagihan baru berhasil dibuat",
      data: {
        bill_item_ids: billItemIds, // Mengembalikan [ID_BARU]
        category: category,
        amount: newItem.amount
      },
    });

  } catch (error) {
    console.error("Error Create Voluntary Bill:", error);
    return res.status(500).json({
      status: false,
      message: "Gagal memproses data simpanan.",
      error: error.message
    });
  }
};