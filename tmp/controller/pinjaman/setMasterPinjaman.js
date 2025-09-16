import moment from "moment";
import MPinjamanMaster from "../../models/pinjaman/MPinjamanMaster.js";
import { Op } from "sequelize";

export const setMasterPinjaman = async (req, res) => {
  const {
    action,
    id, // untuk update dan delete
    nama,
    nik,
    jumlah,
    saldo,
    akun,
    keterangan,
  } = req.body;

  try {
    if (!action) {
      return res.status(400).json({ error: "Aksi tidak boleh kosong." });
    }

    // CREATE
    if (action === "create") {
      if (!nik || !jumlah || !saldo || !keterangan || !akun) {
        return res
          .status(400)
          .json({ error: "Data tidak lengkap untuk membuat data baru." });
      }

      const dataBaru = await MPinjamanMaster.create({
        nama,
        nik,
        jumlah,
        saldo,
        keterangan,
        akun,
        keterangan: keterangan || "",
      });

      return res.status(200).json({
        message: "Data pinjaman berhasil ditambahkan.",
        data: dataBaru,
      });
    }

    // UPDATE
    else if (action === "update") {
      if (!id) {
        return res.status(400).json({ error: "ID diperlukan untuk update." });
      }

      const existing = await MPinjamanMaster.findByPk(id);
      if (!existing) {
        return res.status(400).json({ error: "Data tidak ditemukan." });
      }

      await existing.update({
        nama,
        nik,
        jumlah,
        saldo,
        keterangan,
        akun,
        keterangan: keterangan || "",
      });

      return res.status(200).json({
        message: "Data pinjaman berhasil diperbarui.",
        data: existing,
      });
    }

    // DELETE
    else if (action === "delete") {
      if (!id) {
        return res
          .status(400)
          .json({ error: "ID diperlukan untuk menghapus data." });
      }

      const existing = await MPinjamanMaster.findByPk(id);
      if (!existing) {
        return res.status(404).json({ error: "Data tidak ditemukan." });
      }

      await existing.destroy();

      return res.status(200).json({
        message: "Data pinjaman berhasil dihapus.",
      });
    }

    // Unknown action
    else {
      return res.status(400).json({ error: "Aksi tidak dikenali." });
    }
  } catch (err) {
    console.error("Kesalahan saat memproses pinjaman master:", err);
    return res.status(400).json({ error: "Terjadi kesalahan di server." });
  }
};
