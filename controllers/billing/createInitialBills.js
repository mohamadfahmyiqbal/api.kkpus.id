import db from "../../models/index.js";
import moment from "moment";

const { BillType, BillItem, Bill } = db;

/**
 * createInitialBills
 * Menghasilkan rincian item tagihan awal untuk member baru (Pokok & Wajib 12 bulan)
 * Hanya menyimpan ke tabel bill_items sesuai struktur schema.
 */
export const createInitialBills = async (memberId, typeCodes, t, monthsToGenerate = 1) => {
  try {
    if (!memberId || !t || !Array.isArray(typeCodes)) {
      throw new Error("Parameter tidak lengkap atau transaksi tidak valid.");
    }

    const billTypes = await BillType.findAll({
      where: { type_code: typeCodes },
      transaction: t,
    });

    if (billTypes.length === 0) {
      console.warn(`⚠️ Warning: No bill types found for codes: ${typeCodes.join(", ")}`);
      return { success: false };
    }

    for (const type of billTypes) {
      const nominal = parseFloat(type.default_amount) || 0;
      
      const iterations = type.period_type === 'MONTHLY' ? monthsToGenerate : 1;

      for (let i = 0; i < iterations; i++) {
        if (t.finished) throw new Error("TRANSACTION_ABORTED");

        const dueDate = moment().add(i, "months").endOf("month").toDate();
        const monthLabel = type.period_type === 'MONTHLY' 
          ? ` - ${moment(dueDate).format("MMMM YYYY")}` 
          : "";

        const fullDescription = `${type.type_name}${monthLabel}`;

        // HANYA CREATE BILL_ITEM
        // bill_id dibiarkan null (nullable di database)
        await BillItem.create({
          bill_type_id: type.bill_type_id,
          category_code: type.type_code, // Gunakan type_code sebagai category_code
          bill_id: null, 
          member_id: memberId,
          description: fullDescription,
          amount: nominal,
          due_date: dueDate,
          status: 'UNPAID'
        }, { transaction: t });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("CRITICAL_ERROR_CREATE_BILLS:", error.message);
    throw error;
  }
};

export default createInitialBills;