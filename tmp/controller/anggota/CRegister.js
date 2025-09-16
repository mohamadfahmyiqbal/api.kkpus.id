import MAnggota from "../../models/anggota/MAnggota.js";
import { generateNIKBaru } from "./CGenerateNik.js";
import bcrypt from "bcrypt";

export const Register = async (req, res) => {
  try {
    const {
      email = "",
      nama = "",
      no_tlp = "",
      password = "",
      rePassword = "",
      status_anggota = "1",
      roles = "1",
    } = req.body;

    // Validasi field wajib
    if (
      [email, nama, no_tlp, password, rePassword].some((field) => !field.trim())
    ) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // Validasi password dan konfirmasi
    if (password !== rePassword) {
      return res
        .status(400)
        .json({ message: "Password dan konfirmasi tidak sama" });
    }

    // Cek email sudah terdaftar
    const existingUser = await MAnggota.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    // Generate NIK dan hash password secara paralel
    const [nikBaru, hashedPassword] = await Promise.all([
      generateNIKBaru(),
      bcrypt.hash(password, 10),
    ]);

    const data = {
      nik: nikBaru,
      nama,
      email,
      no_tlp,
      password: hashedPassword,
      status_anggota,
      roles,
    };

    const user = await MAnggota.create(data);

    // Hindari mengirim password ke client
    const { password: _, ...userWithoutPassword } = user.toJSON
      ? user.toJSON()
      : user;

    return res
      .status(201)
      .json({ message: "Registrasi berhasil", user: userWithoutPassword });
  } catch (error) {
    console.error("Register Error:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
