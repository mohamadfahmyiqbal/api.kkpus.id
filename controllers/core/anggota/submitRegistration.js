// controllers/core/anggota/submitRegistration.js (Final Code dengan Koreksi Model)

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../../../models/index.js";
import util from "util";

// 💡 PASTIKAN NAMA MODEL SESUAI DENGAN EKSPOR DI index.js!
const {
 MemberRegistration,
 UserRole,
 MemberRoleAssignment,
 Notification,
 ApprovalStep, // <-- Model untuk Approval Flow
} = db;

const __filename = fileURLToPath(import.meta.url);
const currentDir = path.dirname(__filename);
const rootDir = path.join(currentDir, "..", "..", "..");

const unlinkAsync = util.promisify(fs.unlink);

const saveBase64Image = (base64Image, nik, fileType) => {
 if (typeof base64Image !== "string" || base64Image.length === 0) {
  throw new Error(`Invalid or empty Base64 string for ${fileType}.`);
 }

 const parts = base64Image.match(/^data:(image\/[a-zA-Z]+);base64,(.*)$/);

 if (!parts || parts.length !== 3) {
  throw new Error("Format Base64 foto tidak valid.");
 }

 const mimeType = parts[1];
 const base64Data = parts[2];
 const extension = mimeType.split("/")[1];

 if (!["jpeg", "png", "jpg"].includes(extension.toLowerCase())) {
  throw new Error(`Tipe file ${mimeType} tidak diizinkan.`);
 }

 const dir = path.join(rootDir, "uploads", fileType);
 if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
 }

 const filename = `${nik}-${fileType}-${Date.now()}.${extension}`;
 const fullPath = path.join(dir, filename);

 fs.writeFileSync(fullPath, base64Data, "base64");

 return path.join("uploads", fileType, filename).replace(/\\/g, "/");
};

const submitRegistration = async (req, res) => {
 // ID dari member yang melakukan submit (misalnya dari token JWT)
 const submitterId = req.userId;
console.log(req.body);

 const {
  nik_ktp,
  full_name: nama, // Sudah sesuai dengan model
  alamat_ktp: alamat,
  tipeAnggota: tipe_anggota,
  phone_number: no_tlp,
  email,
  foto_ktp: fotoKtpBase64,
  foto_swafoto: fotoSwafotoBase64,
  bank_name: nama_bank,
  account_number: no_rekening,
  account_holder_name: nama_pemilik_rek,
 } = req.body;

 const tempPaths = [];

 try {
  const fotoKtpPath = saveBase64Image(fotoKtpBase64, nik_ktp, "ktp");
  tempPaths.push(fotoKtpPath);

  const fotoSwafotoPath = saveBase64Image(
   fotoSwafotoBase64,
   nik_ktp,
   "swafoto"
  );
  tempPaths.push(fotoSwafotoPath);

  const newRegistration = await MemberRegistration.create({
   member_id: submitterId, 
   nik_ktp: nik_ktp,
   // KOREKSI: Menggunakan 'full_name' sesuai model baru
   full_name: nama, 
   address_ktp: alamat,
   member_type: tipe_anggota,
   phone_number: no_tlp,
   email: email,
   ktp_photo_path: fotoKtpPath,
   selfie_photo_path: fotoSwafotoPath,
   bank_name: nama_bank,
   account_number: no_rekening,
   account_holder_name: nama_pemilik_rek,
   registration_date: new Date(),
   approval_flow_id: 2,
   current_step_id: 1,
   final_status: "PENDING",
   registration_status: "verifikasi_dokumen",
  });

  // *******************************************************************
  // LOGIKA NOTIFIKASI DINAMIS (Tidak diubah, karena sudah benar)
  try {
   if (!ApprovalStep) {
    throw new Error(
     "Model ApprovalStep tidak ditemukan di database object."
    );
   }

   const registrationId = newRegistration.registration_id;
   const applicantName = nama;
   const flowId = 2;
   const applicantMemberId = submitterId; // ID Pendaftar

   // 1. Dapatkan semua Role ID yang terlibat dalam Flow ID 2
   const steps = await ApprovalStep.findAll({
    where: { approval_flow_id: flowId },
    attributes: ["role_id"],
    raw: true,
   });

   const roleIdsToNotify = steps
    .map((s) => s.role_id)
    .filter((id) => id !== null);

   console.log(
    `[NOTIF DEBUG] Total Role ID dalam Flow ${flowId} ditemukan: ${roleIdsToNotify.join(
     ", "
    )}`
   );

   // 2. Cari Member ID yang memiliki Role ID tersebut (Admin/Pengawas)
   let allRecipientIds = [];
   if (roleIdsToNotify.length > 0) {
    const assignments = await MemberRoleAssignment.findAll({
     where: { role_id: roleIdsToNotify },
     attributes: ["member_id"],
     raw: true,
    });

    allRecipientIds = assignments.map((a) => a.member_id);
   }

   // 3. Gabungkan Penerima: Admin/Pengawas + Pendaftar
   if (applicantMemberId) {
    allRecipientIds.push(applicantMemberId);
   }
   // Hapus duplikasi
   allRecipientIds = [...new Set(allRecipientIds)];

   console.log(
    `[NOTIF DEBUG] Total Member ID Penerima (Admin + Pendaftar) ditemukan: ${allRecipientIds.join(
     ", "
    )}`
   );

   // 4. Buat Notifikasi Massal
   if (allRecipientIds.length > 0) {
    const adminTitle = "Pendaftaran Anggota Baru";
    const adminContent = `Anggota **${applicantName}** telah mengajukan pendaftaran (ID: ${registrationId}). Mohon segera diverifikasi.`;

    const userTitle = "Pendaftaran Diterima";
    const userContent = `Terima kasih, pendaftaran Anda dengan ID ${registrationId} telah berhasil disubmit dan sedang menunggu proses verifikasi dokumen.`;


    const notifications = allRecipientIds.map((memberId) => {
     let title = adminTitle;
     let content = adminContent;

     // Jika penerima adalah Pendaftar, gunakan pesan yang berbeda
     if (memberId === applicantMemberId) {
      title = userTitle;
      content = userContent;
     }

     return {
      member_id: memberId,
      title: title,
      content: content,
      sent_datetime: new Date(),
      status: "unread", 
     };
    });

    await Notification.bulkCreate(notifications);
    console.log(
     `Notifikasi pendaftaran baru berhasil dikirim ke ${notifications.length} penerima (Admin/Pengurus dan Pendaftar).`
    );
   }
  } catch (notificationError) {
   console.error(
    "Gagal mengirim notifikasi (PASTIKAN ApprovalStep di index.js sudah benar):",
    notificationError.message
   );
   // Lanjutkan proses, jangan batalkan registrasi
  }
  // *******************************************************************

  // 5. Respon Sukses
  return res.status(201).json({
   status: true,
   message:
    "Pendaftaran anggota berhasil dikirim. Menunggu proses verifikasi.",
   data: {
    registration_id: newRegistration.registration_id,
    status: newRegistration.final_status,
   },
  });
 } catch (error) {
  console.error("Error saat submit pendaftaran:", error);

  // Cleanup file
  await Promise.all(
   tempPaths.map(async (publicPath) => {
    const fullPath = path.join(rootDir, publicPath);
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

  return res.status(500).json({
   status: false,
   message: error.message.includes("Base64")
    ? error.message
    : "Gagal menyimpan data pendaftaran. Silakan coba lagi.",
   error: error.message,
  });
 }
};

export default submitRegistration;