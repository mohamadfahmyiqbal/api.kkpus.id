import { Op } from "sequelize";
import MTrans from "../../models/transaksi/MTrans.js";

export const getAllTagihanDetail = async (req, res) => {
  const { jenis } = req.body;
  const { nik } = req.anggota;

  try {
    const find = await MTrans.findAll({
      where: {
        nik,
        // jenis: { [Op.like]: `%${data}%` },
        jenis,
        payment_status: "Menunggu Pembayaran",
      },
      raw: true,
      nest: true,
    });

    res.json(find);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan" });
  }
};
