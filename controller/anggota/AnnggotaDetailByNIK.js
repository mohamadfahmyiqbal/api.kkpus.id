import MAnggota from "../../models/anggota/MAnggota.js";
import fs from "fs/promises";
import path from "path";

export const AnnggotaDetailByNIK = async (req, res) => {
  const { nik } = req.anggota;
  try {
    const anggota = await MAnggota.findOne({
      where: { nik },
      include: [
        { association: "detail" },
        { association: "bank" },
        { association: "job" },
        { association: "categoryAnggota" },
      ],
      raw: true,
      nest: true,
    });

    if (!anggota) {
      return res.status(404).json({ message: "Anggota tidak ditemukan" });
    }

    // Tambahkan foto dari folder uploads jika ada
    let fotoImg = null;
    if (anggota.detail && anggota.detail.foto) {
      try {
        const fotoPath = path.resolve("./uploads/foto", `${nik}_foto.jpg`);
        const fotoBuffer = await fs.readFile(fotoPath);
        fotoImg = `data:image/jpeg;base64,${fotoBuffer.toString("base64")}`;
        anggota.fotoImg = fotoImg;
      } catch (err) {
        console.warn(
          `Gagal membaca foto untuk NIK ${nik}:`,
          err?.message ?? err
        );
      }
    }

    return res.status(200).json(anggota);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
