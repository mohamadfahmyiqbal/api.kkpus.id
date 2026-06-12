import express from "express";
import { MidAnggota } from "../middleware/MidAnggota.js";
import {
  createTransaction,
  getTransactionHistory,
  getTransactionDetail,
  getTransactionOptions
} from "../controllers/jualbeli/jualbeliController.js";

const router = express.Router();

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

export default router;
