// 📁 src/utils/transactionHelper.js
import db from "../../models/index.js";

export const getValidatedTxType = async (typeCode) => {
  try {
    const billType = await db.BillType.findOne({
      where: { type_code: typeCode, is_active: true },
    });

    if (!billType) {
      throw new Error("Tipe transaksi tidak terdaftar atau tidak aktif.");
    }

    // Mengembalikan tx_type dari database (SETORAN / PENARIKAN)
    return {
      tx_type: billType.tx_type,
      category: billType.category_map, // Misal: MEMBER_REGISTRATION
    };
  } catch (error) {
    throw error;
  }
};
