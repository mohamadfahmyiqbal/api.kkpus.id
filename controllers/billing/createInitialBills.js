// 📁 controllers/billing/createInitialBills.js

import db from "../../models/index.js";
import moment from "moment";

const { Member, Bill, BillType, BillItem } = db;
moment.locale("id");

const CODE_WAJIB_AWAL = "SW_AWAL";
const CODE_WAJIB_BULANAN = "SW_BULANAN";
const BILL_STATUS_PENDING = "UNPAID";
const DUE_DATE_OFFSET_DAYS = 7;

/**
 * Membuat SATU tagihan awal (Invoice) yang terdiri dari beberapa BillItem.
 */
export const createInitialBills = async (memberId, t) => {
  try {
    // 1. Ambil Data Member dan Tipe Tagihan secara paralel
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

    // 2. Kalkulasi Total dan Persiapan Item
    let totalAmount = 0;
    const billItemsData = [];
    let initialBillTypeId = null;

    for (const type of requiredBillTypes) {
      const amount = parseFloat(type.default_amount) || 0;
      totalAmount += amount;

      billItemsData.push({
        description: type.type_name,
        amount: amount,
      });

      if (type.type_code === CODE_WAJIB_AWAL) {
        initialBillTypeId = type.bill_type_id;
      }
    }

    if (!initialBillTypeId) {
      throw new Error("Tipe tagihan SW_AWAL tidak ditemukan.");
    }

    const dueDate = moment().add(DUE_DATE_OFFSET_DAYS, "days").toDate();
    const BILL_DESCRIPTION =
      "Tagihan Awal Anggota Baru (Kewajiban Pokok dan Wajib)";

    // 3. Buat Parent Bill
    const newBill = await Bill.create(
      {
        member_id: memberId,
        member_no: memberNo,
        bill_type_id: initialBillTypeId,
        description: BILL_DESCRIPTION,
        amount: totalAmount,
        due_date: dueDate,
        status: BILL_STATUS_PENDING,
      },
      { transaction: t }
    );

    // 4. Buat Detail Bill Items
    const billItemsToCreate = billItemsData.map((item) => ({
      bill_id: newBill.bill_id,
      description: item.description,
      amount: item.amount,
    }));

    await BillItem.bulkCreate(billItemsToCreate, { transaction: t });

    return newBill.bill_id;
  } catch (error) {
    console.error("Error creating initial bills:", error);
    throw error;
  }
};
