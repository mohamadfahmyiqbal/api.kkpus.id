// 📁 controllers/anggota/getAnggotaProfile.js

import db from "../../../models/index.js";

export const getAnggotaProfile = async (req, res) => {
  const memberId = req.userId;
  // Tambahkan model relasi: MemberBankAccount, MemberEmployment, MemberEmergencyContact
  const { 
    Member, 
    MemberRoleAssignment, 
    MemberBankAccount, 
    MemberEmployment, 
    MemberEmergencyContact, 
    MembershipTermination 
  } = db;

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
        // Ambil data kontak darurat
        {
          model: MemberEmergencyContact,
          as: "emergencyContacts",
          required: false,
        },
        {
          model: MembershipTermination,
          as: "terminations",
          where: {
            status: ["PENDING", "APPROVED", "WAITING_CONFIRMATION"]
          },
          required: false,
          limit: 1,
          order: [["created_at", "DESC"]]
        }
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
      member_id: memberData.member_id,
      member_no: memberData.member_no,
      full_name: memberData.full_name,
      email: memberData.email,
      phone_number: memberData.phone_number,
      member_type: memberData.member_type,
      gender: memberData.gender,
      date_of_brith: memberData.date_of_brith,
      join_date: memberData.join_date,
      nik_ktp: memberData.nik_ktp,
      address: memberData.address,
      province_id: memberData.province_id,
      city_id: memberData.city_id,
      district_id: memberData.district_id,
      subdistrict_id: memberData.subdistrict_id,
      rt: memberData.rt,
      rw: memberData.rw,
      status_id: memberData.status_id,

      // Data Relasi
      role: memberData.roleAssignments?.[0]?.role_id || 0,
      bank_info: memberData.bankAccounts?.[0] || null,
      employment_info: memberData.employments?.[0] || null,
      emergency_contact_info: memberData.emergencyContacts?.[0] || null,
      active_termination: memberData.terminations?.[0] || null,
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
