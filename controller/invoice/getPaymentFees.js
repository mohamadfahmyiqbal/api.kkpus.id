import MPaymentFees from "../../models/payment/MPaymentFees.js";

export const getPaymentFees = async (req, res) => {
  try {
    const paymentFees = await MPaymentFees.findAll({
      order: [["id", "ASC"]], // Urutkan berdasarkan ID
    });

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil metode pembayaran",
      data: paymentFees,
    });
  } catch (error) {
    console.error("Error mengambil metode pembayaran:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil metode pembayaran",
      error: error.message,
    });
  }
};
