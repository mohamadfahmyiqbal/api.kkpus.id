import express from "express";
import multer from "multer";
import { MidAnggota } from "../middleware/MidAnggota.js";
import MidRole from "../middleware/MidRole.js";
import {
  createSavingsApplication,
  getSavingsHistory,
  getSavingsDetail,
  getSavingsOptions,
  getSavingsSummary
} from "../controllers/savings/savingsController.js";

const router = express.Router();
const upload = multer();

/**
 * Endpoint: POST /savings/apply
 * Digunakan untuk mengajukan simpanan
 */
router.post("/apply", MidAnggota, createSavingsApplication);

/**
 * Endpoint: GET /savings/history
 * Digunakan untuk mengambil riwayat simpanan
 */
router.get("/history", MidAnggota, getSavingsHistory);

/**
 * Endpoint: GET /savings/options
 * Digunakan untuk mengambil opsi simpanan
 */
router.get("/options", MidAnggota, getSavingsOptions);

/**
 * Endpoint: GET /savings/summary
 * Digunakan untuk mengambil ringkasan simpanan
 */
router.get("/summary", MidAnggota, getSavingsSummary);

/**
 * Endpoint: GET /savings/admin-summary
 * Digunakan untuk admin mengambil total ringkasan simpanan semua anggota
 */
import { getAdminSavingsSummary } from "../controllers/savings/getAdminSavingsSummary.js";
import { getAdminSavingsTransactions } from "../controllers/savings/getAdminSavingsTransactions.js";
import { getAdminSavingsReport } from "../controllers/savings/getAdminSavingsReport.js";
import { importSimpanan } from "../controllers/savings/importSimpanan.js";
import { downloadTemplateSimpanan } from "../controllers/savings/downloadTemplateSimpanan.js";

router.get("/admin-summary", MidAnggota, MidRole(['Ketua', 'Bendahara', 'Pengawas']), getAdminSavingsSummary);
router.get("/admin-transactions", MidAnggota, MidRole(['Ketua', 'Bendahara', 'Pengawas']), getAdminSavingsTransactions);
router.get("/admin-report", MidAnggota, MidRole(['Ketua', 'Bendahara', 'Pengawas']), getAdminSavingsReport);

router.get("/template-import", downloadTemplateSimpanan);
router.post("/import", upload.single("file"), importSimpanan);

/**
 * Endpoint: GET /savings/:id
 * Digunakan untuk mengambil detail simpanan
 */
router.get("/:id", MidAnggota, getSavingsDetail);

export default router;
