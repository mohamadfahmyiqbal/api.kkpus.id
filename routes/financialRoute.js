// src/routes/financialRoute.js
import express from "express";
import { MidAnggota } from "../midlleware/MidAnggota.js";
// Pastikan path controller ini sesuai dengan struktur folder Anda
import { getFinancialSummary } from "../controllers/content/financial/getFinancialSummary.js";

const router = express.Router();

/**
 * Endpoint: GET /financial/summary
 * Digunakan oleh: FinancialSection.jsx
 */
router.get("/financial/summary", MidAnggota, getFinancialSummary);
export default router;
