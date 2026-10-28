import xlsx from "xlsx";
import db from "../../models/index.js";

const { Member, SavingTarget, MemberSavingTarget, BillItem, BillType } = db;

export const importTransaksiTabungan = async (req, res) => {
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

    // Ambil atau buat BillType untuk TABUNGAN_DEPOSIT
    let [tabunganBillType] = await BillType.findOrCreate({
      where: { type_code: "TABUNGAN_DEPOSIT" },
      defaults: {
        tx_type: "SETORAN",
        category_map: "SAVINGS_TARGET",
        type_name: "Setoran Tabungan",
        period_type: "MONTHLY",
        default_amount: 0,
      },
    });

    const defaultBillTypeId = tabunganBillType.bill_type_id;
    const successData = [];
    const errorData = [];

    // Header: No. Anggota, Nama Program, Nominal, Tanggal Transaksi, Keterangan, Status
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const memberNo = row["No. Anggota"];
      const namaProgram = row["Nama Program"];
      const rawNominal = row["Nominal"] || row["Nominal Setoran"] || row["Nominal (Rp)"];
      
      let parsedNominal = rawNominal;
      if (typeof rawNominal === "string") {
        parsedNominal = rawNominal.replace(/\./g, "").replace(",", ".");
      }
      const nominal = parseFloat(parsedNominal) || 0;

      // Tangani tanggal (bisa Excel serial date atau format tanggal string)
      let tanggal = row["Tanggal Transaksi"] || row["Tanggal"];
      let txDate = new Date();
      if (typeof tanggal === "number") {
        txDate = new Date((tanggal - (25567 + 2)) * 86400 * 1000);
      } else if (tanggal) {
        const parsed = new Date(tanggal);
        if (!isNaN(parsed.getTime())) {
          txDate = parsed;
        }
      }

      let statusInput = (row["Status"] || "PAID").toString().trim().toUpperCase();
      if (!["PAID", "UNPAID"].includes(statusInput)) {
        statusInput = "PAID";
      }

      const keterangan =
        row["Keterangan"] ||
        row["Keterangan / Catatan"] ||
        `Setoran Tabungan ${namaProgram || ""}`.trim();

      // Lewati baris kosong
      if (!memberNo && !namaProgram && nominal <= 0) {
        continue;
      }

      if (!memberNo || nominal <= 0) {
        errorData.push({
          row: i + 2,
          reason: "Kolom No. Anggota atau Nominal tidak valid/kosong",
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

      // Cari MemberSavingTarget milik anggota
      const targetWhere = {
        member_id: existingMember.member_id,
      };

      let memberTarget = null;
      if (namaProgram && namaProgram.trim() !== "") {
        // Cari program yang cocok dengan nama
        const program = await SavingTarget.findOne({
          where: { target_name: namaProgram.trim() },
        });

        if (program) {
          memberTarget = await MemberSavingTarget.findOne({
            where: {
              ...targetWhere,
              saving_target_id: program.saving_target_id,
            },
            order: [["created_at", "DESC"]],
          });
        }
      }

      // Jika belum ditemukan dan namaProgram tidak spesifik, ambil tabungan aktif anggota
      if (!memberTarget) {
        memberTarget = await MemberSavingTarget.findOne({
          where: targetWhere,
          order: [["created_at", "DESC"]],
        });
      }

      if (!memberTarget) {
        errorData.push({
          row: i + 2,
          reason: `Akun Tabungan ${namaProgram ? `("${namaProgram}") ` : ""}untuk anggota No. ${memberNo} tidak ditemukan. Silakan daftarkan/import master tabungan anggota terlebih dahulu.`,
        });
        continue;
      }

      try {
        const categoryCode = `TAB_DEP_${memberTarget.member_saving_target_id}`;

        const newBillItem = await BillItem.create({
          bill_type_id: defaultBillTypeId,
          category_code: categoryCode,
          bill_id: null,
          member_id: existingMember.member_id,
          description: keterangan,
          amount: nominal,
          due_date: txDate,
          status: statusInput,
          created_at: txDate,
          updated_at: txDate,
        });

        // Jika status PAID, tambahkan saldo pada MemberSavingTarget
        if (statusInput === "PAID") {
          await memberTarget.increment("current_balance", { by: nominal });
        }

        successData.push(newBillItem);
      } catch (err) {
        errorData.push({ row: i + 2, reason: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Proses import transaksi tabungan selesai",
      data: {
        totalImported: successData.length,
        totalFailed: errorData.length,
        errors: errorData,
      },
    });
  } catch (error) {
    console.error("Import Transaksi Tabungan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat import transaksi tabungan",
      error: error.message,
    });
  }
};
