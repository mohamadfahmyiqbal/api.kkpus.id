import { Op } from "sequelize";
import MTrans from "../../models/transaksi/MTrans.js";

export const getDataSimpanan = async (req, res) => {
  try {
    const { name, category } = req.body;
    const { nik } = req.anggota;

    if (!name) {
      return res.status(400).json({
        message: "Nama simpanan harus disertakan",
      });
    }

    const find = await MTrans.findAll({
      where: {
        nik,
        jenis: { [Op.like]: `%${name}%` },
      },
      include: [
        {
          association: "invoiceTrans",
          include: [
            {
              association: "detailsInvoice",
              where: {
                name: { [Op.like]: `%${name}%` },
              },
            },
          ],
        },
      ],
      raw: false,
      nest: false,
    });
    return res.status(200).json(find);
  } catch (error) {
    console.error("Error mendapatkan data simpanan:", error);
    return res.status(500).json({
      message: "Gagal mengambil data simpanan",
    });
  }
};
