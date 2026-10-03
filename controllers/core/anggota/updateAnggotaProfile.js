// 📁 controllers/anggota/updateAnggotaProfile.js

import db from "../../../models/index.js";

export const updateAnggotaProfile = async (req, res) => {
  const memberId = req.userId;
  const { 
    Member, 
    MemberBankAccount, 
    MemberEmployment, 
    MemberEmergencyContact, 
    MemberRoleAssignment, 
    MembershipTermination,
    sequelize 
  } = db;

  if (!memberId) {
    return res.status(401).json({
      success: false,
      message: "ID Anggota tidak ditemukan di token.",
    });
  }

  const { 
    full_name, 
    phone_number, 
    address,
    nik_ktp,
    province_id,
    city_id,
    district_id,
    subdistrict_id,
    rt,
    rw,
    // Bank
    bank_name,
    bank_account_no,
    account_holder,
    // Pekerjaan
    occupation,
    employer_name,
    employer_address,
    // Kontak Darurat
    contact_name,
    phone_number_emergency,
    relation
  } = req.body;

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

  const transaction = await sequelize.transaction();

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
        {
          model: MemberEmergencyContact,
          as: "emergencyContacts",
          required: false,
        },
      ],
      transaction
    });

    if (!member) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Data anggota tidak ditemukan.",
      });
    }

    // 1. Update data Member pokok & domisili
    member.full_name = full_name.trim();
    member.phone_number = phone_number.trim();
    if (address !== undefined) member.address = address?.trim() || "";
    if (nik_ktp !== undefined) member.nik_ktp = nik_ktp?.trim() || member.nik_ktp;
    if (province_id !== undefined) member.province_id = province_id || null;
    if (city_id !== undefined) member.city_id = city_id || null;
    if (district_id !== undefined) member.district_id = district_id || null;
    if (subdistrict_id !== undefined) member.subdistrict_id = subdistrict_id || null;
    if (rt !== undefined) member.rt = rt?.trim() || null;
    if (rw !== undefined) member.rw = rw?.trim() || null;

    await member.save({ transaction });

    // 2. Update atau Create Rekening Bank
    if (bank_name || bank_account_no || account_holder) {
      const existingBank = member.bankAccounts?.[0];
      if (existingBank) {
        if (bank_name) existingBank.bank_name = bank_name.trim();
        if (bank_account_no) existingBank.bank_account_no = bank_account_no.trim();
        if (account_holder) existingBank.account_holder = account_holder.trim();
        await existingBank.save({ transaction });
      } else {
        await MemberBankAccount.create({
          member_id: member.member_id,
          bank_name: (bank_name || "").trim(),
          bank_account_no: (bank_account_no || "").trim(),
          account_holder: (account_holder || full_name).trim(),
        }, { transaction });
      }
    }

    // 3. Update atau Create Pekerjaan
    if (occupation || employer_name || employer_address) {
      const existingJob = member.employments?.[0];
      if (existingJob) {
        if (occupation !== undefined) existingJob.occupation = (occupation || "").trim();
        if (employer_name !== undefined) existingJob.employer_name = (employer_name || "").trim();
        if (employer_address !== undefined) existingJob.employer_address = (employer_address || "").trim();
        await existingJob.save({ transaction });
      } else {
        await MemberEmployment.create({
          member_id: member.member_id,
          occupation: (occupation || "").trim(),
          employer_name: (employer_name || "").trim(),
          employer_address: (employer_address || "").trim(),
        }, { transaction });
      }
    }

    // 4. Update atau Create Kontak Darurat
    if (contact_name || phone_number_emergency || relation) {
      const existingContact = member.emergencyContacts?.[0];
      if (existingContact) {
        if (contact_name !== undefined) existingContact.contact_name = (contact_name || "").trim();
        if (phone_number_emergency !== undefined) existingContact.phone_number = (phone_number_emergency || "").trim();
        if (relation !== undefined) existingContact.relation = (relation || "").trim();
        await existingContact.save({ transaction });
      } else {
        await MemberEmergencyContact.create({
          member_id: member.member_id,
          contact_name: (contact_name || "").trim(),
          phone_number: (phone_number_emergency || "").trim(),
          relation: (relation || "").trim(),
        }, { transaction });
      }
    }

    await transaction.commit();

    // Re-fetch data terbaru untuk response
    const updatedMember = await Member.findOne({
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

    const result = {
      member_id: updatedMember.member_id,
      member_no: updatedMember.member_no,
      full_name: updatedMember.full_name,
      email: updatedMember.email,
      phone_number: updatedMember.phone_number,
      member_type: updatedMember.member_type,
      gender: updatedMember.gender,
      date_of_brith: updatedMember.date_of_brith,
      join_date: updatedMember.join_date,
      nik_ktp: updatedMember.nik_ktp,
      address: updatedMember.address,
      province_id: updatedMember.province_id,
      city_id: updatedMember.city_id,
      district_id: updatedMember.district_id,
      subdistrict_id: updatedMember.subdistrict_id,
      rt: updatedMember.rt,
      rw: updatedMember.rw,
      status_id: updatedMember.status_id,
      role: updatedMember.roleAssignments?.[0]?.role_id || 0,
      bank_info: updatedMember.bankAccounts?.[0] || null,
      employment_info: updatedMember.employments?.[0] || null,
      emergency_contact_info: updatedMember.emergencyContacts?.[0] || null,
      active_termination: updatedMember.terminations?.[0] || null,
    };

    // Emit real-time notification to user via socket if available
    try {
      const { sendToUser } = await import("../../../utils/socket.js");
      sendToUser(updatedMember.member_id, "profile:update", result);
    } catch (socketErr) {
      console.warn("Socket notification error on updateProfile:", socketErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Profil berhasil diperbarui.",
      data: result,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error updateProfile:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Terjadi kesalahan saat memperbarui profil.",
    });
  }
};
