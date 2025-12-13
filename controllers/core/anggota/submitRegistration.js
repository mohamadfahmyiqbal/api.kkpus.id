// controllers/core/anggota/submitRegistration.js (FINAL DENGAN PENGAMBILAN ID APPROVAL DINAMIS)

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
  ApprovalFlow, // ✅ Tambah: Untuk mendapatkan Flow ID
  ApprovalStep, // ✅ Tambah: Untuk mendapatkan Step ID dan Role ID awal
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

  // Menghindari konflik dengan menambahkan timestamp
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
    // Data Kontak Darurat
    contact_name,
    phone_number_emergency,
    relation,
    // Data Bank
    bank_name,
    bank_account_no,
    account_holder,
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

    // 4. ** LOGIC APPROVAL: Tentukan Flow ID dan Step ID Awal secara DINAMIS **
    const FLOW_NAME = "Pendaftaran Anggota"; // Sesuai data approval_flows

    const registrationFlow = await ApprovalFlow.findOne({
      where: { flow_name: FLOW_NAME },
    });

    if (!registrationFlow) {
      // Jika flow tidak ditemukan, proses harus dihentikan
      throw new Error(
        `Konfigurasi Flow Persetujuan '${FLOW_NAME}' tidak ditemukan di database.`
      );
    }

    // Cari langkah pertama (step_order terendah) dari flow yang ditemukan
    const initialStep = await ApprovalStep.findOne({
      where: { approval_flow_id: registrationFlow.approval_flow_id },
      order: [["step_order", "ASC"]], // Mengambil langkah dengan step_order terendah
    });

    if (!initialStep) {
      throw new Error(
        "Langkah awal persetujuan tidak ditemukan untuk flow ini. Pastikan step_order sudah disetel."
      );
    }

    const REGISTRATION_APPROVAL_FLOW_ID = registrationFlow.approval_flow_id;
    const INITIAL_APPROVAL_STEP_ID = initialStep.approval_step_id;

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
          // ✅ TAMBAHKAN FIELD APPROVAL DINAMIS
          approval_flow_id: REGISTRATION_APPROVAL_FLOW_ID,
          current_step_id: INITIAL_APPROVAL_STEP_ID,
          registration_status: "verifikasi_dokumen", // Status awal ENUM
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
    // 6. LOGIC NOTIFIKASI BARU (Setelah Transaksi Utama Sukses)
    try {
      if (Notification && ApprovalStep && UserRole && MemberRoleAssignment) {
        const finalNotifications = [];

        // 6.1. NOTIFIKASI UNTUK MEMBER SENDIRI (Pendaftar)
        finalNotifications.push({
          member_id: member_id, // ID Anggota yang submit pendaftaran
          title: "Pendaftaran Berhasil Dikirim",
          content:
            "Pendaftaran Anda telah berhasil dikirim dan akan segera diproses oleh tim kami.",
          sent_datetime: new Date(),
          status: "SENT",
        });

        // 6.2. NOTIFIKASI UNTUK PETUGAS YANG BERTANGGUNG JAWAB PADA LANGKAH AWAL

        // ✅ MENGGUNAKAN ROLE_ID DARI LANGKAH AWAL YANG SUDAH DIAMBIL
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

          const roleName = roleInfo ? roleInfo.role_name : "Petugas Verifikasi";

          const approverNotifications = approverMemberIds.map(
            (targetMemberId) => {
              return {
                member_id: targetMemberId,
                title: "TUGAS BARU: Verifikasi Pendaftaran",
                content: `Pendaftaran anggota baru atas nama ${full_name} membutuhkan persetujuan/verifikasi Anda sebagai ${roleName}.`,
                sent_datetime: new Date(),
                status: "SENT",
              };
            }
          );

          finalNotifications.push(...approverNotifications);
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
