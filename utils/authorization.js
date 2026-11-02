import db from "../models/index.js";

// Role yang boleh mengakses data backoffice lintas anggota.
// Daftar ini mengikuti role yang dipakai alur approval di aplikasi.
export const BACKOFFICE_ROLES = ["pengawas", "ketua", "bendahara"];

const normalizeRole = (role) => String(role || "").trim().toLowerCase();

/**
 * Ambil nama role aktif milik seorang anggota.
 * Role dianggap aktif jika end_date kosong atau masih di masa depan
 * (konsisten dengan middleware/MidRole.js).
 */
export const getActiveRoleNames = async (memberId) => {
  if (!memberId) return [];

  const assignments = await db.MemberRoleAssignment.findAll({
    where: { member_id: memberId },
    include: [
      {
        model: db.UserRole,
        as: "role",
        attributes: ["role_name"],
        required: true,
      },
    ],
    raw: true,
    nest: true,
  });

  const now = new Date();

  return assignments
    .filter((assignment) => {
      const endDate = assignment.end_date ? new Date(assignment.end_date) : null;
      return !endDate || endDate > now;
    })
    .map((assignment) => normalizeRole(assignment.role?.role_name))
    .filter(Boolean);
};

export const hasAnyRole = async (
  memberId,
  allowedRoles = BACKOFFICE_ROLES
) => {
  const allowed = allowedRoles.map(normalizeRole);
  const roles = await getActiveRoleNames(memberId);
  return roles.some((role) => allowed.includes(role));
};

export const isBackoffice = (memberId) => hasAnyRole(memberId);

export default {
  BACKOFFICE_ROLES,
  getActiveRoleNames,
  hasAnyRole,
  isBackoffice,
};
