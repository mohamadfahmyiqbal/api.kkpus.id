import db from "./models/index.js";

const seedCurriculums = async () => {
  try {
    await db.Curriculum.bulkCreate([
      {
        curriculum_name: "Pengenalan Koperasi",
        curriculum_type: "WAJIB",
        description: "Dasar-dasar pemahaman tentang koperasi",
        is_active: true
      },
      {
        curriculum_name: "Manajemen Keuangan Koperasi",
        curriculum_type: "WAJIB",
        description: "Prinsip dan praktik manajemen keuangan",
        is_active: true
      },
      {
        curriculum_name: "Etika Bisnis Syariah",
        curriculum_type: "WAJIB",
        description: "Penerapan prinsip syariah dalam bisnis",
        is_active: true
      },
      {
        curriculum_name: "Leadership Koperasi",
        curriculum_type: "REGULER",
        description: "Pengembangan kepemimpinan untuk pengurus",
        is_active: true
      },
      {
        curriculum_name: "Digital Marketing Koperasi",
        curriculum_type: "REGULER",
        description: "Strategi pemasaran digital untuk koperasi",
        is_active: true
      }
    ]);
    console.log("Curriculums seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding curriculums:", error);
    process.exit(1);
  }
};

seedCurriculums();
