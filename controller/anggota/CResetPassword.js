import MAnggota from "../../models/anggota/MAnggota.js";
import MPasswordReset from "../../models/MPasswordReset.js";
import bcrypt from "bcrypt";

/**
 * Reset password controller
 */
export const resetPassword = async (req, res) => {
  try {
    const { password, otp } = req.body;

    // Validasi input
    if (!password || !otp) {
      return res.status(400).json({
        message: "Password baru dan kode OTP wajib diisi.",
      });
    }

    // Validasi format password: 6 digit angka
    // if (!/^\d{6}$/.test(password)) {
    //   return res.status(400).json({
    //     message: "Password harus berupa 6 digit angka.",
    //   });
    // }

    // Cari record reset berdasarkan OTP
    const resetRecord = await MPasswordReset.findOne({
      where: { otp },
      raw: true,
      nest: true,
    });

    if (!resetRecord) {
      return res.status(401).json({
        message: "Kode OTP tidak valid atau sudah kadaluarsa.",
      });
    }

    const email = resetRecord.email;
    if (!email) {
      return res.status(400).json({
        message: "Email tidak ditemukan untuk kode OTP ini.",
      });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password anggota
    const [updated] = await MAnggota.update(
      { password: hashedPassword },
      { where: { email } }
    );

    if (!updated) {
      return res.status(500).json({
        message: "Gagal memperbarui password. Silakan coba lagi.",
      });
    }

    // Hapus token reset agar tidak bisa digunakan ulang
    await MPasswordReset.destroy({ where: { otp } });

    return res.status(200).json({
      message:
        "Password berhasil direset. Silakan login dengan password baru Anda.",
    });
  } catch (error) {
    console.error("Terjadi error saat reset password:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};
