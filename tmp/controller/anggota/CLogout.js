import MAnggota from "../../models/anggota/MAnggota.js";
import jwt from "jsonwebtoken";

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const token = req?.cookies?.token;
    if (token) {
      const jwtSecret = process.env.JWT_SECRET || "secretkey";
      const decoded = jwt.verify(token, jwtSecret);
      await MAnggota.update(
        { token: null },
        { where: { email: decoded.email } }
      );
    }

    return res.status(200).json({ message: "Logout berhasil" });
  } catch (error) {
    return res.status(500).json({ message: `Server Error ${error}` });
  }
};
