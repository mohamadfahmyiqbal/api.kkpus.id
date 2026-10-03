import db from "../../../models/index.js";
const { UserRole } = db;

export const getRoles = async (req, res) => {
  try {
    const roles = await UserRole.findAll({
      order: [["role_id", "ASC"]],
      raw: true,
    });
    return res.status(200).json({ success: true, data: roles });
  } catch (error) {
    console.error("Get Roles Error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server saat mengambil data role" });
  }
};
