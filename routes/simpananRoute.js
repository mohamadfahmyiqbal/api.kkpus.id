// src/routes/savingsRoutes.js
import express from "express";
import { MidAnggota } from "../middleware/MidAnggota.js";
import { getSavingsHistory } from "../controllers/savings/getSavingsHistory.js";
import requestWithdrawal from "../controllers/savings/requestWithdrawal.js";
import { getSavingsProducts } from "../controllers/savings/getSavingsProducts.js";
import { getAccountDetail } from "../controllers/savings/getAccountDetail.js";
import { getTransactionDetail } from "../controllers/savings/getTransactionDetail.js";
import { getWithdrawalDetail } from "../controllers/savings/getWithdrawalDetail.js";
import { getWithdrawalHistory } from "../controllers/savings/getWithdrawalHistory.js";
import { disburseWithdrawal } from "../controllers/savings/disburseWithdrawal.js"; // Import baru
const router = express.Router();

// Route untuk Master Data Produk (Tab Navigasi)
router.get("/products", MidAnggota, getSavingsProducts);
router.get("/account-detail", MidAnggota, getAccountDetail);
// Route untuk Riwayat & Transaksi
router.get("/riwayat", MidAnggota, getSavingsHistory);
router.post("/penarikan/request", MidAnggota, requestWithdrawal);
router.get("/penarikan/history", MidAnggota, getWithdrawalHistory);
router.get("/transactions/:invoiceNumber", MidAnggota, getTransactionDetail);
router.get("/penarikan/detail/:withdrawalId", MidAnggota, getWithdrawalDetail);
router.post("/penarikan/:withdrawal_id/disburse", MidAnggota, disburseWithdrawal); // Tambahan

export default router;