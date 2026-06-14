import db from "./models/index.js";

const seedMaterialsAndQuizzes = async () => {
  try {
    // 1. Ambil Kurikulum
    const curriculums = await db.Curriculum.findAll();
    if (curriculums.length === 0) {
      console.log("Jalankan seed-training.js terlebih dahulu!");
      process.exit(1);
    }

    const pengenalanId = curriculums.find(c => c.curriculum_name === "Pengenalan Koperasi")?.curriculum_id;

    if (!pengenalanId) {
      console.log("Kurikulum 'Pengenalan Koperasi' tidak ditemukan.");
      process.exit(1);
    }

    // 2. Tambah Material dengan Quiz
    const materials = [
      {
        curriculum_id: pengenalanId,
        material_title: "Sejarah Koperasi di Indonesia",
        material_type: "DOCUMENT",
        description: `
          <h4>Awal Mula Koperasi</h4>
          <p>Koperasi di Indonesia pertama kali diperkenalkan oleh R. Aria Wiraatmadja pada tahun 1896 di Purwokerto. Beliau mendirikan sebuah Bank untuk Para Pegawai Negeri (Hulp-en Spaarbank). Beliau terdorong oleh penderitaan rakyat akibat lilitan hutang dari lintah darat.</p>
          <h4>Perkembangan Masa Kolonial</h4>
          <p>Pada tahun 1908, gerakan Budi Utomo memberikan dukungan bagi berdirinya koperasi. Kemudian pada tahun 1915 diterbitkan peraturan perundangan koperasi pertama oleh pemerintah kolonial Belanda, yaitu Verordening op de Cooperative Vereenigingen.</p>
          <h4>Koperasi di Era Kemerdekaan</h4>
          <p>Setelah kemerdekaan, peran koperasi ditegaskan dalam Pasal 33 UUD 1945. Drs. Mohammad Hatta, yang kemudian dikenal sebagai Bapak Koperasi Indonesia, memberikan perhatian yang sangat besar bagi pemberdayaan ekonomi rakyat melalui koperasi.</p>
        `,
        order_index: 1,
        is_unlocked: true,
        quiz_questions: [
          {
            id: 1,
            question: "Siapa tokoh yang memperkenalkan koperasi pertama kali di Indonesia pada tahun 1896?",
            options: [
              "Drs. Mohammad Hatta",
              "R. Aria Wiraatmadja",
              "Raden Saleh",
              "Ki Hajar Dewantara"
            ],
            correctAnswer: 1
          },
          {
            id: 2,
            question: "Di kota manakah bank koperasi pertama didirikan di Indonesia?",
            options: [
              "Jakarta",
              "Bandung",
              "Purwokerto",
              "Yogyakarta"
            ],
            correctAnswer: 2
          },
          {
            id: 3,
            question: "Pasal berapakah dalam UUD 1945 yang menegaskan peran koperasi?",
            options: [
              "Pasal 27",
              "Pasal 30",
              "Pasal 33",
              "Pasal 34"
            ],
            correctAnswer: 2
          }
        ]
      },
      {
        curriculum_id: pengenalanId,
        material_title: "Prinsip Dasar Koperasi",
        material_type: "DOCUMENT",
        description: `
          <h4>Prinsip Dasar Koperasi</h4>
          <ul>
            <li>Keanggotaan bersifat sukarela dan terbuka.</li>
            <li>Pengelolaan dilakukan secara demokratis.</li>
            <li>Pembagian Sisa Hasil Usaha (SHU) dilakukan secara adil sebanding dengan besarnya jasa usaha masing-masing anggota.</li>
            <li>Pemberian balas jasa yang terbatas terhadap modal.</li>
            <li>Kemandirian.</li>
          </ul>
          <p>Prinsip-prinsip ini menjadi landasan operasional bagi setiap koperasi di Indonesia untuk memastikan kesejahteraan bersama.</p>
        `,
        order_index: 2,
        is_unlocked: true,
        quiz_questions: [
          {
            id: 1,
            question: "Salah satu prinsip koperasi adalah pembagian SHU yang dilakukan secara?",
            options: [
              "Sama rata",
              "Berdasarkan jabatan",
              "Adil sebanding dengan jasa usaha",
              "Berdasarkan undian"
            ],
            correctAnswer: 2
          },
          {
            id: 2,
            question: "Pengelolaan koperasi harus dilakukan secara?",
            options: [
              "Otoriter",
              "Demokratis",
              "Tertutup",
              "Individual"
            ],
            correctAnswer: 1
          }
        ]
      }
    ];

    for (const m of materials) {
      const [material, created] = await db.Material.findOrCreate({
        where: { material_title: m.material_title, curriculum_id: m.curriculum_id },
        defaults: m
      });
      if (!created) {
        await material.update(m);
      }
    }

    console.log("Materials and Quizzes seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding materials:", error);
    process.exit(1);
  }
};

seedMaterialsAndQuizzes();
