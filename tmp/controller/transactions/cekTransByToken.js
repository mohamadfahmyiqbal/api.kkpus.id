import MTrans from "../../models/transaksi/MTrans.js";

export const cekTransByToken = async (req, res) => {
  const { ret, token } = req.body;

  try {
    const cek = await MTrans.findOne({ where: { token } });

    if (cek) {
      if (ret === "ret") {
        return true;
      } else {
        return res.status(400).json({
          success: false,
          message: "Transaksi sudah ada",
        });
      }
    }

    if (ret === "ret") {
      return false;
    }

    return res.status(200).json({
      data: cek,
      message: "Transaksi tidak ditemukan",
    });
  } catch (error) {
    console.error("Error cek transaksi:", error);
    if (ret === "ret") {
      return false;
    }
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memeriksa transaksi",
      error: error.message,
    });
  }
};
