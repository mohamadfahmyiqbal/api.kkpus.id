// controllers/core/anggota/getRegistrationStatus.js

import db from "../../../models/index.js";

// 🚨 FIX: Import model Member dan Bill
const { MemberRegistration, ApprovalStep, Bill, Member } = db;

/**
 * Kontroler untuk mendapatkan status dan data pendaftaran anggota.
 * Endpoint: GET /anggota/registration/status (Membutuhkan MidAnggota)
 */
export const getRegistrationStatus = async (req, res) => {
 // Asumsi member_id sudah disuntikkan oleh MidAnggota.js
 const member_id = req.userId;

 if (!member_id) {
  return res.status(400).json({
   success: false,
   message: "member_id tidak ditemukan. Middleware gagal.",
  });
 }

 try {
  // 1. Cari data pendaftaran yang paling baru untuk member ini
  const registrationData = await MemberRegistration.findOne({
   where: { member_id },
   // Ambil data langkah persetujuan saat ini (currentStep)
   include: [
    {
     model: ApprovalStep,
     as: "currentStep",
     attributes: ["step_name", "step_order"],
    },
   ],
   order: [["createdAt", "DESC"]], // Ambil yang terbaru
  });

  if (registrationData) {

   // 🚨 NEW: 2. Cek status dan cari initial bill_id jika sudah disetujui penuh.
   if (registrationData.final_status === 'APPROVED' && registrationData.registration_status === 'aktif') {

    // 2a. Ambil member_no dari tabel Member
    const memberRecord = await Member.findOne({
     where: { member_id: member_id },
     attributes: ['member_no'],
    });

    const memberNo = memberRecord ? memberRecord.member_no : null;

    if (memberNo) {
     // 2b. Cari Tagihan Awal Pendaftaran (Setoran Wajib) yang statusnya PENDING
     const initialBill = await Bill.findOne({
      where: {
       member_no: memberNo, // 🚨 FIX: Gunakan member_no dari tabel Member
       status: 'PENDING',
       // 🚨 FIX: Gunakan deskripsi spesifik tagihan awal dari data mock Anda
       description: 'Setoran Wajib/Pangkal Pendaftaran Anggota',
      },
      attributes: ['bill_id'],
      order: [['createdAt', 'ASC']] // Ambil yang paling awal
     });

     if (initialBill) {
      // Tambahkan bill_id ke objek data yang akan dikirim ke frontend
      registrationData.dataValues.initial_bill_id = initialBill.bill_id;
     } else {
      // Jika tagihan awal tidak ditemukan (misalnya sudah dibayar)
      registrationData.dataValues.initial_bill_id = null;
     }
    } else {
     console.warn(`[getRegStatus] Peringatan: Member ID ${member_id} sudah APPROVED & aktif, tetapi member_no tidak ditemukan di tabel Member.`);
     registrationData.dataValues.initial_bill_id = null;
    }
   }

   // Data pendaftaran ditemukan
   return res.status(200).json({
    status: true,
    message: "Data pendaftaran ditemukan.",
    is_registration_done: true,
    // Mengirim objek data termasuk currentStep dan initial_bill_id
    data: registrationData,
   });
  } else {
   // Belum ada data pendaftaran
   return res.status(200).json({
    status: true,
    message: "Member belum mengajukan pendaftaran.",
    is_registration_done: false,
    data: null,
   });
  }
 } catch (error) {
  console.error("Error fetching registration status:", error);
  return res.status(500).json({
   status: false,
   message: "Terjadi kesalahan server saat mengambil status pendaftaran.",
   error: error.message,
  });
 }
};

export default getRegistrationStatus;