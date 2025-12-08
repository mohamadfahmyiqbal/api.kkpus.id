// src/routes/billingRoute.js

import express from "express";
import { MidAnggota } from "../midlleware/MidAnggota.js"; // Asumsi path middleware
import getPendingBills from "../controllers/content/billing/getPendingBills.js";

const router = express.Router();

// Semua rute tagihan memerlukan otorisasi anggota
// Biasanya, kita menggunakan MidAnggota untuk memverifikasi token
router.use("/tagihan", MidAnggota);

/**
 * Endpoint: GET /api/tagihan/list/pending
 * Digunakan oleh: UBilling.getPendingBills()
 * Fungsi: Mengambil daftar tagihan anggota yang belum dibayar.
 */
router.get("/tagihan/list/pending", getPendingBills);

// Anda dapat menambahkan rute lain di sini (misalnya POST /tagihan/pay)

export default router;
