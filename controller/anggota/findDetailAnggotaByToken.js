import MAnggota from "../../models/anggota/MAnggota.js";
import MAnggotaBank from "../../models/anggota/MAnggotaBank.js";
import MAnggotaDetail from "../../models/anggota/MAnggotaDetail.js";
import MAnggotaJob from "../../models/anggota/MAnggotaJob.js";

/**
 * Mengambil detail lengkap anggota berdasarkan token.
 * Mengembalikan data user, detail, pekerjaan, dan bank.
 */
export const FindDetailAnggotaByToken = async (req, res) => {
  let token = null;

  // Ambil token dari cookie jika ada, jika tidak dari header Authorization (tanpa Bearer)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization) {
    token = req.headers.authorization;
  }
  const { ret } = req.body || {};

  try {
    // Cari user utama
    const user = await MAnggota.findOne({
      where: { token },
      attributes: { exclude: ["password", "token"] },
      raw: true,
    });

    if (!user) {
      if (ret === "ret") {
        return { message: "Anggota tidak ditemukan" };
      }
      return res.status(404).json({ message: "Anggota tidak ditemukan" });
    }

    // Ambil detail tambahan berdasarkan token (pakai user.nik sebagai token relasi)
    const [detail, jobs, bank] = await Promise.all([
      MAnggotaDetail.findOne({ where: { token: user.nik }, raw: true }),
      MAnggotaJob.findOne({ where: { token: user.nik }, raw: true }),
      MAnggotaBank.findOne({ where: { token: user.nik }, raw: true }),
    ]);

    const result = {
      user,
      detail: detail || null,
      pekerjaan: jobs || null,
      bank: bank || null,
    };

    if (ret === "ret") {
      return result;
    }
    return res.status(200).json(result);
  } catch (error) {
    if (ret === "ret") {
      return { message: `Terjadi kesalahan pada server: ${error}` };
    }
    return res
      .status(500)
      .json({ message: `Terjadi kesalahan pada server: ${error}` });
  }
};
