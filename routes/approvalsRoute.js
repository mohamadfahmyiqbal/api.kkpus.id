// routes/approvalsRoute.js

import express from "express";
// Import Controller approval dengan nama baru
import approveByPengawas from "../controllers/core/approvals/approveByPengawas.js";
import approveByKetua from "../controllers/core/approvals/approveByKetua.js";
// Asumsi: import middleware otorisasi Anda di sini jika diperlukan
// import { verifyToken, verifyRole } from '../midlleware/MidAnggota.js';

const router = express.Router();

/**
 * --- Rute Khusus Persetujuan (Approval) Anggota ---
 * Rute ini HARUS dilindungi (protected) oleh middleware otorisasi.
 * Contoh otorisasi diberikan dalam komentar.
 */

// 1. ROUTE: Approval oleh Pengawas
router.put(
  "/anggota/approval/pengawas/:registrationId",
  // Tambahkan middleware otorisasi Pengawas di sini
  // verifyToken, verifyRole('Pengawas'),
  approveByPengawas
);

// 2. ROUTE: Approval oleh Ketua
router.put(
  "/anggota/approval/ketua/:registrationId",
  // Tambahkan middleware otorisasi Ketua di sini
  // verifyToken, verifyRole('Ketua'),
  approveByKetua
);

export default router;
