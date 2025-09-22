import MPaymentFees from "../../models/payment/MPaymentFees.js";

export const getPaymentFeesByName = async (req, res) => {
  const { ret, name } = req.body;

  try {
    const paymentFees = await MPaymentFees.findOne({
      where: { payment_method: name },
    });

    if (ret === "ret") {
      return paymentFees;
    }
    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil metode pembayaran",
      data: paymentFees,
    });
  } catch (error) {
    if (ret === "ret") {
      console.error("Error mengambil metode pembayaran:", error);
      return error;
    }
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil metode pembayaran",
      error: error.message,
    });
  }
};
