import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "naila";

export const MidAnggota = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: "Akses Ditolak. Token tidak ditemukan.",
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.member_id) {
      return res.status(403).json({
        success: false,
        message: "Token tidak valid. ID Anggota hilang.",
      });
    }

    req.userId = decoded.member_id;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Sesi tidak valid atau kedaluwarsa.",
    });
  }
};

export default MidAnggota;