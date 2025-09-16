import moment from "moment";
import MPinjamanAnggota from "../../models/pinjaman/MPinjamanAnggota.js";
import { findTransByJenis } from "../transaksi/findTransByJenis.js";
import MAnggota from "../../models/anggota/MAnggota.js";

export const getLaporanPinjamanLunak = async (req, res) => {
  try {
    const { startDate } = req.body;
    if (!startDate) {
      return res.status(400).json({ message: "startDate wajib diisi" });
    }

    const tahunBerjalan = moment(startDate).format("YYYY");
    const tahunMin1 = moment(startDate).subtract(1, "years");
    const tahunMin1Str = tahunMin1.format("YYYY");

    const transaksi = await findTransByJenis({
      body: { ret: "ret", jenis: "PL" },
    });

    const tarikTahunMin1PerNip = {};
    const tarikTahunBerjalanPerNip = {};
    const setorYtdTahunMin1PerNip = {};
    const setorTahunBerjalanPerNip = {};
    const taktagihPerNip = {};

    if (Array.isArray(transaksi)) {
      transaksi.forEach((t) => {
        const nip = t?.nik;
        const nominal = parseFloat(t?.jumlah || 0);
        const tanggalTrans = moment(t?.createdAt);
        const tahunTrans = tanggalTrans.format("YYYY");
        const tahunTransNum = parseInt(tahunTrans);
        const tahunMin1Num = parseInt(tahunMin1Str);

        if (t?.type === "Setor") {
          if (tahunTransNum <= tahunMin1Num) {
            if (!setorYtdTahunMin1PerNip[nip]) setorYtdTahunMin1PerNip[nip] = 0;
            setorYtdTahunMin1PerNip[nip] += nominal;
          }
          if (tahunTrans === tahunBerjalan) {
            if (!setorTahunBerjalanPerNip[nip])
              setorTahunBerjalanPerNip[nip] = 0;
            setorTahunBerjalanPerNip[nip] += nominal;
          }
        }

        if (t?.type === "Tarik") {
          if (tahunTransNum <= tahunMin1Num) {
            if (!tarikTahunMin1PerNip[nip]) tarikTahunMin1PerNip[nip] = 0;
            tarikTahunMin1PerNip[nip] += nominal;
          }
          if (tahunTrans === tahunBerjalan) {
            if (!tarikTahunBerjalanPerNip[nip])
              tarikTahunBerjalanPerNip[nip] = 0;
            tarikTahunBerjalanPerNip[nip] += nominal;
          }
        }

        if (t?.type === "TakTagih") {
          if (!taktagihPerNip[nip]) taktagihPerNip[nip] = 0;
          taktagihPerNip[nip] += nominal;
        }
      });
    }

    const getAnggota = await MPinjamanAnggota.findAll({
      raw: true,
      nest: true,
    });

    const reclassList = [];
    let totalTarikFyBerjalan = 0;
    let totalSetorFyBerjalan = 0;
    let totalTakTagih = 0;

    for (const agt of Object.values(getAnggota)) {
      const nip = agt?.nik;
      const detailAnggota = await MAnggota.findOne({
        raw: true,
        nest: true,
        where: { nik: nip },
      });

      const tarikYtdMin1 = tarikTahunMin1PerNip[nip] || 0;
      const tarikFyBerjalan = tarikTahunBerjalanPerNip[nip] || 0;
      const tarikYtdBerjalan = tarikYtdMin1 + tarikFyBerjalan;
      totalTarikFyBerjalan += tarikFyBerjalan;

      const setorYtdMin1 = setorYtdTahunMin1PerNip[nip] || 0;
      const setorFyBerjalan = setorTahunBerjalanPerNip[nip] || 0;
      const setorYtdBerjalan = setorYtdMin1 + setorFyBerjalan;
      totalSetorFyBerjalan += setorFyBerjalan;

      const takTagih = taktagihPerNip[nip] || 0;
      totalTakTagih += takTagih;

      const sisaCicil = tarikYtdBerjalan - setorYtdBerjalan - takTagih;
      const statusSetor = sisaCicil > 0 ? "Belum Lunas" : "Lunas";

      reclassList.push({
        nip: nip,
        nama: detailAnggota?.nama,
        jenis: agt?.jenis,
        term: agt?.term,
        "jumlah pinjaman": {
          [`${tahunBerjalan} ytd`]: Number(tarikYtdBerjalan),
          [`${tahunBerjalan} fy`]: Number(tarikFyBerjalan),
          [`ytd ${tahunMin1Str}`]: Number(tarikYtdMin1),
        },
        "pembayaran cicilan": {
          [`${tahunBerjalan} ytd`]: Number(setorYtdBerjalan),
          [`${tahunBerjalan} fy`]: Number(setorFyBerjalan),
          [`ytd ${tahunMin1Str}`]: Number(setorYtdMin1),
        },
        "cicilan tak tertagih": Number(takTagih),
        "Sisa Cicilan": Number(sisaCicil),
        "Status Pinjaman": statusSetor,
      });
    }

    const totalRow = {
      [`jumlah pinjaman ${tahunBerjalan} ytd`]: 0,
      [`jumlah pinjaman ${tahunBerjalan} fy`]: totalTarikFyBerjalan,
      [`jumlah pinjaman ytd ${tahunMin1Str}`]: 0,

      [`pembayaran cicilan ${tahunBerjalan} ytd`]: 0,
      [`pembayaran cicilan ${tahunBerjalan} fy`]: totalSetorFyBerjalan,
      [`pembayaran cicilan ytd ${tahunMin1Str}`]: 0,

      "cicilan tak tertagih": totalTakTagih,
      "Sisa Cicilan": 0,
    };

    reclassList.forEach((item) => {
      const pinjaman = item["jumlah pinjaman"];
      const cicilan = item["pembayaran cicilan"];

      totalRow[`jumlah pinjaman ${tahunBerjalan} ytd`] +=
        pinjaman?.[`${tahunBerjalan} ytd`] || 0;
      totalRow[`jumlah pinjaman ytd ${tahunMin1Str}`] +=
        pinjaman?.[`ytd ${tahunMin1Str}`] || 0;

      totalRow[`pembayaran cicilan ${tahunBerjalan} ytd`] +=
        cicilan?.[`${tahunBerjalan} ytd`] || 0;
      totalRow[`pembayaran cicilan ytd ${tahunMin1Str}`] +=
        cicilan?.[`ytd ${tahunMin1Str}`] || 0;

      totalRow["Sisa Cicilan"] += item["Sisa Cicilan"] || 0;
    });

    const jurnal = [
      {
        "Penyaluran Pinjaman Lunak untuk Anggota": {
          "Piutang Anggpta": {
            Debit: Number(totalTarikFyBerjalan),
            Credit: null,
            Akun: "Aktiva Lancar",
          },
          Kas: {
            Debit: null,
            Credit: Number(totalTarikFyBerjalan),
            Akun: "Aktiva Lancar",
          },
        },
        "Pengembalian Pinjaman Lunak dari Anggota": {
          Kas: {
            Debit: Number(totalSetorFyBerjalan),
            Credit: null,
            Akun: "Aktiva Lancar",
          },
          "Piutang Anggpta": {
            Debit: null,
            Credit: Number(totalSetorFyBerjalan),
            Akun: "Aktiva Lancar",
          },
        },
        "Kerugian atas pinjaman lunak": {
          "Pinjaman Tak Tertagih": {
            Debit: Number(totalTakTagih),
            Credit: null,
            Akun: "Beban",
          },
          "Piutang Anggpta": {
            Debit: null,
            Credit: Number(totalTakTagih),
            Akun: "Aktiva Lancar",
          },
        },
      },
    ];

    res.json({
      jurnal: jurnal,
      reclass: reclassList,
      totalReclass: totalRow,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil laporan",
    });
  }
};
