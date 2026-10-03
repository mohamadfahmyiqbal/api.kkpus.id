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
 * Endpoint: GET /transaction/:id
 * Digunakan untuk mengambil detail transaksi
 */
router.get("/:id", MidAnggota, getTransactionDetail);

/**
 * Endpoint: GET /transaction/options
 * Digunakan untuk mengambil opsi transaksi
 */
router.get("/options", MidAnggota, getTransactionOptions);

/**
 * Import Endpoints
 */
router.get("/template-import", downloadTemplateJualBeli);
router.post("/import", upload.single("file"), importJualBeli);

export default router;
