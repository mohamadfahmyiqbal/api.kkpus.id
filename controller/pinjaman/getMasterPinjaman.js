import moment from "moment";
import MPinjamanMaster from "../../models/pinjaman/MPinjamanMaster.js";
import { Op } from "sequelize";

export const getMasterPinjaman = async (req, res) => {
  const { ret, nik, startDate, endDate } = req.body;

  try {
    // Validasi input tanggal
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Tanggal mulai dan akhir wajib diisi." });
    }

    const transaksiList = await MPinjamanMaster.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          association: "anggota", // Pastikan nama association sudah didefinisikan di model
          attributes: ["nama"],
        },
      ],
      raw: true,
      nest: true,
    });

    if (!transaksiList.length) {
      return res.status(200).json([]);
    }

    const mapped = transaksiList.map((row) => ({
      id: row.id,
      nik: row?.nik,
      nama: row.anggota?.nama || "-",
      keterangan: row?.keterangan,
      akun: row?.akun,
      jumlah: parseFloat(row?.jumlah),
      saldo: parseFloat(row?.saldo),
      status: "Approved",
      tanggal: moment(row.createdAt).format("DD-MM-YYYY"),
    }));

    return res.status(200).json(mapped);
  } catch (err) {
    console.error("Gagal mengambil data master pinjaman:", err);
    return res.status(500).json({ error: "Terjadi kesalahan di server." });
  }
};
