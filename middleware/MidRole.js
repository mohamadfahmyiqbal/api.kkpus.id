import db from "../models/index.js";

const MidRole = (allowedRoleNames = []) => {
  return async (req, res, next) => {
    const memberId = req.userId;

    if (!memberId) {
      return res.status(403).json({
        success: false,
        message: "Otorisasi Ditolak. ID Anggota tidak ditemukan.",
      });
    }

    try {
      const assignments = await db.MemberRoleAssignment.findAll({
        where: { member_id: memberId },
        include: [{
          model: db.UserRole,
          as: "role",
          attributes: ["role_id", "role_name"],
          required: true
        }],
      });

      const now = new Date();
      const activeAssignments = assignments.filter(assignment => {
        const endDate = assignment.end_date ? new Date(assignment.end_date) : null;
        return !endDate || endDate > now;
      });

      if (activeAssignments.length === 0) {
        return res.status(403).json({
          success: false,
          message: "Akses Ditolak. Tidak ada peran aktif.",
        });
      }

      const userRoles = activeAssignments.map((a) => a.role.role_name);
      const userRoleIds = activeAssignments.map((a) => a.role.role_id);
      
      req.roles = userRoles;
      req.userRoleIds = userRoleIds;

      if (allowedRoleNames.length > 0) {
        const hasRequiredRole = userRoles.some((role) => allowedRoleNames.includes(role));
        if (!hasRequiredRole) {
          return res.status(403).json({
            success: false,
            message: `Akses Ditolak. Membutuhkan peran: ${allowedRoleNames.join(" atau ")}`,
          });
        }
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Kesalahan server saat memeriksa otorisasi.",
      });
    }
  };
};

export default MidRole;