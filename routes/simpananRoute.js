// src/routes/financialRoute.js
import express from "express";
import { MidAnggota } from "../midlleware/MidAnggota.js";
import { getSavingsHistory } from "../controllers/savings/getSavingsHistory.js"; // Pastikan .js bukan .jsx

const router = express.Router();

/**
 * Frontend memanggil: simpanan/riwayat
 * Jika app.use("/", router), maka path di sini harus "/simpanan/riwayat"
 */
router.get("/simpanan/riwayat", MidAnggota, getSavingsHistory);

export default router;
