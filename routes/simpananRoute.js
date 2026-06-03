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
import { applySavingsTarget } from "../controllers/savings/applySavingsTarget.js";
import { getSavingsTargetDetail } from "../controllers/savings/getSavingsTargetDetail.js";
import { getSavingsTargetCheck } from "../controllers/savings/getSavingsTargetCheck.js";
import getTabunganBills from "../controllers/savings/getTabunganBills.js";

const router = express.Router();

// Route untuk pengajuan target tabungan
router.post("/pengajuan", MidAnggota, applySavingsTarget);
router.get("/pengajuan/detail/:id", MidAnggota, getSavingsTargetDetail);
router.get("/pengajuan/check", MidAnggota, getSavingsTargetCheck);
router.get("/pengajuan/:id/tagihan", MidAnggota, getTabunganBills);

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