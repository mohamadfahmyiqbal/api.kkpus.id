import MAnggota from "../../models/anggota/MAnggota.js";
import MPasswordReset from "../../models/MPasswordReset.js";
import { sendEmail } from "../utils/sendMail.js";
import { Op } from "sequelize";

/**
 * Generate a numeric OTP of given length.
 * @param {number} length
 * @returns {string}
 */
function generateOTP(length = 6) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

export const verifikasiOTP = async (req, res) => {
  const { otp } = req.body;

  if (!otp || typeof otp !== "string" || otp.trim() === "") {
    return res.status(400).json({ message: "OTP wajib diisi" });
  }

  try {
    // Cari OTP yang masih aktif dan belum expired
    const otpRecord = await MPasswordReset.findOne({
      where: {
        otp: otp.trim(),
        status: "active",
        expires_at: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!otpRecord) {
      return res
        .status(401)
        .json({ message: "OTP tidak valid atau sudah kadaluarsa" });
    }

    // Tutup OTP agar tidak bisa dipakai ulang
    await otpRecord.update({ status: "closed" });

    return res
      .status(200)
      .json({ message: "OTP valid, silakan reset password Anda" });
  } catch (error) {
    console.error("Error verifikasi OTP:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

export const Forgot = async (req, res) => {
  try {
    const email = req.body?.email?.trim();

    if (!email) {
      return res.status(400).json({ message: "Email wajib diisi" });
    }

    const user = await MAnggota.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "Email tidak terdaftar" });
    }

    // Cek apakah sudah ada OTP yang diajukan untuk email ini dan belum expired
    const existingOtp = await MPasswordReset.findOne({
      where: {
        email,
        expires_at: {
          [Op.gt]: new Date(),
        },
        status: "active",
      },
    });

    if (existingOtp) {
      return res.status(400).json({
        message:
          "Permintaan reset password sudah diajukan. Silakan cek email Anda untuk kode OTP yang masih berlaku.",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Simpan OTP ke tabel password_resets
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 menit dari sekarang
    let createdOtp;
    try {
      createdOtp = await MPasswordReset.create({
        email,
        otp,
        expires_at: expiresAt,
        status: "active",
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Gagal menyimpan OTP", error: err.message });
    }

    // Kirim OTP ke email
    const subject = "Kode OTP Reset Password";
    const text = `Kode OTP reset password Anda adalah: ${otp}. Berlaku selama 10 menit.`;

    try {
      await sendEmail({
        body: {
          ret: "ret",
          to: user.email,
          subject,
          text,
        },
      });
    } catch (mailError) {
      // Hapus OTP jika gagal kirim email
      if (createdOtp && createdOtp.id) {
        try {
          await MPasswordReset.destroy({ where: { id: createdOtp.id } });
        } catch (deleteErr) {
          // Log error penghapusan, tapi tetap balas error utama
          console.error(
            "Gagal menghapus OTP setelah gagal kirim email:",
            deleteErr
          );
        }
      }
      return res.status(500).json({
        message: "Gagal mengirim email OTP",
        error: mailError.message,
      });
    }
    console.log(otp);

    return res.status(200).json({
      message:
        "Permintaan reset password berhasil. Silakan cek email Anda untuk kode OTP.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
