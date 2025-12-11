// controllers/core/anggota/submitRegistration.js (FINAL DENGAN APPROVAL)

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../../../models/index.js";
import util from "util";

// 💡 PASTIKAN SEMUA MODEL TERSEDIA DI db object
const {
 MemberRegistration,
 MemberBankAccount,
 MemberEmployment,
 MemberEmergencyContact,
 Member, // Model Master Anggota
 UserRole, // Untuk logic notifikasi
 MemberRoleAssignment, // Untuk logic notifikasi
 Notification, // Untuk logic notifikasi
 // ApprovalStep, // Jika model ApprovalStep diperlukan di sini untuk mendapatkan ID
} = db;

const __filename = fileURLToPath(import.meta.url);
const currentDir = path.dirname(__filename);
const rootDir = path.join(currentDir, "..", "..", ".."); // Asumsi root path Anda

const unlinkAsync = util.promisify(fs.unlink);

/**
 * Fungsi pembantu untuk menyimpan Base64 image ke disk.
 */
const saveBase64Image = (base64Image, nik, fileType) => {
 if (typeof base64Image !== "string" || base64Image.length === 0) {
  throw new Error(`Invalid or empty Base64 string for ${fileType}.`);
 }

 const parts = base64Image.match(/^data:(image\/[a-zA-Z]+);base64,(.*)$/);

 if (!parts || parts.length !== 3) {
  throw new Error("Format Base64 foto tidak valid.");
 }

 const mimeType = parts[1];
 const imageBuffer = Buffer.from(parts[2], "base64");
 const extension = mimeType.split("/")[1];

 // Atur path penyimpanan: /public/uploads/anggota/NIK_fileType.ext
 const uploadDir = path.join(rootDir, "public", "uploads", "anggota");
 if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
 }

 const publicPath = `/uploads/anggota/${nik}_${fileType}_${Date.now()}.${extension}`;
 const fullPath = path.join(rootDir, "public", publicPath);

 fs.writeFileSync(fullPath, imageBuffer);

 return publicPath;
};


