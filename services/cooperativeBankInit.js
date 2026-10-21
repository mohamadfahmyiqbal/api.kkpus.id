/**
 * Inisialisasi tabel dan mock data rekening koperasi untuk pembayaran manual
 */
export const initCooperativeBanks = async (db) => {
  try {
    // 1. Sync tabel cooperative_bank_accounts jika belum ada
    if (db.CooperativeBankAccount) {
      await db.CooperativeBankAccount.sync({ alter: false });

      // 2. Tambahkan kolom pendukung di tabel transactions jika belum ada
      try {
        const [columns] = await db.sequelize.query("SHOW COLUMNS FROM `transactions`");
        const columnNames = columns.map((col) => col.Field);

        if (!columnNames.includes("proof_of_transfer")) {
          await db.sequelize.query("ALTER TABLE `transactions` ADD COLUMN `proof_of_transfer` TEXT NULL;");
          console.log("✅ Column proof_of_transfer added to transactions");
        }
        if (!columnNames.includes("sender_name")) {
          await db.sequelize.query("ALTER TABLE `transactions` ADD COLUMN `sender_name` VARCHAR(100) NULL;");
          console.log("✅ Column sender_name added to transactions");
        }
        if (!columnNames.includes("sender_bank")) {
          await db.sequelize.query("ALTER TABLE `transactions` ADD COLUMN `sender_bank` VARCHAR(50) NULL;");
          console.log("✅ Column sender_bank added to transactions");
        }
        if (!columnNames.includes("sender_account_no")) {
          await db.sequelize.query("ALTER TABLE `transactions` ADD COLUMN `sender_account_no` VARCHAR(50) NULL;");
          console.log("✅ Column sender_account_no added to transactions");
        }
        if (!columnNames.includes("admin_note")) {
          await db.sequelize.query("ALTER TABLE `transactions` ADD COLUMN `admin_note` TEXT NULL;");
          console.log("✅ Column admin_note added to transactions");
        }
        if (!columnNames.includes("verified_by")) {
          await db.sequelize.query("ALTER TABLE `transactions` ADD COLUMN `verified_by` CHAR(36) NULL;");
          console.log("✅ Column verified_by added to transactions");
        }
        if (!columnNames.includes("verified_at")) {
          await db.sequelize.query("ALTER TABLE `transactions` ADD COLUMN `verified_at` DATETIME NULL;");
          console.log("✅ Column verified_at added to transactions");
        }

        // Modifikasi ENUM status untuk menyertakan PENDING_VERIFICATION dan REJECTED
        await db.sequelize.query(
          "ALTER TABLE `transactions` MODIFY COLUMN `status` ENUM('PENDING','PENDING_VERIFICATION','PAID','EXPIRED','CANCELED','FAILED','REJECTED') DEFAULT 'PENDING';"
        );
        console.log("✅ Status ENUM updated on transactions");
      } catch (colErr) {
        console.error("⚠️ Gagal mengecek/menambahkan kolom di tabel transactions:", colErr.message);
      }

      // 2. Cek apakah sudah ada data rekening koperasi
      const count = await db.CooperativeBankAccount.count();
      if (count === 0) {
        console.log("🌱 Seeding mock data rekening bank koperasi...");
        await db.CooperativeBankAccount.bulkCreate([
          {
            bank_code: "BCA",
            bank_name: "Bank Central Asia (BCA)",
            account_number: "8830192831",
            account_holder: "KOPERASI KKPUS MANDIRI",
            branch: "KCU Sudirman",
            instructions: "Transfer sesuai total tagihan. Simpan bukti transfer dalam format foto/screenshot.",
            is_active: true,
          },
          {
            bank_code: "MANDIRI",
            bank_name: "Bank Mandiri",
            account_number: "1370018291039",
            account_holder: "KOPERASI KKPUS MANDIRI",
            branch: "KC Thamrin",
            instructions: "Pastikan nama penerima adalah KOPERASI KKPUS MANDIRI sebelum konfirmasi.",
            is_active: true,
          },
          {
            bank_code: "BRI",
            bank_name: "Bank Rakyat Indonesia (BRI)",
            account_number: "034101002948501",
            account_holder: "KOPERASI KKPUS MANDIRI",
            branch: "KCK Jakarta",
            instructions: "Gunakan menu Transfer Antar Rekening BRI atau ATM Bersama.",
            is_active: true,
          },
          {
            bank_code: "BSI",
            bank_name: "Bank Syariah Indonesia (BSI)",
            account_number: "7128391024",
            account_holder: "KOPERASI KKPUS MANDIRI",
            branch: "KC Hasanuddin",
            instructions: "Transfer via BSI Mobile atau ATM dengan kode bank 451.",
            is_active: true,
          },
        ]);
        console.log("✅ Mock data rekening koperasi berhasil ditambahkan.");
      }
    }
  } catch (err) {
    console.error("⚠️ Inisialisasi rekening koperasi error:", err.message);
  }
};
