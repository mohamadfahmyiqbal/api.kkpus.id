import bcrypt from "bcrypt";
import db from "../../../models/index.js";

// Menggunakan model Member saja
const Member = db.Member;

/**
 * Fungsi pembantu untuk membuat Member No. dalam format 00DDMMYYHHmm
 * @returns {string} Member Number yang unik
 */
const generateMemberNo = () => {
  const now = new Date();
  const pad = (num) => String(num).padStart(2, "0");

  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = pad(now.getFullYear() % 100);
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());

  return `00${day}${month}${year}${hour}${minute}`;
};

export const registerAccount = async (req, res) => {
  // KOREKSI: Mengambil 'full_name' dari req.body, bukan 'name'
  const { full_name, email, password, phone_number, nik_ktp, gender, address } =
    req.body;

  // Memberikan nilai default untuk kolom yang opsional/null
  const final_nik_ktp = nik_ktp || null;
  const final_gender = gender || null;
  const final_address = address || null;

  let transaction;

  try {
    // --- 0. Validasi Input Wajib ---
    if (!full_name || full_name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Nama lengkap wajib diisi.",
      });
    }
    if (!email || email.trim() === "" || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan Password wajib diisi.",
      });
    }

    // 1. Cek duplikasi email di tabel UTAMA: 'members'
    const existingMember = await Member.findOne({
      where: { email: email },
    });

    if (existingMember) {
      return res.status(409).json({
        success: false,
        message:
          "Email sudah terdaftar. Silakan login atau gunakan email lain.",
      });
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Generate Member Number
    const memberNo = generateMemberNo();

    // =========================================================
    // 4. MEMULAI TRANSAKSI: Hanya Insert ke tabel members
    // =========================================================
    transaction = await db.sequelize.transaction();

    // 4a. Buat Record di Tabel UTAMA: 'members'
    const newMember = await Member.create(
      {
        // Kolom Wajib/Input
        full_name: full_name,
        email: email,
        password_hash: password_hash, // Menyimpan hash password di sini
        phone_number: phone_number,

        // Kolom Opsional/Default
        member_no: memberNo,
        join_date: new Date(),
        member_type: "Calon Anggota",
        status_id: 1, // ASUMSI: ID 1 = Status Aktif
        nik_ktp: final_nik_ktp,
        gender: final_gender,
        address: final_address,
      },
      { transaction }
    );

    // Ambil Primary Key
    const memberId = newMember.member_id;

    // 4b. Insert ke MemberRegistration Dihilangkan

    // 5. Commit Transaksi
    await transaction.commit();

    // 6. Respon sukses
    return res.status(201).json({
      success: true,
      message: "Pendaftaran Member berhasil!",
      data: {
        registration_email: email,
        member_id_numeric: memberId,
        member_no: memberNo,
        member_type: "calon",
      },
    });
  } catch (error) {
    // 7. Rollback Transaksi
    if (transaction) {
      await transaction.rollback();
    }

    console.error("Error during account registration:", error);

    return res.status(500).json({
      success: false,
      message:
        "Terjadi kesalahan server saat mendaftar. Silakan cek log server.",
    });
  }
};
