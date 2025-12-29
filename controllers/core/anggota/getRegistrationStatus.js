// controllers/core/anggota/getRegistrationStatus.js
import db from "../../../models/index.js";
import fs from "fs"; // Tambahkan fs untuk membaca file
import path from "path";

const { MemberRegistration, ApprovalStep, Bill, Member, Approval, BillType } = db;
const __dirname = path.resolve();

export const getRegistrationStatus = async (req, res) => {
  const member_id = req.userId;

  try {
    const registrationData = await MemberRegistration.findOne({
      where: { member_id },
      order: [["registered_at", "DESC"]],
    });

    if (!registrationData) {
      return res.status(200).json({ status: true, is_registration_done: false, data: null });
    }

    const responseData = registrationData.get({ plain: true });

    // --- LOGIKA BASE64 START ---
    const convertToBase64 = (filePath) => {
      try {
        if (!filePath) return null;
        // Gabungkan path dasar server dengan path yang ada di DB
        // Menghilangkan '/' di awal jika ada agar path.join bekerja benar
        const fullPath = path.join(__dirname, filePath);
        
        if (fs.existsSync(fullPath)) {
          const bitmap = fs.readFileSync(fullPath);
          const extension = path.extname(fullPath).replace(".", "");
          return `data:image/${extension};base64,${bitmap.toString("base64")}`;
        }
        return null;
      } catch (err) {
        console.error("Gagal convert Base64:", err);
        return null;
      }
    };

    // Ganti path dengan data Base64
    responseData.ktp_photo_base64 = convertToBase64(responseData.ktp_photo_path);
    responseData.selfie_photo_base64 = convertToBase64(responseData.selfie_photo_path);
    // --- LOGIKA BASE64 END ---

    // (Sisa kode ambil steps dan bill tetap sama seperti sebelumnya...)
    // ...
    
    return res.status(200).json({
      status: true,
      data: responseData,
    });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};