import xlsx from "xlsx";
import db from "../../models/index.js";

const { Member, FinancingApplication, BillItem, BillType, sequelize } = db;

const MAX_IMPORT_ROWS = 5000;

export const importCicilanJualBeli = async (req, res) => {
  let transaction;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Tidak ada file yang diunggah" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (!data.length) {
      return res.status(400).json({ success: false, message: "File Excel kosong" });
    }

    if (data.length > MAX_IMPORT_ROWS) {
      return res.status(400).json({
        success: false,
        message: `Jumlah baris melebihi batas ${MAX_IMPORT_ROWS} baris per file.`,
      });
    }

    // Ambil BillType untuk TRANSACTION_INSTALLMENT
    const billType = await BillType.findOne({
      where: { type_code: "TRANSACTION_INSTALLMENT" },
    });
    const defaultBillTypeId = billType?.bill_type_id || 8;

    const successData = [];
    const errorData = [];

    transaction = await sequelize.transaction();

    for (let i = 0; i < data.length; i++) {
      const rawRow = data[i];
      if (!rawRow || typeof rawRow !== "object") continue;

      // Sanitasi input mencegah prototype pollution (OWASP A06 / ISO 27001 A.8.8)
      const row = Object.create(null);
      for (const [key, val] of Object.entries(rawRow)) {
        if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
        row[key] = typeof val === "string" ? val.trim() : val;
      }

      const memberNo = row["No. Anggota"];
      const namaBarang = row["Nama Barang / Transaksi"] || row["Nama Barang"];
      const installmentNo = parseInt(row["Cicilan Ke"] || row["Cicilan"]) || 1;
      const nominal = parseFloat(row["Nominal Bayar"] || row["Nominal"] || row["Jumlah"]) || 0;
      const tanggalInput = row["Tanggal Pembayaran (YYYY-MM-DD)"] || row["Tanggal Pembayaran"] || row["Tanggal"];
      let statusInput = (row["Status"] || "PAID").toString().trim().toUpperCase();
      const keteranganRaw =
        row["Keterangan / Catatan"] ||
        row["Keterangan"] ||
        `Setoran Cicilan Bulan ${installmentNo}`;
      const keterangan = String(keteranganRaw).slice(0, 255);

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

      if (installmentNo < 1 || installmentNo > 600) {
        errorData.push({
          row: i + 2,
          reason: "Cicilan Ke harus berada di antara 1 dan 600",
        });
        continue;
      }

      const existingMember = await Member.findOne({
        where: { member_no: String(memberNo) },
        transaction,
      });

      if (!existingMember) {
        errorData.push({
          row: i + 2,
          reason: `Anggota dengan No. ${memberNo} tidak ditemukan`,
        });
        continue;
      }

      // Cari kontrak jual beli milik anggota ini. Gunakan exact match agar
      // cicilan tidak masuk ke kontrak lain yang namanya mirip.
      const financingWhere = {
        member_id: existingMember.member_id,
        category: { [db.Sequelize.Op.ne]: "Pendanaan Syariah UMKM" },
      };

      if (namaBarang) {
        financingWhere.purpose = String(namaBarang).trim();
      }

      const financing = await FinancingApplication.findOne({
        where: financingWhere,
        order: [["created_at", "DESC"]],
        transaction,
      });

      if (!financing) {
        errorData.push({
          row: i + 2,
          reason: `Kontrak Jual Beli ${namaBarang ? `(${namaBarang}) ` : ""}untuk anggota ${memberNo} tidak ditemukan`,
        });
        continue;
      }

      // Cegah duplikasi saat file yang sama diunggah ulang.
      const duplicate = await BillItem.findOne({
        where: {
          financing_application_id: financing.financing_id,
          category_code: "TRANSACTION_INSTALLMENT",
          amount: nominal,
          description: keterangan,
        },
        transaction,
      });

      if (duplicate) {
        errorData.push({
          row: i + 2,
          reason: "Setoran cicilan dengan data yang sama sudah ada (duplikat)",
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
        }, { transaction });

        // Tandai kontrak selesai HANYA jika akumulasi cicilan yang sudah dibayar
        // benar-benar menutup total tagihan (total_tagihan / fallback).
        if (statusInput === "PAID") {
          const totalTagihan = parseFloat(financing.total_tagihan || 0);
          const fallbackTotal = Math.max(
            0,
            parseFloat(financing.item_price || financing.amount_requested || 0) +
              parseFloat(financing.operational_cost || 0) +
              parseFloat(financing.margin_amount || 0) -
              parseFloat(financing.down_payment || 0) -
              parseFloat(financing.discount || 0)
          );
          const tenorTotal =
            parseFloat(financing.monthly_installment || 0) *
            parseInt(financing.cooperation_months || 0, 10);
          const expectedTotal =
            totalTagihan > 0
              ? totalTagihan
              : fallbackTotal > 0
                ? fallbackTotal
                : tenorTotal;

          if (expectedTotal > 0) {
            const totalPaidItems = await BillItem.sum("amount", {
              where: {
                financing_application_id: financing.financing_id,
                category_code: "TRANSACTION_INSTALLMENT",
                status: "PAID",
              },
              transaction,
            });

            if (
              parseFloat(totalPaidItems || 0) >= expectedTotal &&
              ["APPROVED", "ACTIVE"].includes(financing.status)
            ) {
              await financing.update({ status: "COMPLETED" }, { transaction });
            }
          }
        }

        successData.push(newBillItem);
      } catch (err) {
        errorData.push({ row: i + 2, reason: err.message });
      }
    }

    await transaction.commit();
    transaction = null;

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
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error("Import Cicilan Jual Beli Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat import cicilan",
    });
  }
};
