import express from "express";
import multer from "multer";
import { MidAnggota } from "../middleware/MidAnggota.js";
import {
  createTransaction,
  getTransactionHistory,
  getTransactionDetail,
  getTransactionOptions,
  getJualBeliReport
} from "../controllers/jualbeli/jualbeliController.js";
import { importJualBeli } from "../controllers/jualbeli/importJualBeli.js";
import { downloadTemplateJualBeli } from "../controllers/jualbeli/downloadTemplateJualBeli.js";
import { downloadTemplateCicilanJualBeli } from "../controllers/jualbeli/downloadTemplateCicilanJualBeli.js";
import { importCicilanJualBeli } from "../controllers/jualbeli/importCicilanJualBeli.js";

const router = express.Router();
const upload = multer();

/**
 * Endpoint: GET /jualbeli/report
 * Digunakan untuk mengambil laporan agregasi jual beli
 */
router.get("/report", MidAnggota, getJualBeliReport);

/**
 * Endpoint: POST /transaction/create
 * Digunakan untuk membuat transaksi umum
 */
router.post("/create", MidAnggota, createTransaction);

/**
 * Endpoint: GET /transaction/history
 * Digunakan untuk mengambil riwayat transaksi
 */
router.get("/history", MidAnggota, getTransactionHistory);

/**
 * Import Endpoints - Master Jual Beli
 */
router.get("/template-import", downloadTemplateJualBeli);
router.post("/import", upload.single("file"), importJualBeli);

/**
 * Import Endpoints - Riwayat Cicilan Jual Beli (Opsi B)
 */
router.get("/template-import-cicilan", downloadTemplateCicilanJualBeli);
router.post("/import-cicilan", upload.single("file"), importCicilanJualBeli);

/**
 * Endpoint: GET /transaction/:id
 * Digunakan untuk mengambil detail transaksi
 */
router.get("/:id", MidAnggota, getTransactionDetail);

export default router;
