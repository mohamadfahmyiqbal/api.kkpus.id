// 📁 controllers/anggota/getAnggotaProfile.js

import db from "../../../models/index.js";

export const getAnggotaProfile = async (req, res) => {
  const memberId = req.userId;
  // Tambahkan model relasi: MemberBank dan MemberEmployment
  const { Member, MemberRoleAssignment, MemberBankAccount, MemberEmployment } =
    db;

  if (!memberId) {
    return res.status(401).json({
      success: false,
      message: "ID Anggota tidak ditemukan di token.",
    });
  }

  try {
    const memberData = await Member.findOne({
      where: { member_id: memberId },
      include: [
        {
          model: MemberRoleAssignment,
          as: "roleAssignments",
          attributes: ["role_id"],
          limit: 1,
          order: [["start_date", "DESC"]],
          required: false,
        },
        // Ambil data rekening bank
        {
          model: MemberBankAccount,
          as: "bankAccounts",
          required: false,
        },
        // Ambil data pekerjaan
        {
          model: MemberEmployment,
          as: "employments",
          required: false,
        },
      ],
    });

    if (!memberData) {
      return res.status(404).json({
        success: false,
        message: "Data anggota tidak ditemukan.",
      });
    }

    // Transformasi Data sesuai struktur Database baru
    const result = {
      member_id: memberData.member_id, // ✅ Sesuai tabel
      member_no: memberData.member_no, // ✅ Sesuai tabel
      full_name: memberData.full_name, // ✅ Sesuai tabel
      email: memberData.email, // ✅ Sesuai tabel
      phone_number: memberData.phone_number, // ✅ Sesuai tabel
      member_type: memberData.member_type, // ✅ Sesuai tabel
      gender: memberData.gender, // ✅ Sesuai tabel
      date_of_brith: memberData.date_of_brith, // ✅ Sesuai tabel (dengan typo-nya)
      join_date: memberData.join_date, // ✅ Sesuai tabel
      nik_ktp: memberData.nik_ktp, // ✅ Sesuai tabel (bukan 'nik')
      address: memberData.address, // ✅ Sesuai tabel
      status_id: memberData.status_id, // ✅ Sesuai tabel

      // Data Relasi Tetap
      role: memberData.roleAssignments?.[0]?.role_id || 0,
      bank_info: memberData.bankAccounts?.[0] || null,
      employment_info: memberData.employments?.[0] || null,
    };

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error getProfile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
