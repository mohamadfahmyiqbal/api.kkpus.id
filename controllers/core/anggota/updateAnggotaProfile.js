// 📁 controllers/anggota/updateAnggotaProfile.js

import db from "../../../models/index.js";

export const updateAnggotaProfile = async (req, res) => {
  const memberId = req.userId;
  const { Member, MemberBankAccount, MemberEmployment } = db;

  if (!memberId) {
    return res.status(401).json({
      success: false,
      message: "ID Anggota tidak ditemukan di token.",
    });
  }

  const { full_name, phone_number, address } = req.body;

  if (!full_name?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Nama lengkap wajib diisi.",
    });
  }
  if (!phone_number?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Nomor telepon wajib diisi.",
    });
  }
  if (!address?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Alamat wajib diisi.",
    });
  }

  try {
    const member = await Member.findOne({
      where: { member_id: memberId },
      include: [
        {
          model: MemberBankAccount,
          as: "bankAccounts",
          required: false,
        },
        {
          model: MemberEmployment,
          as: "employments",
          required: false,
        },
      ],
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Data anggota tidak ditemukan.",
      });
    }

    // Update fields
    member.full_name = full_name.trim();
    member.phone_number = phone_number.trim();
    member.address = address.trim();

    await member.save();

    // Transform updated data to match getProfile structure
    const result = {
      member_id: member.member_id,
      member_no: member.member_no,
      full_name: member.full_name,
      email: member.email,
      phone_number: member.phone_number,
      member_type: member.member_type,
      gender: member.gender,
      date_of_brith: member.date_of_brith,
      join_date: member.join_date,
      nik_ktp: member.nik_ktp,
      address: member.address,
      status_id: member.status_id,
      bank_info: member.bankAccounts?.[0] || null,
      employment_info: member.employments?.[0] || null,
    };

    return res.status(200).json({
      success: true,
      message: "Profil berhasil diperbarui.",
      data: result,
    });
  } catch (error) {
    console.error("Error updateProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui profil.",
    });
  }
};
