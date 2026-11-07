import jwt from "jsonwebtoken";
import db from "../../../models/index.js";

// Hapus referensi ke MemberRegistration
const Member = db.Member;

// PENTING: JWT Secret harus diambil dari environment variable
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

/**
 * Kontroler untuk mendapatkan detail pengguna saat ini dari cookie
 * Digunakan oleh frontend setelah login untuk mendapatkan data user tanpa token di respons
 */
export const getCurrentUser = async (req, res) => {
  try {
    // Dapatkan token dari cookie
    const token = req.cookies.auth_token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Autentikasi gagal: Token tidak ditemukan"
      });
    }

    try {
      const decoded = jwt.verify(token, getJwtSecret());
      
      // Cari member berdasarkan member_id dari token
      const member = await Member.findOne({
        where: { member_id: decoded.member_id },
        include: [
          {
            model: db.MemberRoleAssignment,
            as: "roleAssignments",
            include: [
              {
                model: db.UserRole,
                as: "role",
              },
            ],
          },
        ],
        attributes: [
          "member_id",
          "full_name",
          "email",
          "phone_number",
          "gender",
          "join_date",
          "member_no",
          "member_type",
          "nik_ktp",
          "address",
          "status_id",
        ],
      });

      if (!member) {
        return res.status(404).json({
          success: false,
          message: "Pengguna tidak ditemukan"
        });
      }

      // Extract roles to flat array for frontend convenience
      const memberJSON = member.toJSON();
      memberJSON.roles = (memberJSON.roleAssignments || [])
        .map(ra => {
          const roleName = ra.role?.role_name?.toLowerCase().trim();
          return roleName;
        })
        .filter(Boolean);

      delete memberJSON.password_hash;

      return res.status(200).json({
        success: true,
        message: "Data pengguna berhasil diambil",
        data: {
          user: memberJSON,
        },
      });
      
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: "Autentikasi gagal: Token tidak valid"
      });
    }
    
  } catch (error) {
    console.error("Get current user API Error:", {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data pengguna. Terjadi kesalahan server internal."
    });
  }
};