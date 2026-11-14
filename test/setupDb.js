import db from "../models/index.js";
import bcrypt from "bcrypt";

let schemaEnsured = false;
let schemaPromise = null;

export const ensureTestSchema = async () => {
  if (schemaEnsured) return;
  if (schemaPromise) return schemaPromise;

  schemaPromise = (async () => {
    // Sync all defined Sequelize models if tables are missing (e.g. fresh DB container in CI)
    await db.sequelize.sync();

    // Ensure default roles exist
    if (db.UserRole) {
      const roles = ["Super Admin", "Admin", "Pengawas", "Ketua", "Bendahara", "Anggota"];
      for (const r of roles) {
        await db.UserRole.findOrCreate({
          where: { role_name: r },
          defaults: { role_name: r, description: `${r} role` },
        });
      }
    }

    // Ensure default member statuses exist
    if (db.MemberStatus) {
      const statuses = ["AKTIF", "NON-AKTIF", "PENDING", "DITOLAK"];
      for (const s of statuses) {
        await db.MemberStatus.findOrCreate({
          where: { status_name: s },
          defaults: { status_name: s, description: `Status ${s}` },
        });
      }
    }

    // Ensure test admin user exists for test suites
    if (db.Member) {
      const adminTestId = "00000000-0000-0000-0000-000000000001";
      const existing = await db.Member.findByPk(adminTestId);
      if (!existing) {
        const activeStatus = db.MemberStatus
          ? await db.MemberStatus.findOne({ where: { status_name: "AKTIF" } })
          : null;
        const hashedPassword = await bcrypt.hash("adminPassword123", 10);
        await db.Member.create({
          member_id: adminTestId,
          member_no: "ADM-0001",
          full_name: "Test Admin",
          email: "test.admin@kkpus.id",
          phone_number: "081234567890",
          password_hash: hashedPassword,
          member_type: "REGULER",
          status_id: activeStatus ? activeStatus.status_id : 1,
          is_registration_done: true,
        });

        const adminRole = db.UserRole
          ? await db.UserRole.findOne({ where: { role_name: "Admin" } })
          : null;
        if (adminRole && db.MemberRoleAssignment) {
          await db.MemberRoleAssignment.findOrCreate({
            where: {
              member_id: adminTestId,
              role_id: adminRole.role_id,
            },
            defaults: {
              member_id: adminTestId,
              role_id: adminRole.role_id,
            },
          });
        }
      }
    }
    schemaEnsured = true;
  })();

  return schemaPromise;
};
