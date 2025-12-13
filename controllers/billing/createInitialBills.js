// 📁 controllers/billing/createInitialBills.js (Koreksi Logika Menjadi SATU Invoice + Banyak Item)

import db from "../../models/index.js";
import moment from "moment";
// Pastikan BillItem diimpor
const { Member, Bill, BillType, BillItem } = db;
// Import Moment.js untuk tanggal (jika digunakan)
moment.locale("id");

// KONSTANTA CODE YANG DICARI
const CODE_WAJIB_AWAL = "SW_AWAL";
const CODE_WAJIB_BULANAN = "SW_BULANAN";
const BILL_STATUS_PENDING = "UNPAID"; // Status awal tagihan
const DUE_DATE_OFFSET_DAYS = 7;

/**
 * Membuat SATU tagihan awal (Invoice) yang terdiri dari beberapa BillItem.
 * @param {number} memberId - ID anggota
 * @param {object} t - Objek transaksi Sequelize
 * @returns {number} billId dari tagihan gabungan
 */
export const createInitialBills = async (memberId, t) => {
  try {
    // 1. Ambil Member No dan Bill Types secara paralel
    const [memberData, requiredBillTypes] = await Promise.all([
      Member.findOne({
        where: { member_id: memberId },
        attributes: ["member_no"],
        transaction: t,
      }),
      BillType.findAll({
        where: { type_code: [CODE_WAJIB_AWAL, CODE_WAJIB_BULANAN] },
        transaction: t,
      }),
    ]);

    const memberNo = memberData?.member_no;
    if (!memberNo || requiredBillTypes.length === 0) {
      throw new Error(
        "Gagal membuat tagihan: MemberNo atau BillType tidak ditemukan."
      );
    }

    // 2. Hitung total dan siapkan Bill Items Data
    let totalAmount = 0;
    const billItemsData = [];
    let initialBillTypeId = null;

    for (const type of requiredBillTypes) {
      const amount = parseFloat(type.default_amount) || 0;
      totalAmount += amount;

      // Simpan data item yang akan menjadi BillItem
      billItemsData.push({
        description: type.type_name,
        amount: amount,
      });

      // Ambil BillTypeId dari SW_AWAL untuk dijadikan Bill_Type_ID pada invoice utama
      if (type.type_code === CODE_WAJIB_AWAL) {
        initialBillTypeId = type.bill_type_id;
      }
    }

    // Safety check
    if (!initialBillTypeId) {
      throw new Error(
        "Tipe tagihan SW_AWAL tidak ditemukan, tidak bisa membuat Invoice."
      );
    }

    const dueDate = moment().add(DUE_DATE_OFFSET_DAYS, "days").toDate();
    const BILL_DESCRIPTION =
      "Tagihan Awal Anggota Baru (Kewajiban Pokok dan Wajib)";

    // 3. Buat SATU Bill (Parent Invoice)
    const newBill = await Bill.create(
      {
        member_id: memberId,
        member_no: memberNo,
        bill_type_id: initialBillTypeId, // Menggunakan BillType ID SW_AWAL
        description: BILL_DESCRIPTION,
        amount: totalAmount, // Total dari semua item
        due_date: dueDate,
        status: BILL_STATUS_PENDING,
      },
      { transaction: t }
    );

    const initialBillId = newBill.bill_id;

    // 4. Siapkan BillItem untuk BulkCreate
    const billItemsToCreate = billItemsData.map((item) => ({
      bill_id: initialBillId,
      description: item.description,
      amount: item.amount,
    }));

    // 5. Buat BillItems (Child Details)
    // Inilah langkah yang sebelumnya hilang dan menyebabkan 'details' kosong.
    await BillItem.bulkCreate(billItemsToCreate, { transaction: t });

    // 6. Kembalikan ID Bill tunggal yang baru dibuat
    return initialBillId;
  } catch (error) {
    console.error("Error creating initial bills:", error);
    throw error; // Lempar error agar ditangkap oleh rollback di processApproval
  }
};
