import MTrans from "../../models/transaksi/MTrans.js";

export const getAllTagihanByUser = async (req, res) => {
  const { nik } = req.anggota;
  try {
    const find = await MTrans.findAll({
      where: {
        payment_status: "Menunggu Pembayaran",
        nik,
      },
      raw: true,
      nest: true,
    });

    // kelompokkan dan hitung total
    const grouped = find.reduce((acc, item) => {
      const key = item.jenis || "Lainnya";
      if (!acc[key]) {
        acc[key] = {
          name: key,
          nominal: 0,
          tagihan: 0,
        };
      }
      acc[key].nominal += Number(item.jumlah) || 0;
      acc[key].tagihan += 1;
      return acc;
    }, {});

    // ubah object ke array
    const result = Object.values(grouped);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan" });
  }
};
