// 📁 controllers/billing/getInvoiceDetail.js (KOREKSI FINAL FIX: SequelizeDatabaseError)

import db from "../../models/index.js";
import moment from 'moment';
// WAJIB: Atur locale ke Indonesia
moment.locale('id');

const { Bill, BillItem, Member, BillType } = db; // Tambahkan BillType jika ingin digunakan

/**
 * Kontroler untuk mendapatkan detail satu tagihan berdasarkan ID.
 * Endpoint: GET /tagihan/:billId
 */
export const getInvoiceDetail = async (req, res) => {
 const { billId } = req.params;

 if (!billId) {
  return res.status(400).json({ status: false, message: "Bill ID harus disediakan." });
 }

 try {
  // 1. Ambil data Bill, termasuk BillItem dan data Member terkait
  const bill = await Bill.findOne({
   where: { bill_id: billId },

   // 🚨 FIX UTAMA: Pilih HANYA kolom yang sudah ada di database Anda
   attributes: [
    'bill_id',
    'member_no',
    'description',
    'amount',
    'due_date',
    'status',
    'createdAt',
    'updatedAt',
    // Hapus 'bill_type_id' dan 'member_id'
   ],

   include: [
    {
     model: BillItem,
     as: 'items',
     attributes: ['description', 'amount'],
    },
    {
     model: Member,
     as: 'member',
     // Perhatian: Relasi ini di index.js Anda masih menggunakan member_no
     // Jika Anda ingin menggunakan relasi yang lebih baik (FK member_id), 
     // Anda harus menambahkan member_id ke tabel bills dan memigrasinya.
     attributes: ['full_name', 'email', 'phone_number'],
    },
    // Hapus include BillType sampai kolom bill_type_id sudah ada di DB
   ],
  });

  if (!bill) {
   return res.status(404).json({ status: false, message: "Tagihan tidak ditemukan." });
  }

  // 2. Format data menggunakan Moment.js
  const invoiceDetail = {
   billId: bill.bill_id,
   to: bill.member?.full_name || 'Anggota Tidak Dikenal',
   invoiceNumber: bill.bill_id,
   invoiceDate: moment(bill.createdAt).format('DD MMMM YYYY HH:mm'),
   expiredDate: moment(bill.due_date).format('DD MMMM YYYY HH:mm'),
   status: bill.status,
   totalAmount: bill.amount,

   items: bill.items.map(item => ({
    description: item.description,
    // Pastikan amount diubah menjadi angka jika disimpan sebagai string di DB
    amount: parseFloat(item.amount),
   })),

   // Placeholder untuk data pembayaran
   bankName: "Nama Bank Tujuan (Placeholder)",
   virtualAccount: "Nomor Virtual Account (Placeholder)",
  };
console.log(invoiceDetail);

  return res.status(200).json({ status: true, data: invoiceDetail });

 } catch (error) {
  console.error("[getInvoiceDetail] Error:", error);
  // Cek jika error masih terjadi, ini akan membantu
  return res.status(500).json({ status: false, message: "Terjadi kesalahan server saat mengambil detail tagihan.", detail: error.message });
 }
};