import PinjamanModal from "../../models/program/pinjaman_modal.js";

export const addPinjamanModal = async (req, res) => {
  try {
    const { bulan, noTransaksi, pic, keperluan, jenis, jumlah } = req.body;

    if (!bulan || !pic || !keperluan || !jenis || !jumlah) {
      return res.status(400).json({ status: false, message: "Semua field mandatory harus diisi" });
    }

    let finalNoTransaksi = noTransaksi;
    if (!finalNoTransaksi) {
      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const randStr = Math.floor(1000 + Math.random() * 9000);
      finalNoTransaksi = `MOD-PL-${dateStr}-${randStr}`;
    }

    // jumlah mungkin berupa string berformat (1.000.000) atau angka
    const rawJumlah = typeof jumlah === 'string' 
      ? parseFloat(jumlah.replace(/\./g, '').replace(/,/g, '')) 
      : parseFloat(jumlah);

    const newTransaction = await PinjamanModal.create({
      tanggal: bulan,
      no_transaksi: finalNoTransaksi,
      pic,
      keperluan,
      jenis,
      jumlah: rawJumlah
    });

    res.status(201).json({
      status: true,
      message: "Data modal berhasil disimpan",
      data: newTransaction
    });
  } catch (error) {
    console.error("Error addPinjamanModal:", error);
    res.status(500).json({ status: false, message: "Gagal menyimpan data modal" });
  }
};
