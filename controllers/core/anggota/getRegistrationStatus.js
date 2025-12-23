// controllers/core/anggota/getRegistrationStatus.js (KOREKSI DAN OPTIMASI FINAL)

import db from "../../../models/index.js";
import { Op } from "sequelize"; // Impor Op untuk operasi pencarian

// ✅ KOREKSI 1: Tambahkan BillType ke daftar model yang diimpor
const { MemberRegistration, ApprovalStep, Bill, Member, Approval, BillType } =
  db;

const ENTITY_REFERENCE = "member_registration";
const CODE_WAJIB_AWAL = "SW_POKOK"; // Konstanta yang dibutuhkan (misal: Simpanan Wajib Awal)

export const getRegistrationStatus = async (req, res) => {
  const member_id = req.userId;

  // 0. Validasi Input
  if (!member_id) {
    return res.status(400).json({
      status: false,
      message: "ID Anggota (memberId) tidak ditemukan atau tidak valid.",
    });
  }

  try {
    // 1. Cari data pendaftaran yang paling baru untuk member ini
    const registrationData = await MemberRegistration.findOne({
      where: { member_id },
      order: [["registered_at", "DESC"]], // Ambil yang paling baru
      // Catatan: Jika MemberRegistration memiliki FK ke Bill, lebih baik di-include di sini.
    });

    if (!registrationData) {
      // Jika belum pernah mendaftar
      return res.status(200).json({
        status: true,
        message: "Belum ada data pendaftaran.",
        is_registration_done: false,
        data: null,
      });
    }

    const responseData = registrationData.get({ plain: true });
    const registrationId = responseData.registration_id;

    // ====================================================================
    // 2. AMBIL LANGKAH PERSETUJUAN DAN RIWAYATNYA (Gunakan Promise.all untuk konkurensi)
    // ====================================================================
    const [allSteps, historyApprovals] = await Promise.all([
      ApprovalStep.findAll({
        where: { approval_flow_id: responseData.approval_flow_id },
        attributes: ["approval_step_id", "step_name", "step_order"],
        order: [["step_order", "ASC"]],
      }),
      Approval.findAll({
        where: {
          entity_ref: ENTITY_REFERENCE,
          entity_id: registrationId,
        },
        // EAGER LOAD: Langsung ambil nama approver di sini
        include: [{ model: Member, as: "approver", attributes: ["full_name"] }],
        order: [["decision_datetime", "ASC"]],
      }),
    ]);

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

    // Asumsi: isPengawasApproved & isKetuaApproved digunakan di frontend
    responseData.isPengawasApproved = stepsWithStatus.some(
      (s) => s.step_name === "Pengawas" && s.decision === "APPROVED"
    );
    responseData.isKetuaApproved = stepsWithStatus.some(
      (s) => s.step_name === "Ketua" && s.decision === "APPROVED"
    );

    // ====================================================================
    // 3. LOGIKA TAGIHAN AWAL (INITIAL BILL ID)
    // ====================================================================
    responseData.initial_bill_id = null; // Inisialisasi

    // Kriteria: Jika sudah di-APPROVED penuh DAN status pendaftaran menunggu/sudah bayar
    if (
      responseData.final_status === "APPROVED" &&
      (responseData.registration_status === "menunggu_pembayaran" ||
        responseData.registration_status === "selesai")
    ) {
      // 🚀 OPTIMASI & KOREKSI: Cari Bill dengan JOIN ke BillType
      const initialBill = await Bill.findOne({
        where: {
          member_id: responseData.member_id,
        },
        // ✅ KOREKSI 2: Gunakan INCLUDE (JOIN) untuk filter kode tagihan
        include: [
          {
            model: BillType, // Asumsi nama asosiasi adalah BillType
            as: "billType",
            required: true, // Wajib ada (INNER JOIN)
            where: {
              type_code: CODE_WAJIB_AWAL, // Filter kode tagihan di tabel BillType
            },
            attributes: [], // Tidak perlu mengambil kolom dari BillType
          },
        ],
        order: [["createdAt", "DESC"]], // Ambil yang terbaru dari jenis ini
        limit: 1,
      });

      responseData.initial_bill_id = initialBill ? initialBill.bill_id : null;
    }

    return res.status(200).json({
      status: true,
      message: "Data pendaftaran ditemukan.",
      is_registration_done: true,
      data: responseData,
    });
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
