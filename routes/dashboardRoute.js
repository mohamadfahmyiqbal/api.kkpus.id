import express from "express";
import { MidAnggota } from "../middleware/MidAnggota.js";
import MidRole from "../middleware/MidRole.js";
import { getDashboard } from "../controllers/core/dashboard/getDashboard.js";
import { getAdminDashboard } from "../controllers/core/dashboard/getAdminDashboard.js";

const router = express.Router();

/**
 * Endpoint: GET /api/dashboard
 * Digunakan untuk mengambil data dashboard berdasarkan status keanggotaan
 */
router.get("/", MidAnggota, getDashboard);

/**
 * Endpoint: GET /api/dashboard/admin
 * Digunakan untuk mengambil ringkasan data admin
 */
router.get("/admin", MidAnggota, MidRole(['ADMIN', 'Ketua', 'Bendahara', 'Pengawas']), getAdminDashboard);

export default router;
