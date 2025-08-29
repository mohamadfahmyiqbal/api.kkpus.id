import MPinjamanAnggota from "../../models/pinjaman/MPinjamanAnggota.js";
import MTrans from "../../models/transaksi/MTrans.js";
import { Sequelize, Op } from "sequelize";

export const getSetoranPinjaman = async (req, res) => {
  const { ret, nik } = req.body;
  try {
    // Ambil data pinjaman beserta nama anggota
    const transaksiList = await MTrans.findAll({
      raw: true,
      nest: true,
      where: {
        nik: nik,
        type: "Setor",
        jenis: "PL",
      },
      include: [
        {
          association: "anggota",
          attributes: ["nama"],
        },
      ],
    });
    if (!transaksiList.length) {
      return res.status(200).json([]);
    }

    // Hitung mapping akhir
    const mapped = transaksiList.map((row) => {
      return {
        id: row.id,
        periode: null,
        tanggal: row.createdAt,
        nama: row.anggota?.nama || "-",
        "nama setoran": null,
        jumlah: row?.jumlah,
        status: "Approved",
      };
    });
    return res.status(200).json(mapped);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
