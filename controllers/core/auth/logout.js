import { blacklistToken } from "../../utils/tokenBlacklist.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
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
