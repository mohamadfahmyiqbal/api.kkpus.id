// 📁 controllers/billing/createSavingsBill.js

/**
 * Membuat tagihan setoran simpanan dinamis berdasarkan input user
 */
export const createSavingsBill = async (memberId, amount, category, t) => {
  try {
    // 1. Cari Tipe Tagihan berdasarkan kategori_map (Sukarela/Wajib/dll)
    const billType = await BillType.findOne({
      where: { category_map: category },
      transaction: t,
    });

    if (!billType) throw new Error(`Tipe tagihan untuk kategori ${category} tidak ditemukan.`);

    const memberData = await Member.findOne({
      where: { member_id: memberId },
      attributes: ["member_no"],
      transaction: t,
    });

    // 2. Buat Parent Bill
    const newBill = await Bill.create({
      member_id: memberId,
      member_no: memberData.member_no,
      bill_type_id: billType.bill_type_id,
      description: `Setoran ${category}`,
      amount: amount,
      due_date: moment().add(1, "days").toDate(), // Expired dalam 1 hari
      status: "UNPAID",
    }, { transaction: t });

    // 3. Buat Bill Item
    await BillItem.create({
      bill_id: newBill.bill_id,
      description: `Setoran ${category}`,
      amount: amount,
    }, { transaction: t });

    return newBill; // Mengembalikan object bill lengkap
  } catch (error) {
    console.error("Error createSavingsBill:", error);
    throw error;
  }
};