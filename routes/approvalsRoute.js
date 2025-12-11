// 📁 routes/approvalsRoute.js (KODE FINAL)

import express from "express";
// Import Controllers
import { approveByPengawas } from "../controllers/core/approvals/approveByPengawas.js";
import { approveByKetua } from "../controllers/core/approvals/approveByKetua.js";

// Import Middlewares
import { MidAnggota } from "../midlleware/MidAnggota.js"; // Untuk req.userId
import MidRole from "../midlleware/MidRole.js"; // Untuk otorisasi peran

const router = express.Router();

/**
 * --- Rute Khusus Persetujuan (Approval) Anggota ---
 * Rute ini DILINDUNGI (protected) oleh middleware otorisasi.
 */

// 1. ROUTE: Approval oleh Pengawas
router.put(
  "/anggota/approval/pengawas/:registrationId",
  MidAnggota, // 1. Wajib Login
  MidRole(["Pengawas"]), // 2. Wajib Role Pengawas
  approveByPengawas
);

// 2. ROUTE: Approval oleh Ketua
router.put(
  "/anggota/approval/ketua/:registrationId",
  MidAnggota, // 1. Wajib Login
  MidRole(["Ketua"]), // 2. Wajib Role Ketua
  approveByKetua
);

export default router;

// 💡 Jangan lupa daftarkan router ini di file utama Express Anda (misalnya app.js)
// Contoh: app.use('/', approvalsRoute);
