import { Op, where } from "sequelize";
import moment from "moment";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import MAnggota from "../../models/anggota/MAnggota.js";
import { generateNIKBaru } from "./CGenerateNik.js";

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password wajib diisi" });
    }

    const user = await MAnggota.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Password salah" });
    }

    const payload = {
      nik: user.nik,
      email: user.email,
      nama: user.nama,
      roles: user.roles,
    };

    const jwtSecret = process.env.JWT_SECRET || "secretkey";
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1d" });

    // Set cookie token
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    await MAnggota.update({ token }, { where: { email } });

    return res.status(200).json({ message: "Login berhasil", token: token });
  } catch (error) {
    return res.status(500).json({ message: `Server Error ${error}` });
  }
};
