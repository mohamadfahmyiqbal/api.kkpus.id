import db from "../../../models/index.js";
const { Member, MemberRoleAssignment, UserRole, sequelize } = db;

export const updateRole = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { member_id } = req.params;
    const { role_id } = req.body; // Bisa array atau string

    // 1. Get member
    const member = await Member.findByPk(member_id);
    if (!member) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: "Member tidak ditemukan" });
    }

    // 2. Check if regular member
    if (!member.member_type || !member.member_type.toLowerCase().includes("reguler")) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: "Hanya anggota reguler yang rolenya dapat diubah" });
    }

    // 3. Clear existing role assignments
    await MemberRoleAssignment.destroy({ where: { member_id }, transaction });

    // 4. Assign new roles
    if (role_id) {
      const rolesToAssign = Array.isArray(role_id) ? role_id : [role_id];
      for (const id of rolesToAssign) {
        const role = await UserRole.findByPk(id);
        if (!role) {
          await transaction.rollback();
          return res.status(404).json({ success: false, message: `Role dengan ID ${id} tidak valid` });
        }
        await MemberRoleAssignment.create({
          member_id,
          role_id: id,
          start_date: new Date()
        }, { transaction });
      }
    }

    await transaction.commit();
    return res.status(200).json({ success: true, message: "Role berhasil diubah" });
  } catch (error) {
    await transaction.rollback();
    console.error("Update Role Error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server saat merubah role" });
  }
};
