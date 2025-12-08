// controllers/core/anggota/submitRegistration.js (Final Code dengan Perbaikan Import)

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
  ApprovalStep, // <-- Ini yang menyebabkan error jika undefined
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
  const submitterId = req.userId;

  const {
    nik_ktp,
    full_name: nama,
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
      member_name: nama,
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
    // LOGIKA NOTIFIKASI DINAMIS
    try {
      // Pengecekan eksplisit di dalam blok ini untuk menangkap error pada runtime
      if (!ApprovalStep) {
        throw new Error(
          "Model ApprovalStep tidak ditemukan di database object."
        );
      }

      const registrationId = newRegistration.registration_id;
      const applicantName = nama;
      const flowId = 2;

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

      // 2. Cari Member ID yang memiliki Role ID tersebut
      if (roleIdsToNotify.length > 0) {
        const assignments = await MemberRoleAssignment.findAll({
          where: { role_id: roleIdsToNotify },
          attributes: ["member_id"],
          raw: true,
        });

        const recipientMemberIds = [
          ...new Set(assignments.map((a) => a.member_id)),
        ];

        console.log(
          `[NOTIF DEBUG] Total Member ID Penerima ditemukan: ${recipientMemberIds.join(
            ", "
          )}`
        );

        // 3. Buat Notifikasi Massal
        if (recipientMemberIds.length > 0) {
          const notificationTitle = "Pendaftaran Anggota Baru";
          const notificationContent = `Anggota **${applicantName}** telah mengajukan pendaftaran (ID: ${registrationId}). Mohon segera diverifikasi.`;

          const notifications = recipientMemberIds.map((memberId) => ({
            member_id: memberId,
            title: notificationTitle,
            content: notificationContent,
            sent_datetime: new Date(),
            status: "unread",
          }));

          await Notification.bulkCreate(notifications);
          console.log(
            `Notifikasi pendaftaran baru berhasil dikirim ke ${notifications.length} admin/pengurus.`
          );
        }
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
