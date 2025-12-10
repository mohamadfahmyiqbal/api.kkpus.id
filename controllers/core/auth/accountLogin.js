import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../../models/index.js"; 

// Hapus referensi ke MemberRegistration
const Member = db.Member;
const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

// PENTING: Ganti dengan secret key yang kuat dan ambil dari environment variable (process.env.JWT_SECRET)
const JWT_SECRET = "naila";

/**
 * Kontroler untuk menangani proses login anggota, langsung menggunakan tabel 'members'.
 */
export const accountLogin = async (req, res) => {
  const { emailHp, password } = req.body;
  
  // 1. Validasi Input Dasar
  if (!emailHp || !password) {
    return res.status(400).json({
      success: false,
      message: "Email/Nomor Handphone dan Password wajib diisi.",
    });
  }

  try {
    // 2. CARI AKUN di tabel 'members'
    // Mencari berdasarkan email ATAU phone_number
    const member = await Member.findOne({
      where: {
        [Op.or]: [{ email: emailHp }, { phone_number: emailHp }],
      },
      // Mengambil semua atribut yang diperlukan, termasuk 'password_hash' untuk otentikasi.
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
        "password_hash", // WAJIB: Digunakan untuk membandingkan password
      ],
    });

    // 3. Cek Keberadaan Member
    if (!member) {
      return res.status(401).json({
        success: false,
        message: "Kredensial tidak valid. Email/Nomor HP atau Password salah.",
      });
    }

    // 4. Bandingkan Password menggunakan bcrypt
    const isMatch = await bcrypt.compare(
      password,
      member.password_hash // Menggunakan hash dari record Member
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Kredensial tidak valid. Email/Nomor HP atau Password salah.",
      });
    }

    // 5. Generate JWT Token
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

    // 6. Respon Sukses
    // Mengembalikan atribut user, kecuali password_hash (Sequelize secara otomatis tidak menyertakannya jika tidak diminta secara spesifik, 
    // namun kita telah meminta di atas. Pastikan Anda menghapus atribut password_hash di response, atau atur default scope pada model)
    
    // Hapus password_hash dari objek member sebelum dikirim ke frontend
    const userResponse = member.toJSON();
    delete userResponse.password_hash;
    
    return res.status(200).json({
      success: true,
      message: "Login berhasil!",
      data: {
        token: token,
        user: userResponse, // Mengembalikan data member
      },
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Login gagal. Terjadi kesalahan server internal.",
      error: error.message,
    });
  }
};