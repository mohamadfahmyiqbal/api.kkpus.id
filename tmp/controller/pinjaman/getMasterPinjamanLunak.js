import { Op } from "sequelize";
import MPinjamanMaster from "../../models/pinjaman/MPinjamanMaster.js";
import MAnggota from "../../models/anggota/MAnggota.js";
import moment from "moment";

export const getMasterPinjamanLunak = async (req, res) => {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "startDate dan endDate harus disertakan.",
    });
  }

  const start = moment(`${startDate}`).startOf("year").format("YYYY-MM-DD");
  const end = moment(`${endDate}`).endOf("year").format("YYYY-MM-DD");

  try {
    const data = await MPinjamanMaster.findAll({
      raw: true,
      nest: true,
      where: {
        createdAt: {
          [Op.between]: [start, end],
        },
      },
      include: [
        {
          model: MAnggota,
          as: "anggota",
          attributes: ["nama"],
          required: false,
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    let pinjamanTakTertagihTotal = 0;

    const filteredData = data.filter((item) => {
      if ((item.keterangan || "").toLowerCase() === "pinjaman tak tertagih") {
        const jumlah = parseFloat(item.jumlah) || 0;
        pinjamanTakTertagihTotal += Math.abs(jumlah); // Hilangkan minus di sini juga
        return false; // skip item ini
      }
      return true;
    });

    const result = filteredData.map((item) => {
      const {
        no_pinjaman = "-",
        nik = "-",
        akun = "",
        jumlah = 0,
        anggota: { nama = "-" } = {},
        keterangan = "-",
      } = item;

      const akunLower = akun.toLowerCase();
      const nilai = Math.abs(parseFloat(jumlah)) || 0; // Pastikan positif

      const credit = akunLower === "credit" ? nilai : 0;
      const debit = akunLower === "debet" ? nilai : 0;

      return {
        no_pinjaman,
        pic: nik,
        nama,
        keperluan: keterangan,
        credit: Number(credit),
        debit: Number(debit),
        saldo: Number(nilai),
      };
    });

    // Tambahkan satu entri pinjaman tak tertagih (jika ada)
    if (pinjamanTakTertagihTotal > 0) {
      result.push({
        no_pinjaman: "-",
        pic: "-",
        nama: "-",
        keperluan: "pinjaman tak tertagih",
        credit: 0,
        debit: Number(pinjamanTakTertagihTotal),
        saldo: Number(pinjamanTakTertagihTotal),
      });
    }

    return res.json(result);
  } catch (err) {
    console.error("Error getMasterPinjamanLunak:", err);
    return res.status(500).json({
      message: "Gagal mengambil data pinjaman lunak.",
    });
  }
};
