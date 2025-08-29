import moment from "moment";
import MPinjamanMaster from "../../models/pinjaman/MPinjamanMaster.js";
import { Op } from "sequelize";
import MPinjamanAnggota from "../../models/pinjaman/MPinjamanAnggota.js";
import MTrans from "../../models/transaksi/MTrans.js";

export const setPengampunan = async (req, res) => {
  const {
    id_master,
    pic,
    roles,
    nik,
    nama,
    jenispinjaman,
    jumlahpinjaman,
    term,
    cicilan,
    piutang,
    statuscicilan,
    statusapproval,
    TanggalDaftar,
    status,
  } = req.body;

  try {
    if (!id_master) {
      return res.status(400).json({ error: "ID Master tidak boleh kosong." });
    }

    const cekAnggota = await MPinjamanAnggota.findOne({
      raw: true,
      nest: true,
      where: { id: id_master },
    });

    if (!cekAnggota) {
      return res.status(404).json({ error: "Data anggota tidak ditemukan." });
    }

    if (!status) {
      return res
        .status(400)
        .json({ error: "Status pengampunan tidak boleh kosong." });
    }

    await MPinjamanAnggota.update({ status }, { where: { id: id_master } });

    // Jika status pengampunan adalah "pengawas", simpan ke MTrans dan MPinjamanMaster
    if (status === "pengawas") {
      try {
        // Ambil saldo terakhir dari MPinjamanMaster berdasarkan nik
        const lastMaster = await MPinjamanMaster.findOne({
          where: { nik },
          order: [["createdAt", "DESC"]],
        });

        const saldoTerakhir = lastMaster ? lastMaster.saldo : 0;
        const saldoBaru = parseFloat(saldoTerakhir) + parseFloat(piutang);

        // Simpan transaksi ke MTrans
        const simpanTrans = await MTrans.create({
          nik,
          nama,
          jenis: "PL",
          jumlah: piutang,
          type: "Ampun",
          createdAt: moment().format("YYYY-MM-DD"),
          id_master,
        });

        // Simpan ke MPinjamanMaster
        const simpanMaster = await MPinjamanMaster.create({
          nik,
          keterangan: "Pinjaman Tak Tertagih",
          akun: "Debet",
          jumlah: piutang,
          saldo: saldoBaru,
        });

        return res.status(200).json({
          message: `Pengampunan berhasil diproses dan status: '${status}'.`,
          transaksi: simpanTrans,
        });
      } catch (error) {
        console.error("Gagal menyimpan transaksi:", error);
        return res
          .status(500)
          .json({ error: "Gagal menyimpan transaksi pengampunan." });
      }
    }

    // Jika status selain pengawas
    return res.status(200).json({
      message: `Status pengampunan diperbarui menjadi '${status}'.`,
    });
  } catch (err) {
    console.error("Kesalahan saat memproses pengampunan:", err);
    return res.status(500).json({ error: "Terjadi kesalahan di server." });
  }
};
