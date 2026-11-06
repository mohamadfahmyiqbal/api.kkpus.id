import xlsx from "xlsx";
import db from "../../models/index.js";
import { syncSavingsReportList } from "../../services/savingsReportSyncService.js";
import { syncFinancialSummary } from "../../services/financialSummarySyncService.js";
const Member = db.Member;
const Savings = db.Savings;
const Account = db.Account;

export const importSimpanan = async (req, res) => {
  let transaction;
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

    // Pre-cache SavingsProducts to avoid N+1 queries inside loop
    const productMap = new Map();
    if (db.SavingsProduct) {
      const allProducts = await db.SavingsProduct.findAll();
      allProducts.forEach((p) => productMap.set(p.product_code, p));
    }

    transaction = await db.sequelize.transaction();

    const successData = [];
    const errorData = [];

    // Format Excel: No. Anggota, Jenis Simpanan, Nominal, Tanggal Transaksi, Keterangan
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const memberNo = row["No. Anggota"];
      const jenisSimpanan = row["Jenis Simpanan"] ? String(row["Jenis Simpanan"]).toUpperCase() : "";
      const nominal = row["Nominal"];
      
      // Tangani tanggal dari Excel (bisa berupa serial number atau string)
      let tanggal = row["Tanggal Transaksi"];
      let txDate;
      if (typeof tanggal === 'number') {
        // Excel serial date to JS Date
        txDate = new Date((tanggal - (25567 + 2)) * 86400 * 1000);
      } else {
        txDate = new Date(tanggal);
      }
      
      const keterangan = row["Keterangan"];

      // Sanitasi nominal (dukung format koma Indonesia: '0,1' -> 0.1)
      let parsedNominal = nominal;
      if (typeof nominal === 'string') {
        parsedNominal = nominal.replace(/\./g, '').replace(',', '.');
      }
      const numAmount = parseFloat(parsedNominal);

      // Jika nominal kosong atau 0/negatif, lewati baris ini (tidak diimpor)
      if (nominal === undefined || nominal === null || nominal === "" || isNaN(numAmount) || numAmount <= 0) {
        continue;
      }

      if (!memberNo || !jenisSimpanan || !tanggal) {
        errorData.push({ row: i + 2, reason: "Kolom wajib (No. Anggota, Jenis Simpanan, Nominal, Tanggal) tidak boleh kosong" });
        continue;
      }

      // Validasi jenis simpanan
      const validJenis = ["SUKARELA", "WAJIB", "BERJANGKA", "POKOK"];
      if (!validJenis.includes(jenisSimpanan)) {
        errorData.push({ row: i + 2, reason: `Jenis Simpanan '${jenisSimpanan}' tidak valid (pilih: SUKARELA, WAJIB, BERJANGKA, POKOK)` });
        continue;
      }

      // Validasi nominal
      if (isNaN(numAmount)) {
        errorData.push({ row: i + 2, reason: "Nominal harus berupa angka" });
        continue;
      }

      // Validasi tanggal
      if (isNaN(txDate.getTime())) {
        errorData.push({ row: i + 2, reason: "Format Tanggal Transaksi tidak valid" });
        continue;
      }

      // Cari anggota berdasarkan No. Anggota
      const existingMember = await Member.findOne({
        where: { member_no: String(memberNo) },
        transaction,
      });

      if (!existingMember) {
        errorData.push({ row: i + 2, reason: `Anggota dengan No. ${memberNo} tidak ditemukan` });
        continue;
      }

      try {
        const newSaving = await Savings.create({
          member_id: existingMember.member_id,
          savings_type: jenisSimpanan,
          amount: numAmount,
          description: keterangan || "Import Data Simpanan",
          transaction_date: txDate.toISOString().split('T')[0],
          status: "COMPLETED", // Langsung sukses karena data historis/import
        }, { transaction });
        successData.push(newSaving);

        // Update/create MemberSavingsAccount agar data langsung sinkron
        if (db.MemberSavingsAccount) {
          const productCode = jenisSimpanan === 'POKOK' ? 'SW_POKOK' : (jenisSimpanan === 'WAJIB' ? 'SW_WAJIB' : 'SS_SUKARELA');
          const product = productMap.get(productCode);
          if (product) {
            const memberCode = existingMember.member_no || existingMember.member_id.substring(0, 8);
            const accountNo = `SAV-${product.product_code}-${memberCode}`;
            const [savAcc, created] = await db.MemberSavingsAccount.findOrCreate({
              where: {
                member_id: existingMember.member_id,
                savings_product_id: product.savings_product_id,
              },
              defaults: {
                account_no: accountNo,
                account_type: product.name,
                open_date: txDate,
                current_balance: numAmount,
              },
              transaction,
            });
            if (!created) {
              await savAcc.increment("current_balance", { by: numAmount, transaction });
            }
          }
        }
      } catch (err) {
        errorData.push({ row: i + 2, reason: err.message });
      }
    }

    await transaction.commit();

    // Sync: Account ledger (SW_POKOK / SW_WAJIB / SS_SUKARELA / SAVINGS)
    const updatedAccounts = [];
    const processedMemberIds = new Set();

    for (const s of successData) {
      if (!s.member_id) continue;
      processedMemberIds.add(s.member_id);
      const billTypeCode = s.savings_type === "POKOK" ? "SW_POKOK" : s.savings_type === "WAJIB" ? "SW_WAJIB" : "SS_SUKARELA";

      try {
        if (Account) {
          const typeAcc = await Account.findOrCreate({
            where: { member_id: s.member_id, account_type: billTypeCode },
            defaults: { account_no: `ACC-${billTypeCode}-${s.member_id.toString().substring(0, 8)}`, current_balance: 0 },
          });
          if (typeAcc && typeAcc[0]) {
            await typeAcc[0].increment("current_balance", { by: parseFloat(s.amount) });
            updatedAccounts.push({ type: billTypeCode, member_id: s.member_id });
          }

          const mainAcc = await Account.findOrCreate({
            where: { member_id: s.member_id, account_type: "SAVINGS" },
            defaults: { account_no: `ACC-TOTAL-${s.member_id.toString().substring(0, 8)}`, current_balance: 0 },
          });
          if (mainAcc && mainAcc[0]) {
            await mainAcc[0].increment("current_balance", { by: parseFloat(s.amount) });
            updatedAccounts.push({ type: "SAVINGS", member_id: s.member_id });
          }
        }
      } catch (err) {
        console.error(`[Import] Ledger update failed for ${s.savings_id}:`, err.message);
      }
    }

    // Sync: Savings report list for all members (admin dashboard annual report)
    try {
      await syncSavingsReportList(db.sequelize);
    } catch (err) {
      console.error("[Import] syncSavingsReportList failed:", err.message);
    }

    // Sync: Financial summary for each imported member (member profile dashboard)
    for (const mId of processedMemberIds) {
      try {
        await syncFinancialSummary(db.sequelize, mId);
      } catch (err) {
        console.error(`[Import] syncFinancialSummary failed for member ${mId}:`, err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Proses import simpanan selesai",
      data: {
        totalImported: successData.length,
        totalFailed: errorData.length,
        errors: errorData,
        ledgerUpdated: updatedAccounts.length,
        membersSyncCount: successData.length,
      }
    });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Import Simpanan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat import simpanan",
      error: error.message
    });
  }
};
