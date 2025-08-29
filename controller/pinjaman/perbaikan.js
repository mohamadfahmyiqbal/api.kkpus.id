import { where } from "sequelize";
import MPinjamanAnggota from "../../models/pinjaman/MPinjamanAnggota.js";
import MTrans from "../../models/transaksi/MTrans.js";
import { findTransByJenis } from "../transaksi/findTransByJenis.js";

export const perbaikanPinjamanTrans = async (req, res) => {
  try {
    const getAnggota = await MPinjamanAnggota.findAll({
      raw: true,
      nest: true,
    });

    const updates = getAnggota
      .filter((raw) => raw?.nik) // pastikan nik tidak null/undefined
      .map((raw) => {
        const set = {
          id_master: raw.id,
        };

        console.log(set);

        return MTrans.update(set, {
          where: {
            nik: raw.nik,
            jenis: "PL",
          },
        });
      });

    await Promise.all(updates);

    res.json({ success: true, message: "Transaksi berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui transaksi",
    });
  }
};

export const perbaikanPinjamanAnggota = async (req, res) => {
  try {
    const transaksi = await findTransByJenis({
      body: { ret: "ret", jenis: "PL" },
    });

    // Filter hanya transaksi bertipe "Tarik"
    const tarikTransaksi = transaksi.filter((row) => row.type === "Tarik");

    // Kelompokkan berdasarkan nik dan jumlahkan jumlahnya
    const grouped = tarikTransaksi.reduce((acc, curr) => {
      const nik = curr.nik;
      const jumlah = Number(curr.jumlah) || 0;

      if (!acc[nik]) {
        acc[nik] = { nik, total: 0 };
      }

      acc[nik].total += jumlah;
      return acc;
    }, {});

    // Ubah jadi array dan lakukan update ke database
    const result = Object.values(grouped);

    for (const row of result) {
      await MPinjamanAnggota.update(
        { nominal: row.total }, // Field yang mau diupdate
        { where: { nik: row.nik } } // Kriteria pencarian
      );
    }

    res.json({
      success: true,
      message: "Data berhasil diperbarui",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan",
      error: err.message,
    });
  }
};
