import express from "express";
import { MidAnggota } from "../middleware/MidAnggota.js";
import {
  createSavingsApplication,
  getSavingsHistory,
  getSavingsDetail,
  getSavingsOptions,
  getSavingsSummary
} from "../controllers/savings/savingsController.js";

const router = express.Router();

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
 * Endpoint: GET /savings/:id
 * Digunakan untuk mengambil detail simpanan
 */
router.get("/:id", MidAnggota, getSavingsDetail);

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

export default router;
