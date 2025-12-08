import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../../models/index.js"; // Sesuaikan path ke model Sequelize Anda

const MemberRegistration = db.MemberRegistration;
const Member = db.Member;
const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

// PENTING: Ganti dengan secret key yang kuat dan ambil dari environment variable (process.env.JWT_SECRET)
const JWT_SECRET = "naila";

/**
 * Kontroler untuk menangani proses login anggota.
 */
export const accountLogin = async (req, res) => {
  // Input dari frontend (LoginPage.jsx)
  const { emailHp, password } = req.body;
  // 1. Validasi Input Dasar
  if (!emailHp || !password) {
    return res.status(400).json({
      success: false,
      message: "Email/Nomor Handphone dan Password wajib diisi.",
    });
  }

  try {
    // 2. Cari Akun Pendaftaran (di member_registrations)
    const registrationRecord = await MemberRegistration.findOne({
      where: {
        [Op.or]: [{ email: emailHp }, { phone_number: emailHp }],
      },
    });

    // 3. Cek Keberadaan Record Pendaftaran
    if (!registrationRecord) {
      return res.status(401).json({
        success: false,
        message: "Kredensial tidak valid. Email/Nomor HP atau Password salah.",
      });
    }

    // 4. Bandingkan Password menggunakan bcrypt
    const isMatch = await bcrypt.compare(
      password,
      registrationRecord.password_hash
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Kredensial tidak valid. Email/Nomor HP atau Password salah.",
      });
    }

    // 5. Ambil Data Anggota Utama (dari tabel members)
    // PERBAIKAN: Hanya masukkan kolom yang ada di model members.js dan database.
    // Kolom yang menyebabkan error (address_details, religion, dll.) telah dihapus.
    const member = await Member.findByPk(registrationRecord.member_id, {
      attributes: [
        "member_id",
        "full_name",
        "email",
        "phone_number",
        "gender",
        "join_date",
        "member_no",
        "member_type",
        "nik_ktp",
        "address",
        "status_id",
        // Kolom-kolom yang tidak ada di model members.js (address_details, religion, dll.)
        // DENGAN SENGAJA TIDAK DIMASUKKAN di sini untuk MENGHILANGKAN ERROR.
      ],
    });

    if (!member) {
      return res.status(401).json({
        success: false,
        message:
          "Data Anggota tidak ditemukan di database utama. Hubungi admin.",
      });
    }

    // 6. Generate JWT Token
    const tokenPayload = {
      member_id: member.member_id,
      member_no: member.member_no,
      full_name: member.full_name,
      email: member.email,
      status_id: member.status_id,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "1d",
    });

    // 7. Respon Sukses
    return res.status(200).json({
      success: true,
      message: "Login berhasil!",
      data: {
        token: token,
        user: member, // Mengembalikan semua atribut yang telah difilter
      },
    });
  } catch (error) {
    console.error("Login API Error:", error);
    // Pastikan Anda mengembalikan status 500 dan pesan yang ramah pengguna
    return res.status(500).json({
      success: false,
      message: "Login gagal. Terjadi kesalahan server internal.",
      // Opsional: Hapus baris 'error: error.message' di produksi
      error: error.message,
    });
  }
};
