// 📁 controllers/billing/getInvoiceDetail.js (FINAL & KOREKSI ALIAS)

import db from "../../models/index.js";
// Hapus moment jika Anda tidak menggunakannya untuk formatting tanggal, atau pastikan Anda sudah menginstalnya
import moment from "moment";
// WAJIB: Atur locale ke Indonesia
moment.locale("id");

const { Bill, BillItem, Member } = db;

/**
 * Kontroler untuk mendapatkan detail satu tagihan berdasarkan ID.
 * Endpoint: GET /tagihan/:billId
 */
export const getInvoiceDetail = async (req, res) => {
  const { billId } = req.params;

  if (!billId) {
    return res
      .status(400)
      .json({ status: false, message: "Bill ID harus disediakan." });
  }

  try {
    // 1. Ambil data Bill, termasuk BillItem (as: 'items') dan Member (as: 'member')
    const bill = await Bill.findOne({
      where: { bill_id: billId },

      // Pilih kolom utama dari tabel 'bills'
      attributes: [
        "bill_id",
        "member_no",
        // 'description' dan 'amount' di Bill adalah total, tetap diambil
        "description",
        "amount",
        "due_date",
        "status",
        "createdAt",
        "updatedAt",
      ],

      include: [
        {
          model: BillItem,
          as: "items", // 🛑 KOREKSI: Menggunakan alias 'items' sesuai index.js Anda
          attributes: ["description", "amount"],
        },
        {
          model: Member,
          as: "member", // Menggunakan alias 'member' sesuai index.js Anda
          attributes: ["full_name"],
        },
      ],
    });

    if (!bill) {
      return res.status(404).json({
        status: false,
        message: `Tagihan ID ${billId} tidak ditemukan.`,
      });
    }

    // 2. Format ulang data agar sesuai dengan permintaan frontend (InvoicePage.jsx)
    const formattedData = {
      // Data Member
      member_no: bill.member_no || "N/A",
      full_name: bill.member?.full_name || "Anggota Tidak Dikenal",

      // Data Bill Utama
      // Menggunakan status dari DB sebagai bill_status
      bill_status: bill.status || "UNPAID",
      due_date: bill.due_date,

      // Menggunakan bill.items tetapi menamakannya 'details' di response
      details: bill.items
        ? bill.items.map((item) => ({
            description: item.description,
            amount: parseFloat(item.amount) || 0, // Pastikan amount adalah angka
          }))
        : [],
    };

    return res.status(200).json({ status: true, data: formattedData });
  } catch (error) {
    console.error("Error fetching invoice detail:", error);
    return res.status(500).json({
      status: false,
      message: `Gagal mengambil detail tagihan: ${error.message}`,
    });
  }
};

export default getInvoiceDetail;
