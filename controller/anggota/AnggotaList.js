import MAnggota from "../../models/anggota/MAnggota.js";

export const AnggotaList = async (req, res) => {
  const { ret } = req.body || {};

  try {
    const data = await MAnggota.findAll({
      raw: true,
      nest: true,
      // Aktifkan baris berikut untuk memilih field tertentu:
      // attributes: ['id', 'nama', 'alamat'],
      order: [["nama", "ASC"]], // opsional: urutkan berdasarkan nama
    });

    if (ret === "ret") {
      return data;
    }

    return res.status(200).json(data);
  } catch (error) {
    const errMsg = {
      message: "Terjadi kesalahan saat mengambil data anggota",
      error: error.message,
    };

    if (ret === "ret") {
      return errMsg;
    }

    return res.status(500).json(errMsg);
  }
};
