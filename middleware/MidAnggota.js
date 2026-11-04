import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { isTokenBlacklisted } from "../utils/tokenBlacklist.js";

dotenv.config();

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET tidak diatur di environment variable");
    }
    return "default_jwt_secret_dev_32_characters_min_len";
  }
  return secret;
};

export const MidAnggota = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: "Akses Ditolak. Token tidak ditemukan.",
    });
  }

  const token = authHeader.split(' ')[1];

  // Check token blacklist (logout invalidation)
  if (isTokenBlacklisted(token)) {
    return res.status(401).json({
      success: false,
      message: "Token telah dicabut. Silakan login ulang.",
    });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());

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