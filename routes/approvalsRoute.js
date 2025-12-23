import express from "express";
import { processApproval } from "../controllers/core/approvals/processApproval.js";
import { disburseWithdrawal } from "../controllers/savings/disburseWithdrawal.js"; // Controller baru untuk Bendahara

import { MidAnggota } from "../midlleware/MidAnggota.js";
import MidRole from "../midlleware/MidRole.js";

const router = express.Router();

// --- KONSTANTA FLOW ---
const FLOW_MEMBER_REG = 'member_registration';
const FLOW_SAVINGS_WD = 'savings_withdrawal';

// ID STEP BERDASARKAN TABEL ANDA
const STEP_REG_PENGWAS = 1;
const STEP_REG_KETUA = 2;
const STEP_WD_PENGWAS = 13; // Sesuai data tabel approval_steps Anda
const STEP_WD_KETUA = 14;    // Sesuai data tabel approval_steps Anda

// ==========================================
// 1. ALUR PENDAFTARAN ANGGOTA
// ==========================================
router.put(
  "/pendaftaran/approval/pengawas/:entityId",
  MidAnggota, MidRole(["Pengawas"]),
  processApproval(FLOW_MEMBER_REG, STEP_REG_PENGWAS)
);

router.put(
  "/pendaftaran/approval/ketua/:entityId",
  MidAnggota, MidRole(["Ketua"]),
  processApproval(FLOW_MEMBER_REG, STEP_REG_KETUA)
);

// ==========================================
// 2. ALUR PENARIKAN SIMPANAN (Savings Withdrawal)
// ==========================================

// STEP 1: Pengawas (Update status ke Ketua)
router.put(
  "/penarikan/approval/pengawas/:entityId",
  MidAnggota, MidRole(["Pengawas"]),
  processApproval(FLOW_SAVINGS_WD, STEP_WD_PENGWAS)
);

// STEP 2: Ketua (Update status ke APPROVED/Siap Bayar)
router.put(
  "/penarikan/approval/ketua/:entityId",
  MidAnggota, MidRole(["Ketua"]),
  processApproval(FLOW_SAVINGS_WD, STEP_WD_KETUA)
);

// STEP 3: Bendahara (Eksekusi Bayar & Potong Saldo)
// Gunakan POST atau PUT sesuai selera, di sini menggunakan withdrawal_id
router.post(
  "/penarikan/pembayaran/:withdrawal_id",
  MidAnggota, MidRole(["Bendahara"]),
  disburseWithdrawal 
);

export default router;