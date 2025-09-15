import MInvoices from "../../models/payment/MInvoices.js";

export const cekInvoiceByToken = async (req, res) => {
  const { token, ret } = req.body;
  try {
    const cek = await MInvoices.findOne({
      where: { invoice_id: token },
      include: [
        {
          association: "detailsInvoice",
        },
      ],
      raw: false,
      nest: true,
    });

    if (ret === "ret") {
      return cek;
    }

    if (!cek) {
      return res.status(404).json({
        success: false,
        message: "Invoice tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: cek,
    });
  } catch (error) {
    console.error("Error cek invoice:", error);

    if (ret === "ret") {
      return false;
    }

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memeriksa invoice",
      error: error.message,
    });
  }
};
