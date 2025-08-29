import MNeracaPinjaman from "../../models/pinjaman/MNeracaPinjaman.js";
import { findTransByJenis } from "../transaksi/findTransByJenis.js";
import moment from "moment";

export const getNeracaPinjamanLunak = async (req, res) => {
  try {
    const { startDate } = req.body;
    if (!startDate) {
      return res
        .status(400)
        .json({ message: "Tanggal awal (startDate) wajib diisi." });
    }

    const tahun = moment(startDate).format("YYYY");

    // Ambil transaksi jenis PL
    const transaksi = await findTransByJenis({
      body: { ret: "ret", jenis: "PL" },
    });

    // Ambil neraca awal
    const neraca = await MNeracaPinjaman.findOne({
      raw: true,
      where: { periode: startDate },
    });

    if (!neraca) {
      return res.status(404).json({ message: "Data neraca tidak ditemukan." });
    }

    // Ambil nilai dari neraca awal
    const {
      total_kas = 0,
      debit_kas = 0,
      credit_kas = 0,
      total_piutang = 0,
      debit_piutang = 0,
      credit_piutang = 0,
      debit_hibah = 0,
      credit_hibah = 0,
    } = neraca;

    // Fungsi bantu untuk menjumlahkan nilai transaksi berdasarkan kondisi
    const sumTransaksi = (filterFn) =>
      transaksi?.reduce(
        (sum, trx) =>
          filterFn(trx) && moment(trx.createdAt).format("YYYY") === tahun
            ? sum + Number(trx.jumlah || 0)
            : sum,
        0
      );

    // Hitung jenis transaksi
    const hibah = sumTransaksi((trx) => trx.batch === "Hibah SHU");
    const pengembalian = sumTransaksi(
      (trx) => trx.type === "Setor" && trx.jenis === "PL"
    );
    const penyaluran = sumTransaksi(
      (trx) => trx.type === "Tarik" && trx.jenis === "PL"
    );
    const kerugian = sumTransaksi(
      (trx) => trx.type === "TakTagih" && trx.jenis === "PL"
    );

    // Hitung saldo akhir kas
    const debitAkhirKas = Number(debit_kas) + hibah + pengembalian;
    const creditAkhirKas = Number(credit_kas) + penyaluran;
    const saldoKas = debitAkhirKas - creditAkhirKas;

    // Hitung saldo akhir piutang
    const debitAkhirPiutang = Number(debit_piutang) + penyaluran;
    const creditAkhirPiutang = Number(credit_piutang) + pengembalian + kerugian;
    const saldoPiutang = debitAkhirPiutang - creditAkhirPiutang;

    const totalAktiva = saldoKas + saldoPiutang;

    // Hitung modal
    const creditAkhirHibah = Number(credit_hibah) + hibah;
    const saldoModal = Number(debit_hibah) - creditAkhirHibah;

    // Total pasiva
    const totalPasiva = saldoModal + kerugian;

    const result = {
      tahun: Number(tahun),
      aktiva: [
        {
          kelompok: "Aktiva Lancar",
          akun: [
            { nama: "Kas Pinjaman Lunak", debit: saldoKas, credit: null },
            { nama: "Piutang PL Anggota", debit: saldoPiutang, credit: null },
          ],
        },
        {
          kelompok: "Aktiva Tetap",
          akun: [
            { nama: "", debit: 0, credit: 0 },
            { nama: "Total Aktiva Tetap", debit: 0, credit: 0 },
          ],
        },
        {
          kelompok: "Total",
          akun: [{ nama: "Total Aktiva", debit: 0, credit: totalAktiva }],
        },
      ],
      pasiva: [
        {
          kelompok: "Hutang",
          akun: [
            { nama: "Hutang Kas", debit: null, credit: null },
            { nama: "Total Hutang Lancar", debit: null, credit: null },
          ],
        },
        {
          kelompok: "Modal",
          akun: [
            { nama: "Modal Pinjaman Lunak", debit: saldoModal, credit: 0 },
            { nama: "Total Modal", debit: 0, credit: saldoModal },
          ],
        },
        {
          kelompok: "Total",
          akun: [{ nama: "Total Pasiva", debit: 0, credit: totalPasiva }],
        },
      ],
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
