import { Op } from "sequelize";
import MPaymentRules from "../../models/payment/MPaymentRules.js";

export const getPaymentRules = async (req, res) => {
  const { ret, tipe_anggota, type } = req.body;
  try {
    const paymentRules = await MPaymentRules.findOne({
      where: {
        tipe_anggota,
        type,
      },
      raw: true,
      nest: true,
    });

    if (ret === "ret") {
      return paymentRules;
    }

    return res.status(200).json({
      success: true,
      data: paymentRules,
    });
  } catch (error) {
    console.error("Error mendapatkan aturan pembayaran:", error);
    if (ret === "ret") {
      return false;
    }
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil aturan pembayaran",
      error: error.message,
    });
  }
};