// ** Kontroler Utama **
export const submitRegistration = async (req, res) => {
 // 1. Destructuring semua data yang dikirim dari frontend
 const {
  member_id,
  nik_ktp,
  full_name,
  alamat_ktp,
  tipeAnggota, // member_type
  phone_number,
  email,
  // Data Pekerjaan
  occupation,
  employer_name,
  employer_address,
  // Data Kontak Darurat (menggunakan nama field dari Step6EmergencyContact.jsx)
  contact_name,
  phone_number_emergency, // Akan disimpan di kolom 'phone_number' di tabel Emergency Contact
  relation,
  // Data Bank (menggunakan nama field dari Step7BankData.jsx)
  bank_name,
  bank_account_no, // Akan disimpan di kolom 'bank_account_no' di tabel Bank Account
  account_holder, // Akan disimpan di kolom 'account_holder' di tabel Bank Account
  // Foto
  foto_ktp,
  foto_swafoto,
 } = req.body;

 let tempPaths = [];
 let newRegistration = null;

 try {
  // 2. Validasi Dasar
  if (!member_id) {
   return res.status(400).json({
    success: false,
    message: "member_id wajib dikirim dari frontend",
   });
  }

  const checkMember = await Member.findOne({ where: { member_id } });
  if (!checkMember) {
   return res.status(404).json({
    success: false,
    message: "Member tidak ditemukan. Silakan login ulang.",
   });
  }

  // 3. Simpan Gambar ke Disk
  // Path publik akan disimpan di database. Path sementara (tempPaths) untuk cleanup.
  const ktpPublicPath = saveBase64Image(foto_ktp, nik_ktp, "ktp");
  tempPaths.push(ktpPublicPath);

  const swafotoPublicPath = saveBase64Image(foto_swafoto, nik_ktp, "swafoto");
  tempPaths.push(swafotoPublicPath);

  // 4. ** LOGIC APPROVAL BARU: Tentukan Flow ID dan Step ID Awal **
  // 💡 Dalam implementasi nyata, ID ini harus diambil secara dinamis.
  const REGISTRATION_APPROVAL_FLOW_ID = 1; // Asumsi ID Flow Pendaftaran Anggota
  const INITIAL_APPROVAL_STEP_ID = 1;      // Asumsi ID Step awal (e.g., Verifikasi Dokumen)


  // 5. Simpan semua data ke DB dalam satu transaksi (untuk atomisitas)
  const result = await db.sequelize.transaction(async (t) => {

   // 5.1. SIMPAN DATA REGISTRASI (member_registrations)
   newRegistration = await MemberRegistration.create({
    member_id: checkMember.member_id,
    full_name: full_name,
    email: email,
    phone_number: phone_number,
    nik_ktp: nik_ktp,
    address_ktp: alamat_ktp,
    member_type: tipeAnggota,
    ktp_photo_path: ktpPublicPath,
    selfie_photo_path: swafotoPublicPath,
    // 🚨 TAMBAHKAN FIELD APPROVAL
    approval_flow_id: REGISTRATION_APPROVAL_FLOW_ID,
    current_step_id: INITIAL_APPROVAL_STEP_ID,
    // registration_status (default: "verifikasi_dokumen") dan final_status (default: "PENDING") akan otomatis terisi
   }, { transaction: t });

   // 5.2. SIMPAN DATA BANK (member_bank_accounts)
   await MemberBankAccount.create({
    member_id: checkMember.member_id,
    bank_name: bank_name,
    bank_account_no: bank_account_no, // Menggunakan nama kolom yang dikoreksi
    account_holder: account_holder, // Menggunakan nama kolom yang dikoreksi
   }, { transaction: t });

   // 5.3. SIMPAN DATA PEKERJAAN (member_employments)
   await MemberEmployment.create({
    member_id: checkMember.member_id,
    occupation: occupation,
    employer_name: employer_name,
    employer_address: employer_address,
   }, { transaction: t });

   // 5.4. SIMPAN EMERGENCY CONTACT (member_emergency_contacts)
   await MemberEmergencyContact.create({
    member_id: checkMember.member_id,
    contact_name: contact_name,
    phone_number: phone_number_emergency, // Menggunakan phone_number_emergency dari body
    relation: relation,
   }, { transaction: t });

   // 5.5. Update field is_registration_done dan data inti di tabel 'members'
   await Member.update(
    {
     is_registration_done: 1, // Tandai pendaftaran selesai
     nik_ktp: nik_ktp,
     full_name: full_name,
     member_type: tipeAnggota,
     phone_number: phone_number,
     email: email,
     // Alamat KTP dipetakan ke kolom 'address' di tabel members
     address: alamat_ktp,
    },
    { where: { member_id: checkMember.member_id }, transaction: t }
   );

   return newRegistration;
  });

  // *******************************************************************
  // 6. LOGIC NOTIFIKASI UNTUK ADMIN/PETUGAS
  // Kirim notifikasi ke semua user yang memiliki Role "Admin" atau "Petugas Registrasi"
  try {
   if (Notification && UserRole && MemberRoleAssignment) {
    const adminRoles = await UserRole.findAll({
     where: {
      role_name: { [db.Sequelize.Op.in]: ["Admin", "Petugas Registrasi"] },
     },
    });

    if (adminRoles.length > 0) {
     const adminRoleIds = adminRoles.map((role) => role.role_id);
     const adminAssignments = await MemberRoleAssignment.findAll({
      where: { role_id: { [db.Sequelize.Op.in]: adminRoleIds } },
     });

     const adminMemberIds = adminAssignments.map((assignment) => assignment.member_id);

     const notifications = adminMemberIds.map((targetMemberId) => {
      return {
       member_id: targetMemberId,
       title: "Registrasi Anggota Baru",
       message: `Pendaftaran anggota baru atas nama ${full_name} perlu diverifikasi dan disetujui.`,
       sent_datetime: new Date(),
       status: "SENT",
      };
     });

     await Notification.bulkCreate(notifications);
    }
   }
  } catch (notificationError) {
   console.error(
    "Gagal mengirim notifikasi:",
    notificationError.message
   );
  }
  // *******************************************************************


  // 7. Respon Sukses
  return res.status(201).json({
   status: true,
   message: "Pendaftaran anggota berhasil dikirim. Silakan tunggu proses verifikasi dokumen dan persetujuan.",
   data: {
    registration_id: result.registration_id,
    // Status akan menunjukkan PENDING (sesuai default di member_registrations.js)
    status: result.final_status,
   },
  });

 } catch (error) {
  console.error("Error saat submit pendaftaran:", error);

  // 8. Cleanup file jika terjadi error transaksi/validasi
  await Promise.all(
   tempPaths.map(async (publicPath) => {
    const fullPath = path.join(rootDir, "public", publicPath);
    if (fs.existsSync(fullPath)) {
     try {
      await unlinkAsync(fullPath);
     } catch (err) {
      console.error(
       `Gagal menghapus file sementara ${fullPath} setelah error DB:`,
       err
      );
     }
    }
   })
  );

  // 9. Kirim respons error
  return res.status(500).json({
   success: false,
   message: "Gagal memproses pendaftaran. Terjadi kesalahan pada server.",
   error: error.message,
  });
 }
};
export default submitRegistration;