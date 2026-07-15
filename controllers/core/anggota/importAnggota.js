import xlsx from "xlsx";
import db from "../../../models/index.js";
const Member = db.Member;
const MemberStatus = db.MemberStatus;

export const importAnggota = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Tidak ada file yang diunggah" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({ success: false, message: "File Excel kosong" });
    }

    // Get Active Status ID
    let activeStatus = await MemberStatus.findOne({ where: { status_name: "Aktif" } });
    if (!activeStatus) {
       activeStatus = await MemberStatus.findOne({ where: { status_name: "Active" } });
    }
    const statusId = activeStatus ? activeStatus.status_id : null;

    const successData = [];
    const errorData = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const memberNo = row["No. Anggota"];
      const fullName = row["Nama Lengkap"];
      const email = row["Email"];
      const phone = row["No. HP"];
      const nik = row["NIK KTP"];
      const type = row["Jenis Anggota"];
      const gender = row["Jenis Kelamin"];
      const address = row["Alamat"];

      if (!memberNo || !fullName) {
        errorData.push({ row: i + 2, reason: "No. Anggota dan Nama Lengkap wajib diisi" });
        continue;
      }

      // Check if member already exists
      const existingMember = await Member.findOne({
        where: { member_no: String(memberNo) }
      });

      if (existingMember) {
        errorData.push({ row: i + 2, reason: `No. Anggota ${memberNo} sudah terdaftar` });
        continue;
      }

      try {
        const newMember = await Member.create({
          member_no: String(memberNo),
          full_name: fullName,
          email: email || null,
          phone_number: phone ? String(phone) : null,
          nik_ktp: nik ? String(nik) : null,
          member_type: type || "Reguler",
          gender: gender || null,
          address: address || null,
          status_id: statusId,
          join_date: new Date(),
          is_registration_done: 1,
        });
        successData.push(newMember);
      } catch (err) {
        errorData.push({ row: i + 2, reason: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Proses import selesai",
      data: {
        totalImported: successData.length,
        totalFailed: errorData.length,
        errors: errorData
      }
    });

  } catch (error) {
    console.error("Import Anggota Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat import anggota",
      error: error.message
    });
  }
};
