import dotenv from "dotenv";
dotenv.config();
import db from "./models/index.js";

const data = [
  { tenor: 1, anggota: 3, reguler: 8 },
  { tenor: 2, anggota: 5, reguler: 10 },
  { tenor: 3, anggota: 7, reguler: 12 },
  { tenor: 4, anggota: 9, reguler: 14 },
  { tenor: 5, anggota: 11, reguler: 16 },
  { tenor: 6, anggota: 13, reguler: 18 },
  { tenor: 7, anggota: 15, reguler: 20 },
  { tenor: 8, anggota: 17, reguler: 21 },
  { tenor: 9, anggota: 19, reguler: 22 },
  { tenor: 10, anggota: 21, reguler: 24 },
  { tenor: 11, anggota: 23, reguler: 26 },
  { tenor: 12, anggota: 25, reguler: 28 },
  { tenor: 13, anggota: 26, reguler: 29 },
  { tenor: 14, anggota: 27, reguler: 30 },
  { tenor: 15, anggota: 28, reguler: 31 },
  { tenor: 16, anggota: 29, reguler: 32 },
  { tenor: 17, anggota: 30, reguler: 33 },
  { tenor: 18, anggota: 31, reguler: 34 },
  { tenor: 19, anggota: 32, reguler: 35 },
  { tenor: 20, anggota: 33, reguler: 36 },
  { tenor: 21, anggota: 34, reguler: 37 },
  { tenor: 22, anggota: 35, reguler: 38 },
  { tenor: 23, anggota: 36, reguler: 39 },
  { tenor: 24, anggota: 37, reguler: 40 },
  { tenor: 25, anggota: 37.5, reguler: 40.5 },
  { tenor: 26, anggota: 38, reguler: 41 },
  { tenor: 27, anggota: 38.5, reguler: 41.5 },
  { tenor: 28, anggota: 39, reguler: 42 },
  { tenor: 29, anggota: 39.5, reguler: 42.5 },
  { tenor: 30, anggota: 40, reguler: 43 },
  { tenor: 31, anggota: 40.5, reguler: 43.5 },
  { tenor: 32, anggota: 41, reguler: 44 },
  { tenor: 33, anggota: 41.5, reguler: 44.5 },
  { tenor: 34, anggota: 42, reguler: 45 },
  { tenor: 35, anggota: 42.5, reguler: 45.5 },
  { tenor: 36, anggota: 43, reguler: 46 },
  { tenor: 37, anggota: 43.5, reguler: 46.5 },
  { tenor: 38, anggota: 44, reguler: 47 },
  { tenor: 39, anggota: 44.5, reguler: 47.5 },
  { tenor: 40, anggota: 45, reguler: 48 },
  { tenor: 41, anggota: 45.5, reguler: 48.5 },
  { tenor: 42, anggota: 46, reguler: 49 },
  { tenor: 43, anggota: 46.5, reguler: 49.5 },
  { tenor: 44, anggota: 47, reguler: 50 },
  { tenor: 45, anggota: 47.5, reguler: 50.5 },
  { tenor: 46, anggota: 48, reguler: 51 },
  { tenor: 47, anggota: 48.5, reguler: 51.5 },
  { tenor: 48, anggota: 49, reguler: 52 },
  { tenor: 49, anggota: 49.5, reguler: 52.5 },
  { tenor: 50, anggota: 50, reguler: 53 },
  { tenor: 51, anggota: 50.5, reguler: 53.5 },
  { tenor: 52, anggota: 51, reguler: 54 },
  { tenor: 53, anggota: 51.5, reguler: 54.5 },
  { tenor: 54, anggota: 52, reguler: 55 },
  { tenor: 55, anggota: 52.5, reguler: 55.5 },
  { tenor: 56, anggota: 53, reguler: 56 },
  { tenor: 57, anggota: 53.5, reguler: 56.5 },
  { tenor: 58, anggota: 54, reguler: 57 },
  { tenor: 59, anggota: 54.5, reguler: 57.5 },
  { tenor: 60, anggota: 55, reguler: 58 },
];

async function seed() {
  try {
    // Karena kita menambahkan kolom baru, pastikan tabelnya disinkronkan dulu
    // alter: true akan menambahkan kolom persentase_anggota dan persentase_reguler yang baru kita tambahkan di model
    await db.FinancingTerm.sync({ alter: true });
    console.log("Database schema updated with alter: true");

    // Kosongkan tabel
    await db.FinancingTerm.destroy({ where: {}, truncate: true });
    console.log("Table truncated");

    // Masukkan data baru
    const records = data.map((item) => ({
      label: `${item.tenor}x Pembayaran`,
      value_months: item.tenor,
      is_active: true,
      persentase_anggota: item.anggota,
      persentase_reguler: item.reguler,
    }));

    await db.FinancingTerm.bulkCreate(records);
    console.log("Successfully seeded", records.length, "financing terms");
    
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed:", err);
    process.exit(1);
  }
}

seed();
