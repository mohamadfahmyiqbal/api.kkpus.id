import { blacklistToken } from "../../../utils/tokenBlacklist.js";
import jwt from "jsonwebtoken";

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

const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, getJwtSecret());
        blacklistToken(token, decoded.exp ? decoded.exp * 1000 : Date.now() + 86400000);
      } catch (err) {
        // Token already invalid; still blacklist to be safe
        blacklistToken(token, Date.now() + 86400000);
      }
    }

    return res.status(200).json({
      status: true,
      message: "Logout berhasil"
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};

export { logout };
