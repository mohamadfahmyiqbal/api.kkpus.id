import xlsx from "xlsx";
import db from "../../models/index.js";

const { Member, FinancingApplication, BillItem, BillType } = db;

export const importCicilanJualBeli = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Tidak ada file yang diunggah" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({ success: false, message: "File Excel kosong" });
    }

    // Ambil BillType untuk TRANSACTION_INSTALLMENT
    const billType = await BillType.findOne({
      where: { type_code: "TRANSACTION_INSTALLMENT" },
    });
    const defaultBillTypeId = billType?.bill_type_id || 8;

    const successData = [];
    const errorData = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const memberNo = row["No. Anggota"];
      const namaBarang = row["Nama Barang / Transaksi"] || row["Nama Barang"];
      const installmentNo = parseInt(row["Cicilan Ke"] || row["Cicilan"]) || 1;
      const nominal = parseFloat(row["Nominal Bayar"] || row["Nominal"] || row["Jumlah"]) || 0;
      const tanggalInput = row["Tanggal Pembayaran (YYYY-MM-DD)"] || row["Tanggal Pembayaran"] || row["Tanggal"];
      let statusInput = (row["Status"] || "PAID").toString().trim().toUpperCase();
      const keterangan = row["Keterangan / Catatan"] || row["Keterangan"] || `Setoran Cicilan Bulan ${installmentNo}`;

      if (!["PAID", "UNPAID"].includes(statusInput)) {
        statusInput = "PAID";
      }

      if (!memberNo || nominal <= 0) {
        errorData.push({
          row: i + 2,
          reason: "No. Anggota atau Nominal Bayar tidak valid",
        });
        continue;
      }

      const existingMember = await Member.findOne({
        where: { member_no: String(memberNo) },
      });

      if (!existingMember) {
        errorData.push({
          row: i + 2,
          reason: `Anggota dengan No. ${memberNo} tidak ditemukan`,
        });
        continue;
      }

      // Cari kontrak jual beli milik anggota ini
      const financingWhere = {
        member_id: existingMember.member_id,
        category: { [db.Sequelize.Op.ne]: "Pendanaan Syariah UMKM" },
      };

      if (namaBarang) {
        financingWhere.purpose = { [db.Sequelize.Op.like]: `%${namaBarang.trim()}%` };
      }

      const financing = await FinancingApplication.findOne({
        where: financingWhere,
        order: [["created_at", "DESC"]],
      });

      if (!financing) {
        errorData.push({
          row: i + 2,
          reason: `Kontrak Jual Beli ${namaBarang ? `(${namaBarang}) ` : ""}untuk anggota ${memberNo} tidak ditemukan`,
        });
        continue;
      }

      let paymentDate = new Date();
      if (tanggalInput) {
        const parsed = new Date(tanggalInput);
        if (!isNaN(parsed.getTime())) {
          paymentDate = parsed;
        }
      }

      try {
        const newBillItem = await BillItem.create({
          bill_type_id: defaultBillTypeId,
          category_code: "TRANSACTION_INSTALLMENT",
          member_id: existingMember.member_id,
          financing_application_id: financing.financing_id,
          description: keterangan,
          amount: nominal,
          due_date: paymentDate,
          status: statusInput,
          created_at: paymentDate,
          updated_at: paymentDate,
        });

        successData.push(newBillItem);
      } catch (err) {
        errorData.push({ row: i + 2, reason: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Proses import riwayat cicilan selesai",
      data: {
        totalImported: successData.length,
        totalFailed: errorData.length,
        errors: errorData,
      },
    });
  } catch (error) {
    console.error("Import Cicilan Jual Beli Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat import cicilan",
      error: error.message,
    });
  }
};
