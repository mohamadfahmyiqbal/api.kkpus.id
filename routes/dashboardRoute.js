import express from "express";
import { MidAnggota } from "../middleware/MidAnggota.js";
import { getDashboard } from "../controllers/core/dashboard/getDashboard.js";

const router = express.Router();

/**
 * Endpoint: GET /api/dashboard
 * Digunakan untuk mengambil data dashboard berdasarkan status keanggotaan
 */
router.get("/", MidAnggota, getDashboard);

export default router;
