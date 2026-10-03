import xlsx from "xlsx";
import bcrypt from "bcrypt";
import db from "../../../models/index.js";

const {
  Member,
  MemberStatus,
  MemberEmployment,
  BusinessProfile,
  MemberEmergencyContact,
  MemberBankAccount,
  sequelize
} = db;

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
      const rawPassword = row["Password"];
      const phone = row["No. HP"];
      const nik = row["NIK KTP"];
      const type = row["Jenis Anggota"];
      const gender = row["Jenis Kelamin"];
      const birthDate = row["Tanggal Lahir (YYYY-MM-DD)"];
      const joinDate = row["Tanggal Bergabung (YYYY-MM-DD)"];
      const rt = row["RT"];
      const rw = row["RW"];
      // Note: Provinsi, Kabupaten, Kecamatan, Kelurahan exist in Excel but we append them to address or ignore UUID lookup for now
      const province = row["Provinsi"];
      const city = row["Kabupaten/Kota"];
      const district = row["Kecamatan"];
      const subdistrict = row["Kelurahan"];
      let address = row["Alamat"];

      // Combine region data into address if address is provided
      if (address && (province || city || district || subdistrict)) {
        const regions = [subdistrict, district, city, province].filter(Boolean).join(", ");
        if (regions) address += `, ${regions}`;
      }

      // Employment
      const occupation = row["Pekerjaan"];
      const employerName = row["Nama Tempat Bekerja"];
      const employerAddress = row["Alamat Tempat Bekerja"];

      // Business
      const businessName = row["Nama Usaha"];
      const businessAddress = row["Alamat Usaha"];
      const monthlyRevenue = row["Omzet Per Bulan (Rp)"];

      // Emergency Contact
      const emContactName = row["Nama Kontak Darurat"];
      const emContactPhone = row["No HP Kontak Darurat"];
      const emRelation = row["Hubungan"];

      // Bank Account
      const bankName = row["Nama Bank"];
      const bankAccountNo = row["Nomor Rekening"];
      const accountHolder = row["Nama Pemilik Rekening"];

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

      let transaction;
      try {
        transaction = await sequelize.transaction();

        let password_hash = null;
        if (rawPassword) {
          const salt = await bcrypt.genSalt(10);
          password_hash = await bcrypt.hash(rawPassword.toString(), salt);
        }

        const newMember = await Member.create({
          member_no: String(memberNo),
          full_name: fullName,
          email: email || null,
          password_hash: password_hash,
          phone_number: phone ? String(phone) : null,
          nik_ktp: nik ? String(nik) : null,
          member_type: type || "Reguler",
          gender: gender || null,
          date_of_brith: birthDate ? new Date(birthDate) : null,
          join_date: joinDate ? new Date(joinDate) : new Date(),
          rt: rt ? String(rt) : null,
          rw: rw ? String(rw) : null,
          address: address || null,
          status_id: statusId,
          is_registration_done: 1,
        }, { transaction });

        // Employment
        if (occupation || employerName || employerAddress) {
          await MemberEmployment.create({
            member_id: newMember.member_id,
            occupation: occupation || "Lainnya",
            employer_name: employerName || "Tidak disebutkan",
            employer_address: employerAddress || null,
          }, { transaction });
        }

        // Business
        if (businessName || businessAddress || monthlyRevenue) {
          await BusinessProfile.create({
            member_id: newMember.member_id,
            business_name: businessName || "Usaha Mandiri",
            business_address: businessAddress || null,
            monthly_revenue: monthlyRevenue ? parseFloat(monthlyRevenue) : null,
          }, { transaction });
        }

        // Emergency Contact
        if (emContactName && emContactPhone && emRelation) {
          await MemberEmergencyContact.create({
            member_id: newMember.member_id,
            contact_name: emContactName,
            phone_number: String(emContactPhone),
            relation: emRelation,
          }, { transaction });
        }

        // Bank Account
        if (bankName && bankAccountNo && accountHolder) {
          await MemberBankAccount.create({
            member_id: newMember.member_id,
            bank_name: bankName,
            bank_account_no: String(bankAccountNo),
            account_holder: accountHolder,
          }, { transaction });
        }

        await transaction.commit();
        successData.push(newMember);
      } catch (err) {
        if (transaction) await transaction.rollback();
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
