// controllers/core/anggota/submitRegistration.js (FINAL DENGAN APPROVAL DAN NOTIFIKASI REVISI)

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
  ApprovalStep, // <-- Model ini WAJIB diimpor untuk mendapatkan role_id dari step
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
  const member_id = req.userId;
  // 1. Destructuring semua data yang dikirim dari frontend
  const {
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
      // Baris ini sekarang seharusnya tidak pernah tercapai jika MidAnggota berjalan
      return res.status(400).json({
        success: false,
        message: "member_id tidak ditemukan (Middleware gagal).",
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
    const ktpPublicPath = saveBase64Image(foto_ktp, nik_ktp, "ktp");
    tempPaths.push(ktpPublicPath);

    const swafotoPublicPath = saveBase64Image(foto_swafoto, nik_ktp, "swafoto");
    tempPaths.push(swafotoPublicPath);

    // 4. ** LOGIC APPROVAL BARU: Tentukan Flow ID dan Step ID Awal **
    const REGISTRATION_APPROVAL_FLOW_ID = 2; // ID Flow Pendaftaran Anggota (sesuai data DB)
    const INITIAL_APPROVAL_STEP_ID = 1; // ID Step awal (e.g., Verifikasi Dokumen)

    // 5. Simpan semua data ke DB dalam satu transaksi (untuk atomisitas)
    const result = await db.sequelize.transaction(async (t) => {
      // 5.1. SIMPAN DATA REGISTRASI (member_registrations)
      newRegistration = await MemberRegistration.create(
        {
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
          registration_status: "verifikasi_dokumen", // Pastikan status awal diisi
          final_status: "PENDING",
        },
        { transaction: t }
      );

      // 5.2. SIMPAN DATA BANK (member_bank_accounts)
      await MemberBankAccount.create(
        {
          member_id: checkMember.member_id,
          bank_name: bank_name,
          bank_account_no: bank_account_no,
          account_holder: account_holder,
        },
        { transaction: t }
      );

      // 5.3. SIMPAN DATA PEKERJAAN (member_employments)
      await MemberEmployment.create(
        {
          member_id: checkMember.member_id,
          occupation: occupation,
          employer_name: employer_name,
          employer_address: employer_address,
        },
        { transaction: t }
      );

      // 5.4. SIMPAN EMERGENCY CONTACT (member_emergency_contacts)
      await MemberEmergencyContact.create(
        {
          member_id: checkMember.member_id,
          contact_name: contact_name,
          phone_number: phone_number_emergency,
          relation: relation,
        },
        { transaction: t }
      );

      // 5.5. Update field is_registration_done dan data inti di tabel 'members'
      await Member.update(
        {
          is_registration_done: 1, // Tandai pendaftaran selesai
          nik_ktp: nik_ktp,
          full_name: full_name,
          member_type: tipeAnggota,
          phone_number: phone_number,
          email: email,
          address: alamat_ktp,
        },
        { where: { member_id: checkMember.member_id }, transaction: t }
      );

      return newRegistration;
    });

    // *******************************************************************
    // 6. LOGIC NOTIFIKASI BARU (Untuk Pendaftar dan Petugas Sesuai Role Step Awal)
    try {
      if (Notification && ApprovalStep && UserRole && MemberRoleAssignment) {
        const finalNotifications = [];

        // 6.1. NOTIFIKASI UNTUK MEMBER SENDIRI (Pendaftar)
        finalNotifications.push({
          member_id: member_id, // ID Anggota yang submit pendaftaran
          title: "Pendaftaran Berhasil Dikirim",
          // Menggunakan 'content' sesuai skema database
          content:
            "Pendaftaran Anda telah berhasil dikirim dan akan segera diproses oleh tim kami.",
          sent_datetime: new Date(),
          status: "SENT",
        });

        // 6.2. NOTIFIKASI UNTUK PETUGAS YANG BERTANGGUNG JAWAB PADA LANGKAH AWAL

        // Ambil Role ID dari Langkah Persetujuan Awal
        const initialStep = await ApprovalStep.findOne({
          where: { approval_step_id: INITIAL_APPROVAL_STEP_ID },
          attributes: ["role_id"],
        });

        if (initialStep && initialStep.role_id) {
          const requiredRoleId = initialStep.role_id;

          // Cari semua member yang memiliki Role ID tersebut
          const targetApprovers = await MemberRoleAssignment.findAll({
            where: { role_id: requiredRoleId },
          });

          if (targetApprovers.length > 0) {
            const approverMemberIds = targetApprovers.map(
              (assignment) => assignment.member_id
            );

            // Cari nama role untuk dimasukkan ke notifikasi
            const roleInfo = await UserRole.findOne({
              where: { role_id: requiredRoleId },
              attributes: ["role_name"],
            });

            const roleName = roleInfo
              ? roleInfo.role_name
              : "Petugas Verifikasi";

            const approverNotifications = approverMemberIds.map(
              (targetMemberId) => {
                return {
                  member_id: targetMemberId,
                  title: "TUGAS BARU: Verifikasi Pendaftaran",
                  // Menggunakan 'content' sesuai skema database
                  content: `Pendaftaran anggota baru atas nama ${full_name} membutuhkan persetujuan/verifikasi Anda sebagai ${roleName}.`,
                  sent_datetime: new Date(),
                  status: "SENT",
                };
              }
            );

            finalNotifications.push(...approverNotifications);
          }
        }

        // Kirim semua notifikasi
        if (finalNotifications.length > 0) {
          await Notification.bulkCreate(finalNotifications);
        }
      }
    } catch (notificationError) {
      console.error("Gagal mengirim notifikasi:", notificationError.message);
    }
    // *******************************************************************

    // 7. Respon Sukses
    return res.status(201).json({
      status: true,
      message:
        "Pendaftaran anggota berhasil dikirim. Silakan tunggu proses verifikasi dokumen dan persetujuan.",
      data: {
        registration_id: result.registration_id,
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
