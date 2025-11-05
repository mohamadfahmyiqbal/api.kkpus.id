import MAnggotaWallet from "../../models/anggota/MAnggotaWallet.js";

export const GetAnggotaSaldo = async (req, res) => {
  const { nik } = req.anggota; // pastikan req.anggota ada dan berisi nik
  try {
    const dompet = await MAnggotaWallet.findOne({
      where: { nik },
      include: [
        { association: "anggotaWallet" }, // pastikan association di model benar
        { association: "bankWallet" }, // pastikan association di model benar
      ],
      raw: true,
      nest: true,
    });

    if (!dompet) {
      return res.status(404).json({ message: "Saldo anggota tidak ditemukan" });
    }

    res.json(dompet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
