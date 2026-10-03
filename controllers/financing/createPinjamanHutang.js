import db from "../../models/index.js";
import PinjamanHutang from "../../models/program/pinjaman_hutang.js";

const createPinjamanHutang = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { tanggal, no_transaksi, keperluan, jenis, jumlah, pic } = req.body;

    if (!tanggal || !no_transaksi || !keperluan || !jenis || !jumlah || !pic) {
      return res.status(400).json({ status: false, message: "Semua field harus diisi" });
    }

    const newHutang = await PinjamanHutang.create({
      tanggal,
      no_transaksi,
      keperluan,
      jenis,
      jumlah: parseFloat(jumlah),
      pic
    }, { transaction });

    await transaction.commit();
    res.status(201).json({ status: true, message: "Data Hutang Kas berhasil ditambahkan", data: newHutang });
  } catch (error) {
    await transaction.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ status: false, message: "Nomor Transaksi sudah ada" });
    }
    res.status(500).json({ status: false, message: error.message });
  }
};

export default createPinjamanHutang;
