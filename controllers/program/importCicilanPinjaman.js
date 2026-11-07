import { readExcelBuffer } from "../../utils/excelGenerator.js";
import db from "../../models/index.js";

const { Member, FinancingApplication, BillItem, BillType } = db;

const parseDateValue = (val) => {
  if (!val) return new Date();
  if (val instanceof Date && !isNaN(val.getTime())) {
    return val;
  }
  if (typeof val === "number") {
    // Excel base date: 1899-12-30
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(excelEpoch.getTime() + val * 86400000);
  }
  const parsed = new Date(val);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }
  return new Date();
};

export const importCicilanPinjaman = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Tidak ada file yang diunggah" });
    }

    const data = await readExcelBuffer(req.file.buffer);

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
      const rawRow = data[i];
      if (!rawRow || typeof rawRow !== "object") continue;

      // Sanitasi input mencegah prototype pollution (CWE-1321 / ISO 27001 A.8.8)
      const row = Object.create(null);
      for (const [key, val] of Object.entries(rawRow)) {
        if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
        row[key] = typeof val === "string" ? val.trim() : val;
      }

      const memberNo = row["No. Anggota"];
      const loanName = row["Nama Pinjaman"] || row["Nama Transaksi"] || row["Pinjaman"];
      const installmentNo = parseInt(row["Cicilan Ke"] || row["Cicilan"]) || 1;
      const nominal = parseFloat(row["Nominal Bayar"] || row["Nominal"] || row["Jumlah"]) || 0;
      const rawTanggal = row["Tanggal Pembayaran (YYYY-MM-DD)"] || row["Tanggal Pembayaran"] || row["Tanggal"];
      let statusInput = (row["Status"] || "PAID").toString().trim().toUpperCase();
      const keterangan = row["Keterangan / Catatan"] || row["Keterangan"] || `Setoran Cicilan Pinjaman Bulan ${installmentNo}`;

      if (!["PAID", "UNPAID"].includes(statusInput)) {
        statusInput = "PAID";
      }

      if (!memberNo || nominal <= 0) {
        errorData.push({
          row: i + 2,
          reason: "No. Anggota atau Nominal Bayar tidak valid/kosong",
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

      // Cari kontrak pinjaman milik anggota ini
      const financingWhere = {
        member_id: existingMember.member_id,
        purpose: { [db.Sequelize.Op.like]: "Pinjaman%" },
      };

      if (loanName) {
        financingWhere.purpose = { [db.Sequelize.Op.like]: `%${loanName.trim()}%` };
      }

      const financing = await FinancingApplication.findOne({
        where: financingWhere,
        order: [["created_at", "DESC"]],
      });

      if (!financing) {
        errorData.push({
          row: i + 2,
          reason: `Data Pinjaman ${loanName ? `(${loanName}) ` : ""}untuk anggota ${memberNo} tidak ditemukan`,
        });
        continue;
      }

      const paymentDate = parseDateValue(rawTanggal);

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

        // Cek jika cicilan sudah lunas terhadap total_tagihan
        if (statusInput === "PAID" && financing.total_tagihan > 0) {
          const totalPaidItems = await BillItem.sum("amount", {
            where: {
              financing_application_id: financing.financing_id,
              category_code: "TRANSACTION_INSTALLMENT",
              status: "PAID",
            },
          });

          if (totalPaidItems >= parseFloat(financing.total_tagihan) && ["APPROVED", "ACTIVE"].includes(financing.status)) {
            await financing.update({ status: "COMPLETED" });
          }
        }

        successData.push(newBillItem);
      } catch (err) {
        errorData.push({ row: i + 2, reason: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Proses import data transaksi cicilan pinjaman selesai",
      data: {
        totalImported: successData.length,
        totalFailed: errorData.length,
        errors: errorData,
      },
    });
  } catch (error) {
    console.error("Import Cicilan Pinjaman Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat import transaksi cicilan pinjaman",
    });
  }
};
