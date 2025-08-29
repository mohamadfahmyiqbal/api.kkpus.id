import moment from "moment";
import { findTransByJenis } from "../transaksi/findTransByJenis.js";
import MNeracaPinjaman from "../../models/pinjaman/MNeracaPinjaman.js";

export const getJurnalPinjamanLunak = async (req, res) => {
  try {
    const { startDate } = req.body;

    if (!startDate) {
      return res
        .status(400)
        .json({ message: "Tanggal awal (startDate) wajib diisi." });
    }

    const tahunBerjalan = startDate;

    // Ambil data transaksi jenis Pinjaman Lunak (PL)
    const transaksi = await findTransByJenis({
      body: { ret: "ret", jenis: "PL" },
    });

    // Ambil data neraca berdasarkan periode
    const neraca = await MNeracaPinjaman.findOne({
      raw: true,
      where: { periode: startDate },
    });

    if (!neraca) {
      return res.status(404).json({ message: "Data neraca tidak ditemukan." });
    }

    const totalKas = Number(neraca.total_kas) || 0;
    const debitKas = Number(neraca.debit_kas) || 0;
    const creditPiutang = Number(neraca.credit_piutang) || 0;
    const totalPiutang = Number(neraca.total_piutang) || 0;
    const debitPiutang = Number(neraca.debit_piutang) || 0;
    const creditKas = Number(neraca.credit_kas) || 0;
    const DebitHibah = neraca?.debit_hibah || 0;
    const CreditHibah = neraca?.credit_hibah || 0;
    const TotalHibah = neraca?.total_hibah;
    // HITUNG HIBAH CSR (Hibah SHU)
    const hibah =
      transaksi?.reduce((sum, trx) => {
        if (trx.batch === "Hibah SHU") {
          return sum + Number(trx.jumlah || 0);
        }
        return sum;
      }, 0) || 0;

    const totalHibah = totalKas + hibah - 0;

    // HITUNG PENGEMBALIAN PL TAHUN BERJALAN (Setor)
    const Pengembalian =
      transaksi?.reduce((sum, trx) => {
        if (
          trx.jenis === "PL" &&
          trx.type === "Setor" &&
          moment(trx.createdAt).format("YYYY") === tahunBerjalan
        ) {
          return sum + Number(trx.jumlah || 0);
        }
        return sum;
      }, 0) || 0;

    const totalPengembalian = totalKas + hibah + Pengembalian;

    // HITUNG Penyaluran PL TAHUN BERJALAN (Setor)
    const Penyaluran =
      transaksi?.reduce((sum, trx) => {
        if (
          trx.jenis === "PL" &&
          trx.type === "Tarik" &&
          moment(trx.createdAt).format("YYYY") === tahunBerjalan
        ) {
          return sum + Number(trx.jumlah || 0);
        }
        return sum;
      }, 0) || 0;

    const totalPenyaluran = totalKas + hibah + Pengembalian - Penyaluran;
    // HITUNG Kerugian PL TAHUN BERJALAN (Setor)
    const Kerugian =
      transaksi?.reduce((sum, trx) => {
        if (
          trx.jenis === "PL" &&
          trx.type === "TakTagih" &&
          moment(trx.createdAt).format("YYYY") === tahunBerjalan
        ) {
          return sum + Number(trx.jumlah || 0);
        }
        return sum;
      }, 0) || 0;

    const totalKerugian = totalPiutang + Kerugian - 0;
    // saldo akhir
    const debitAkhir = debitKas + hibah + Pengembalian;
    const creditAkhir = creditKas + Penyaluran;
    const akhirDebitPiutang = debitPiutang + Penyaluran;
    const akhirCreditPiutang = creditPiutang + Pengembalian + Kerugian;
    const akhirDebitHibah = DebitHibah;
    const akhirCreditHibah = Number(CreditHibah) + hibah;
    // Susun hasil dalam struktur
    const result = {
      "Kas Pinjaman Lunak": {
        "Saldo Awal": {
          Debit: debitKas || 0,
          Credit: creditKas || 0,
          Total: totalKas,
        },
        "Hibah SHU CSR untuk Kas Pinjaman Lunak": {
          Debit: hibah,
          Credit: 0,
          Total: totalHibah,
        },
        "Pengembalian Pinjaman Lunak dari Anggota": {
          Debit: Pengembalian,
          Credit: 0,
          Total: totalPengembalian,
        },
        "Penyaluran Pinjaman Lunak": {
          Debit: 0,
          Credit: Penyaluran,
          Total: totalPenyaluran,
        },
        "Kerugian Pinjaman Lunak": {
          Debit: 0,
          Credit: 0,
          Total: 0,
        },
        "Saldo Akhir": {
          Debit: debitAkhir,
          Credit: creditAkhir,
          Total: debitAkhir - creditAkhir,
        },
      },
      "Piutang Pinjaman Anggota": {
        "Saldo Awal": {
          Debit: debitPiutang || 0,
          Credit: creditPiutang || 0,
          Total: totalPiutang,
        },
        "Pengembalian Pinjaman Lunak dari Anggota": {
          Debit: 0,
          Credit: Pengembalian,
          Total: totalPiutang + 0 - Pengembalian,
        },
        "Penyaluran Pinjaman Lunak": {
          Debit: Penyaluran,
          Credit: 0,
          Total: totalPiutang + Pengembalian - Penyaluran,
        },
        "Kerugian Pinjaman Lunak": {
          Debit: 0,
          Credit: Kerugian,
          Total: totalPiutang + Penyaluran - (Pengembalian + Kerugian),
        },
        "Saldo Akhir": {
          Debit: akhirDebitPiutang,
          Credit: akhirCreditPiutang,
          Total: akhirDebitPiutang - akhirCreditPiutang,
        },
      },
      "Hibah Dari SHU CSR Modal": {
        "Saldo Awal": {
          Debit: DebitHibah,
          Credit: CreditHibah,
          Total: totalHibah,
        },
        "Hibah SHU CSR untuk Kas Pinjaman Lunak": {
          Debit: 0,
          Credit: hibah,
          Total: totalHibah,
        },
        "Saldo Akhir": {
          Debit: akhirDebitHibah,
          Credit: akhirCreditHibah,
          Total: akhirDebitHibah - akhirCreditHibah,
        },
      },
      "Beban Piutang Tak Tertagih": {
        "Saldo Awal": {
          Debit: 0,
          Credit: 0,
          Total: 0,
        },
        "Hibah SHU CSR untuk Kas Pinjaman Lunak": {
          Debit: Kerugian,
          Credit: 0,
          Total: totalKerugian,
        },
        "Saldo Akhir": {
          Debit: Kerugian,
          Credit: 0,
          Total: Kerugian - 0,
        },
      },
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Terjadi error saat mengambil neraca pinjaman lunak:",
      error.message
    );
    return res.status(500).json({
      message: "Terjadi kesalahan pada server saat mengambil laporan.",
    });
  }
};
