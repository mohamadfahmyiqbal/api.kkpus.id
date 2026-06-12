import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../../models/index.js";
import { sendGlobalNotification } from "../../../services/notificationHelper.js";

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "naila";

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/[^0-9+]/g, ""));
};

const validateNIK = (nik) => {
  const nikRegex = /^[0-9]{16}$/;
  return nikRegex.test(nik);
};

const validatePassword = (password) => {
  // Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const { Member, MemberRoleAssignment, UserRole, MemberEmployment, BusinessProfile, sequelize } = db;

/**
 * Generator Member No: Format 00DDMMYYHHmm + 3 Digit Acak
 */
const generateMemberNo = () => {
  const now = new Date();
  const pad = (num) => String(num).padStart(2, "0");

  const dateStr = `${pad(now.getDate())}${pad(now.getMonth() + 1)}${pad(now.getFullYear() % 100)}`;
  const timeStr = `${pad(now.getHours())}${pad(now.getMinutes())}`;
  const randomSuffix = Math.floor(100 + Math.random() * 900);

  return `00${dateStr}${timeStr}${randomSuffix}`;
};

export const registerAccount = async (req, res) => {
  const {
    full_name,
    email,
    password,
    phone_number,
    nik_ktp,
    gender,
    address,
    date_of_birth,
    province_id,
    city_id,
    district_id,
    subdistrict_id,
    nama_usaha,
    jenis_usaha,
    lama_usaha,
    omzet,
  } = req.body;

  let transaction;

  try {
    // --- 1. Validasi Input Dasar ---
    if (!full_name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama, Email, dan Password wajib diisi.",
      });
    }

    // --- 2. Validasi Format Data ---
    const emailLower = email.trim().toLowerCase();

    if (!validateEmail(emailLower)) {
      return res
        .status(400)
        .json({ success: false, message: "Format email tidak valid." });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka.",
      });
    }

    if (phone_number && phone_number !== "-" && !validatePhone(phone_number)) {
      return res
        .status(400)
        .json({ success: false, message: "Format nomor telepon tidak valid." });
    }

    if (nik_ktp && nik_ktp !== "-") {
      if (!validateNIK(nik_ktp)) {
        return res
          .status(400)
          .json({ success: false, message: "NIK KTP harus 16 digit angka." });
      }
    }

    // --- 3. Cek Duplikasi Email ---
    const existingMember = await Member.findOne({
      where: { email: emailLower },
    });
    if (existingMember) {
      return res
        .status(409)
        .json({ success: false, message: "Email sudah terdaftar." });
    }

    // --- 5. Cek Duplikasi NIK ---
    if (nik_ktp && nik_ktp !== "-") {
      const existingNIK = await Member.findOne({ where: { nik_ktp } });
      if (existingNIK) {
        return res
          .status(409)
          .json({ success: false, message: "NIK KTP sudah terdaftar." });
      }
    }

    // --- 6. Persiapan Data (Hash Password & Member No) ---
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const memberNo = generateMemberNo();

    // --- 7. Transaksi Database ---
    transaction = await sequelize.transaction();

    const newMember = await Member.create(
      {
        full_name: full_name.trim(),
        email: emailLower,
        password_hash,
        phone_number: phone_number || null,
        member_no: memberNo,
        join_date: new Date(),
        member_type: "Calon Anggota",
        status_id: 1,
        nik_ktp: nik_ktp,
        gender: gender || null,
        address: address || null,
        date_of_brith: date_of_birth || null,
        province_id: province_id || null,
        city_id: city_id || null,
        district_id: district_id || null,
        subdistrict_id: subdistrict_id || null,
        createdAt: new Date(), // Sesuai skema tabel members Anda
        updatedAt: new Date(),
      },
      { transaction },
    );

    // Simpan informasi usaha ke tabel terkait jika diisi
    if (nama_usaha || jenis_usaha || lama_usaha || omzet) {
      await Promise.all([
        MemberEmployment.create(
          {
            member_id: newMember.member_id,
            occupation: jenis_usaha || "Lainnya",
            employer_name: nama_usaha || "Usaha Mandiri",
            employer_address: address || null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          { transaction }
        ),
        BusinessProfile.create(
          {
            member_id: newMember.member_id,
            business_name: nama_usaha || "Usaha Mandiri",
            business_address: address || null,
            monthly_revenue: omzet ? parseFloat(omzet.toString().replace(/[^0-9.-]+/g, "")) : null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          { transaction }
        )
      ]);
    }

    await transaction.commit();

    // Generate JWT Token for new user
    const tokenPayload = {
      member_id: newMember.member_id,
      member_no: newMember.member_no,
      full_name: newMember.full_name,
      email: newMember.email,
      status_id: newMember.status_id,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "1d",
    });

    // Prepare user response data (exclude sensitive fields)
    const userResponse = newMember.toJSON();
    delete userResponse.password_hash;

    // =========================================================
    // 5. IMPLEMENTASI NOTIFIKASI BERANTAI (BACKGROUND)
    // =========================================================
    // Gunakan setImmediate agar tidak menghambat respon ke client
    setImmediate(async () => {
      try {
        // A. Notifikasi Selamat Datang ke User Baru
        const userNotif = sendGlobalNotification({
          memberId: newMember.member_id,
          title: "Selamat Datang!",
          content: `Halo ${full_name}, akun Anda berhasil dibuat. Silakan lengkapi formulir pendaftaran.`,
          type: "WELCOME_MESSAGE",
        });

        // B. Cari Role Pengawas dan Ketua
        const roles = await UserRole.findAll({
          where: { role_name: ["Pengawas", "Ketua"] },
        });

        let adminNotifs = [];
        if (roles.length > 0) {
          const administrators = await MemberRoleAssignment.findAll({
            where: { role_id: roles.map((r) => r.role_id) },
          });

          // Siapkan antrean notifikasi untuk semua admin
          adminNotifs = administrators.map((admin) =>
            sendGlobalNotification({
              memberId: admin.member_id,
              title: "Pendaftaran Akun Baru",
              content: `${full_name} baru saja mendaftar sebagai Calon Anggota.`,
              type: "ADMIN_ALERT",
            }),
          );
        }

        // Eksekusi semua notifikasi secara paralel
        await Promise.allSettled([userNotif, ...adminNotifs]);
      } catch (notifError) {
        console.error("Gagal mengirim notifikasi:", notifError.message);
      }
    });

    // --- 6. Respon Sukses ---
    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: {
        member_id: newMember.member_id,
        token: token,
        user: userResponse,
      },
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error during registration:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mendaftar.",
      error: error.message,
    });
  }
};
