import db from "./models/index.js";

async function syncDb() {
  try {
    await db.FeatureConfig.sync({ alter: true });
    console.log("FeatureConfig table synced successfully.");

    // Seed data if empty
    const count = await db.FeatureConfig.count();
    if (count === 0) {
      const staticFeatures = [
        { id: 'jualBeli', menu: "Juali Beli", submenu: "Jual Beli" },
        { id: 'tabungan', menu: "Tabungan", submenu: "Tabungan Umum" },
        { id: 'pinjaman_reg', menu: "Pinjaman", submenu: "Pinjaman Reguler" },
        { id: 'pinjaman_brg', menu: "Pinjaman", submenu: "Pinjaman Barang" },
        { id: 'arisan', menu: "Arisan", submenu: "Daftar Arisan" },
        { id: 'investasi', menu: "Investasi", submenu: "Investasi" },
        { id: 'pendanaan', menu: "Pendanaan", submenu: "Pendanaan" },
        { id: 'billing', menu: "Billing", submenu: "Pembayaran Tagihan" },
      ];
      await db.FeatureConfig.bulkCreate(staticFeatures);
      console.log("Seeded static features.");
    }
  } catch (err) {
    console.error("Error syncing FeatureConfig:", err);
  } finally {
    process.exit();
  }
}

syncDb();
