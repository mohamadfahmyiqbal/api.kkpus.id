import MAnggotaCategory from "../../models/anggota/MAnggotaCategory.js";

export const getAnggotaCategory = async (req, res) => {
  // Pastikan req.body selalu berupa objek, walaupun kosong
  const body = req.body || {};
  const ret = body.ret;

  try {
    // Ambil semua kategori anggota, urutkan berdasarkan id ASC
    // Perbaikan: filter kategori yang kolom 'show' tidak null dan bernilai true
    const categories = await MAnggotaCategory.findAll({
      raw: true,
      nest: true,
      where: {
        show: 1,
      },
      order: [["id", "ASC"]],
    });

    if (ret === "ret") {
      // Jika hanya ingin mengembalikan data (bukan response express)
      return categories;
    } else {
      return res.status(200).json(categories);
    }
  } catch (error) {
    console.error("Terjadi kesalahan pada getAnggotaCategory:", error);
    if (ret === "ret") {
      // Kembalikan error dalam bentuk objek
      return {
        error: true,
        message: "Terjadi kesalahan pada server.",
        detail: error.message,
      };
    } else {
      return res.status(500).json({
        message: "Terjadi kesalahan pada server.",
        detail: error.message,
      });
    }
  }
};
