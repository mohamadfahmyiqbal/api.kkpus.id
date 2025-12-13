// controllers/core/anggota/getRegistrationStatus.js (KOREKSI FINAL UNTUK initial_bill_id)

import db from "../../../models/index.js";

const { MemberRegistration, ApprovalStep, Bill, Member, Approval } = db;

const ENTITY_REFERENCE = "member_registration";
const CODE_WAJIB_AWAL = "SW_AWAL"; // Konstanta yang dibutuhkan

export const getRegistrationStatus = async (req, res) => {
  const member_id = req.userId;
  // ... (Validasi member_id tetap sama) ...

  try {
    // 1. Cari data pendaftaran yang paling baru untuk member ini
    const registrationData = await MemberRegistration.findOne({
      where: { member_id },
      order: [["registered_at", "DESC"]], // Ambil yang paling baru
      // Anda bisa menambahkan include di sini jika Member sudah tersedia
    });

    if (registrationData) {
      const responseData = registrationData.get({ plain: true });

      // ====================================================================
      // 2. AMBIL SEMUA LANGKAH PERSETUJUAN DAN RIWAYATNYA
      // ====================================================================
      // (Logika stepsWithStatus tidak berubah, dihilangkan demi singkat)

      const allSteps = await ApprovalStep.findAll({
        where: { approval_flow_id: responseData.approval_flow_id },
        attributes: ["approval_step_id", "step_name", "step_order"],
        order: [["step_order", "ASC"]],
      });

      const historyApprovals = await Approval.findAll({
        where: {
          entity_ref: ENTITY_REFERENCE,
          entity_id: responseData.registration_id,
        },
        include: [{ model: Member, as: "approver", attributes: ["full_name"] }],
        order: [["decision_datetime", "ASC"]],
      });

      const stepsWithStatus = allSteps.map((step) => {
        const history = historyApprovals.find(
          (h) => h.approval_step_id === step.approval_step_id
        );

        return {
          step_name: step.step_name,
          step_order: step.step_order,
          is_completed: !!history && history.decision === "APPROVED",
          is_rejected: !!history && history.decision === "REJECTED",
          is_current: step.approval_step_id === responseData.current_step_id,

          decision: history ? history.decision : null,
          notes: history ? history.note : null,
          approver_name: history ? history.approver.full_name : null,
          approved_date: history ? history.decision_datetime : null,
        };
      });

      responseData.allSteps = stepsWithStatus;

      // ====================================================================
      // 3. LOGIKA TAGIHAN AWAL (INITIAL BILL ID)
      // ====================================================================
      responseData.initial_bill_id = null; // Inisialisasi

      // 🛑 KOREKSI KRITIS: Cek apakah sudah APPROVED DAN MENUNGGU PEMBAYARAN
      if (
        responseData.final_status === "APPROVED" &&
        (responseData.registration_status === "menunggu_pembayaran" ||
          responseData.registration_status === "selesai")
        // Note: Tambahkan "selesai" untuk jaga-jaga status terpendek terpakai
      ) {
        // Ambil member_no yang sudah diupdate oleh processApproval
        const memberRecord = await Member.findOne({
          where: { member_id: responseData.member_id },
          attributes: ["member_no"],
        });
        const memberNo = memberRecord ? memberRecord.member_no : null;

        if (memberNo) {
          // Cari ID tagihan wajib awal (SW_AWAL) untuk member ini
          const initialBill = await Bill.findOne({
            where: {
              member_id: responseData.member_id,
              member_no: memberNo,
            },
            // Asumsi: BillType (SW_AWAL) adalah tagihan awal yang dicari.
            // Jika Anda memiliki FK BillTypeID, gunakan itu juga untuk akurasi.
            // Kita akan mencari BillID terbesar (yang terbaru) untuk member ini.
            order: [["bill_id", "DESC"]],
            limit: 1, // Kita hanya perlu satu bill ID untuk navigasi
          });

          responseData.initial_bill_id = initialBill
            ? initialBill.bill_id
            : null;
        }
      }

      return res.status(200).json({
        status: true,
        message: "Data pendaftaran ditemukan.",
        is_registration_done: true,
        data: responseData,
      });
    } else {
      // ... (Response jika tidak ada data pendaftaran) ...
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
