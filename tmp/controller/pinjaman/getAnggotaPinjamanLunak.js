import MPinjamanAnggota from "../../models/pinjaman/MPinjamanAnggota.js";
import MTrans from "../../models/transaksi/MTrans.js";
import { Sequelize, Op } from "sequelize";

export const getAnggotaPinjamanLunak = async (req, res) => {
  try {
    // Ambil data pinjaman beserta nama anggota
    const pinjamanList = await MPinjamanAnggota.findAll({
      raw: true,
      nest: true,
      include: [
        {
          association: "anggota",
          attributes: ["nama"],
        },
      ],
    });

    if (!pinjamanList.length) {
      return res.status(200).json([]);
    }

    // Ambil semua id_master dari pinjaman lunak
    const idMasterList = pinjamanList.map((p) => p.id);

    // Ambil total setoran dari transaksi dengan type=Setor dan jenis=PL
    const setorans = await MTrans.findAll({
      raw: true,
      attributes: [
        "id_master",
        [Sequelize.fn("SUM", Sequelize.col("jumlah")), "totalSetoran"],
      ],
      where: {
        type: { [Op.in]: ["Setor", "Ampun"] },
        jenis: "PL",
        id_master: { [Op.in]: idMasterList },
      },
      group: ["id_master"],
    });

    // Buat map id_master -> total setoran
    const setoranMap = setorans.reduce((acc, row) => {
      acc[row.id_master] = Number(row.totalSetoran) || 0;
      return acc;
    }, {});

    // Bangun response akhir
    const result = pinjamanList.map((row) => {
      const idMaster = row.id;
      const jumlahPinjaman = Number(row.nominal);
      const totalSetoran = setoranMap[idMaster] || 0;
      const piutang = jumlahPinjaman - totalSetoran;
      const cicilan = row.term ? jumlahPinjaman / Number(row.term) : 0;
      const statusCicil =
        totalSetoran >= jumlahPinjaman ? "Lunas" : "Belum Lunas";

      return {
        id: row.id,
        id_master: idMaster,
        nik: row.nik,
        nama: row.anggota?.nama || "-",
        jenispinjaman: row.jenis,
        jumlahpinjaman: jumlahPinjaman,
        term: row.term,
        cicilan,
        piutang,
        statuscicilan: statusCicil,
        statusapproval: row?.status || null, // hardcoded, bisa diambil dari field jika ada
        TanggalDaftar: row.createdAt,
      };
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
