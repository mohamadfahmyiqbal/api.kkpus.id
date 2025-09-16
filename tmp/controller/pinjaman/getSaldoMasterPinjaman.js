import moment from "moment";
import MPinjamanMaster from "../../models/pinjaman/MPinjamanMaster.js";
import { Op } from "sequelize";

export const getSaldoMasterPinjaman = async (req, res) => {
  try {
    const latest = await MPinjamanMaster.findOne({
      order: [["createdAt", "DESC"]],
      include: [
        {
          association: "anggota",
          attributes: ["nama"],
        },
      ],
      raw: true,
      nest: true,
    });

    if (!latest) {
      return res.status(404).json({ message: "Tidak ada data ditemukan." });
    }

    const result = {
      nik: latest.nik,
      nama: latest.anggota?.nama || "-",
      saldo: parseFloat(latest.saldo),
      tanggal: moment(latest.createdAt).format("DD-MM-YYYY"),
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error("Gagal mengambil saldo terakhir:", err);
    return res.status(500).json({ error: "Terjadi kesalahan di server." });
  }
};
