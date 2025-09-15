import MRequest from "../../models/transaksi/MRequest.js";

export const getRequestByToken = async (req, res) => {
  const { ret, token } = req.body;

  if (!token) {
    if (ret === "ret") {
      return false;
    }
    return res.status(400).json({
      success: false,
      message: "Token diperlukan",
    });
  }

  try {
    const requestData = await MRequest.findOne({
      where: { token },
      include: [
        {
          association: "anggota",
          attributes: [
            "nik",
            "nama",
            "email",
            "no_tlp",
            "status_anggota",
            "roles",
          ],
        },
        {
          association: "categoryAnggota",
          attributes: ["id", "nama"],
        },
      ],
      raw: true,
      nest: true,
    });

    if (!requestData) {
      if (ret === "ret") {
        return false;
      }
      return res.status(404).json({
        success: false,
        message: "Data request tidak ditemukan",
      });
    }

    if (ret === "ret") {
      return requestData;
    }

    return res.status(200).json({
      success: true,
      data: requestData,
    });
  } catch (error) {
    console.error("Error mendapatkan request:", error);
    if (ret === "ret") {
      return false;
    }
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data request",
      error: error.message,
    });
  }
};
