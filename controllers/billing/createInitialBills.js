// 📁 controllers/billing/createInitialBills.js
import db from "../../models/index.js";
import moment from "moment";

// Ambil model sesuai dengan nama yang didefinisikan di db (index.js)
const { Member, Bill, BillType, BillItem } = db;

moment.locale("id");

export const createInitialBills = async (memberId, typeCodes, customAmount = null, t) => {
  try {
    // 1. Ambil Data Member dan Tipe Tagihan
    // Note: Member menggunakan member_id untuk pencarian awal
    const [memberData, requiredBillTypes] = await Promise.all([
      Member.findOne({
        where: { member_id: memberId },
        attributes: ["member_no", "member_id"], // Ambil member_no karena Bill butuh ini
        transaction: t,
      }),
      BillType.findAll({
        where: { type_code: typeCodes },
        transaction: t,
      }),
    ]);

    if (!memberData || requiredBillTypes.length === 0) {
      throw new Error("Gagal: Member atau Tipe Tagihan tidak ditemukan.");
    }

    let totalAmount = 0;
    const billItemsData = requiredBillTypes.map((type) => {
      const amount = customAmount ? parseFloat(customAmount) : (parseFloat(type.default_amount) || 0);
      totalAmount += amount;
      return {
        description: type.type_name,
        amount: amount,
      };
    });

    // 2. Buat Parent Bill
    // Berdasarkan models/index.js, Bill butuh member_id dan member_no
    const newBill = await Bill.create(
      {
        member_id: memberId,
        member_no: memberData.member_no, // Penting karena ada relasi foreignKey: "member_no"
        bill_type_id: requiredBillTypes[0].bill_type_id,
        description: customAmount ? `Setoran ${requiredBillTypes[0].type_name}` : "Tagihan Awal Anggota",
        amount: totalAmount,
        due_date: moment().add(1, "days").toDate(),
        status: "UNPAID",
      },
      { transaction: t }
    );

    // 3. Buat Detail Items
    await BillItem.bulkCreate(
      billItemsData.map((item) => ({
        bill_id: newBill.bill_id,
        description: item.description,
        amount: item.amount,
      })),
      { transaction: t }
    );

    return newBill.bill_id;
  } catch (error) {
    console.error("Error in createInitialBills:", error);
    throw error;
  }
};