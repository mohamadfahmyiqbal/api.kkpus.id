import { Op } from "sequelize";
import MTrans from "../../models/transaksi/MTrans.js";
import moment from "moment/moment.js";

export const getCardSimpanan = async (req, res) => {
  try {
    const { name, category } = req.body;
    const { nik, nama } = req.anggota;

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
      raw: true,
      nest: true,
    });

    // hitung nominal = sum jumlah jika payment_status == 'pembayaran berhasil'
    const nominal = find
      .filter((row) => row?.payment_status === "Pembayaran Berhasil")
      .reduce((acc, row) => acc + (Number(row?.jumlah) || 0), 0);
    // hitung saldo = sum jumlah jika payment_status == 'pembayaran berhasil'
    const saldo = find
      .filter((row) => row?.payment_status === "Pembayaran Berhasil")
      .reduce((acc, row) => acc + (Number(row?.jumlah) || 0), 0);
    // hitung tagihan = sum jumlah jika payment_status == 'pembayaran berhasil'
    const tagihan = find
      .filter((row) => row?.payment_status === "Menunggu Pembayaran")
      .reduce((acc, row) => acc + (Number(row?.jumlah) || 0), 0);

    if (name === "Simpanan Pokok") {
      var token = find[0].token;
    } else {
      var token = null;
    }
    const send = {
      nama,
      produk: name,
      akad: find[0]?.akad || null,
      tanggal_buka: find[0]?.createdAt
        ? moment(find[0].createdAt).format("DD-MMMM-YYYY")
        : null,
      nominal,
      saldo,
      tagihan,
      token,
    };

    return res.json(send);
  } catch (error) {
    console.error("Error mendapatkan data simpanan:", error);
    return res.status(500).json({
      message: "Gagal mengambil data simpanan",
    });
  }
};
