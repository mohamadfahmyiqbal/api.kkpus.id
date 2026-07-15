import db from "./models/index.js";

async function seed() {
  try {
    await db.sequelize.authenticate();
    console.log("Database connected.");
    
    // Check if entry exists
    const existing = await db.LandingAbout.findOne();
    if (existing) {
      console.log("Entry exists, updating...");
      await existing.update({
        title: "Membangun Ekonomi Umat",
        description: "Paguyuban Usaha Sukses hadir sebagai wadah koperasi modern yang berfokus pada pemberdayaan ekonomi umat.",
        vision: "Menjadi koperasi syariah terpercaya dalam membangun kemandirian ekonomi umat.",
        mission: "Memberikan layanan pembiayaan syariah yang adil dan memberdayakan usaha anggota."
      });
      console.log("Updated.");
    } else {
      console.log("No entry found, creating...");
      await db.LandingAbout.create({
        title: "Membangun Ekonomi Umat",
        description: "Paguyuban Usaha Sukses hadir sebagai wadah koperasi modern yang berfokus pada pemberdayaan ekonomi umat.",
        vision: "Menjadi koperasi syariah terpercaya dalam membangun kemandirian ekonomi umat.",
        mission: "Memberikan layanan pembiayaan syariah yang adil dan memberdayakan usaha anggota."
      });
      console.log("Created.");
    }
  } catch (error) {
    console.error("Error seeding:", error);
  } finally {
    process.exit();
  }
}

seed();
