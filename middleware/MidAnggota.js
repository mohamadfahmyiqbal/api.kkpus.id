import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { isTokenBlacklisted } from "../utils/tokenBlacklist.js";
import crypto from "crypto";

dotenv.config();

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET tidak diatur di environment variable");
    }
    // Generate a secure default secret for development (16 bytes = 128 bits)
    return crypto.randomBytes(16).toString('hex');
  }
  return secret;
};

/**
 * Verify token signature using HMAC SHA-512 (modern security standard)
 * Ensures token has been signed by the server and not tampered with
 */
export const verifySecureToken = (token) => {
  const secret = getJwtSecret();
  try {
    return jwt.verify(token, secret, { 
      algorithms: ['HS512'], // Explicitly require HS512 algorithm
      clockTolerance: 300, // 5 minutes tolerance for clock skew
      maxAge: '24h' // Token expires after 24 hours
    });
  } catch (error) {
    // Log security event for failed token verification attempts
    console.warn(`[Security] Failed token verification: ${error.message}`);
    return null;
  }
};

export const MidAnggota = async (req, res, next) => {
  let token = null;

  // 1. Prioritaskan HttpOnly cookie (PCI-DSS & OWASP best practice)
  if (req.cookies && req.cookies.auth_token) {
    token = req.cookies.auth_token;
  }

  // 2. Fallback ke Authorization: Bearer <token> header jika cookie tidak disertakan
  if (!token) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Akses Ditolak. Sesi otentikasi tidak ditemukan.",
    });
  }

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