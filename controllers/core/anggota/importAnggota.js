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
  MemberRoleAssignment,
  UserRole,
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

    // Pre-fetch All Member Statuses & Default Member Role
    const allStatuses = await MemberStatus.findAll();
    const statusReguler = allStatuses.find((s) => s.status_name === "Anggota Reguler") ||
      allStatuses.find((s) => s.status_name === "Aktif") ||
      allStatuses[0] || null;
    const statusLuarBiasa = allStatuses.find((s) => s.status_name === "Anggota Luar Biasa") || statusReguler;

    const memberRole = await UserRole.findOne({ where: { role_name: "Anggota" } });

    const successData = [];
    const errorData = [];

    // Helper untuk parsing tanggal dari format Excel (baik serial number maupun string YYYY-MM-DD / DD-MM-YYYY)
    const parseExcelDate = (val) => {
      if (!val) return null;
      if (typeof val === "number") {
        // Format serial date dari Excel (basis 1899-12-30)
        const date = new Date(Math.round((val - 25569) * 86400 * 1000));
        return isNaN(date.getTime()) ? null : date;
      }
      if (val instanceof Date) {
        return isNaN(val.getTime()) ? null : val;
      }
      const str = String(val).trim();
      // Format YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        const d = new Date(str);
        return isNaN(d.getTime()) ? null : d;
      }
      // Format DD-MM-YYYY atau DD/MM/YYYY
      const parts = str.split(/[-/]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          const d = new Date(str);
          return isNaN(d.getTime()) ? null : d;
        } else {
          // DD, MM, YYYY
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);
          const d = new Date(year, month, day);
          return isNaN(d.getTime()) ? null : d;
        }
      }
      const parsed = new Date(str);
      return isNaN(parsed.getTime()) ? null : parsed;
    };

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
      const birthDateRaw =
        row["Tanggal Lahir (YYYY-MM-DD)"] ||
        row["Tanggal Lahir"] ||
        row["Tgl Lahir"];
      const joinDateRaw =
        row["Tanggal Bergabung (YYYY-MM-DD)"] ||
        row["Tanggal Bergabung"] ||
        row["Tgl Bergabung"] ||
        row["Tanggal Masuk"];
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

      // Validate member_no format (alphanumeric, 1-20 chars)
      if (!/^[a-zA-Z0-9]{1,20}$/.test(String(memberNo).trim())) {
        errorData.push({ row: i + 2, reason: `No. Anggota "${memberNo}" format tidak valid (hanya alfanumerik)` });
        continue;
      }

      // Validate full_name (alphanumeric and common punctuation, 1-100 chars)
      if (!/^[a-zA-Z0-9\s.,'\\-]{1,100}$/.test(String(fullName).trim())) {
        errorData.push({ row: i + 2, reason: `Nama "${fullName}" format tidak valid (hanya alfanumerik dan tanda baca)` });
        continue;
      }

      // Validate email format if provided
      const trimmedEmail = email ? String(email).trim().toLowerCase() : null;
      if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        errorData.push({ row: i + 2, reason: `Format email "${email}" tidak valid` });
        continue;
      }

      // Validate NIK (must be 16 digits) if provided
      const trimmedNik = nik ? String(nik).trim() : null;
      if (trimmedNik && !/^[0-9]{16}$/.test(trimmedNik)) {
        errorData.push({ row: i + 2, reason: `NIK KTP "${nik}" harus 16 digit angka` });
        continue;
      }

      // Check duplicate member_no
      const existingMemberNo = await Member.findOne({
        where: { member_no: String(memberNo).trim() }
      });
      if (existingMemberNo) {
        errorData.push({ row: i + 2, reason: `No. Anggota "${memberNo}" sudah terdaftar` });
        continue;
      }

      // Check duplicate email
      if (trimmedEmail) {
        const existingEmail = await Member.findOne({ where: { email: trimmedEmail } });
        if (existingEmail) {
          errorData.push({ row: i + 2, reason: `Email "${email}" sudah terdaftar` });
          continue;
        }
      }

      // Check duplicate NIK
      if (trimmedNik) {
        const existingNik = await Member.findOne({ where: { nik_ktp: trimmedNik } });
        if (existingNik) {
          errorData.push({ row: i + 2, reason: `NIK "${nik}" sudah terdaftar` });
          continue;
        }
      }

      let transaction;
      try {
        transaction = await sequelize.transaction();

        let password_hash = null;
        if (rawPassword) {
          const salt = await bcrypt.genSalt(10);
          password_hash = await bcrypt.hash(rawPassword.toString(), salt);
        }

        const parsedBirthDate = parseExcelDate(birthDateRaw);
        const parsedJoinDate = parseExcelDate(joinDateRaw) || new Date();

        const isLuarBiasa = String(type || "").toLowerCase().includes("luar biasa");
        const assignedStatus = isLuarBiasa ? statusLuarBiasa : statusReguler;
        const normalizedMemberType = isLuarBiasa ? "Anggota Luar Biasa" : "Anggota Reguler";

        const newMember = await Member.create({
          member_no: String(memberNo).trim(),
          full_name: String(fullName).trim(),
          email: trimmedEmail,
          password_hash: password_hash,
          phone_number: phone ? String(phone).trim() : null,
          nik_ktp: trimmedNik,
          member_type: normalizedMemberType,
          gender: gender || null,
          date_of_brith: parsedBirthDate,
          join_date: parsedJoinDate,
          rt: rt ? String(rt).trim() : null,
          rw: rw ? String(rw).trim() : null,
          address: address || null,
          status_id: assignedStatus ? assignedStatus.status_id : null,
          is_registration_done: 1,
        }, { transaction });

        // Role Assignment (default to "Anggota" role)
        if (memberRole) {
          await MemberRoleAssignment.create({
            member_id: newMember.member_id,
            role_id: memberRole.role_id,
            start_date: new Date(),
          }, { transaction });
        }

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
