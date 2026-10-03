// src/routes/savingsRoutes.js
import express from "express";
import { MidAnggota } from "../middleware/MidAnggota.js";
import MidRole from "../middleware/MidRole.js";
import { getSavingsHistory } from "../controllers/savings/getSavingsHistory.js";
import requestWithdrawal from "../controllers/savings/requestWithdrawal.js";
import { getSavingsProducts } from "../controllers/savings/getSavingsProducts.js";
import { getAccountDetail } from "../controllers/savings/getAccountDetail.js";
import { getTransactionDetail } from "../controllers/savings/getTransactionDetail.js";
import { getWithdrawalDetail } from "../controllers/savings/getWithdrawalDetail.js";
import { getWithdrawalHistory } from "../controllers/savings/getWithdrawalHistory.js";
import { disburseWithdrawal } from "../controllers/savings/disburseWithdrawal.js"; // Tambahan
import { updateSavingsAkad } from "../controllers/savings/updateSavingsAkad.js"; // Tambahan
import { getFeatures } from "../controllers/savings/getFeatures.js";
import { updateFeatureAkad } from "../controllers/savings/updateFeatureAkad.js";
import { getSimpananConfig, updateSimpananConfig } from "../controllers/savings/config.js";

const router = express.Router();

// Route untuk Master Data Produk (Tab Navigasi)
router.get("/products", MidAnggota, getSavingsProducts);
router.put("/products/:id/akad", MidAnggota, updateSavingsAkad);
router.get("/features", MidAnggota, getFeatures);
router.put("/features/:id/akad", MidAnggota, updateFeatureAkad);
router.get("/account-detail", MidAnggota, getAccountDetail);
// Route untuk Riwayat & Transaksi
router.get("/riwayat", MidAnggota, getSavingsHistory);
router.post("/penarikan/request", MidAnggota, requestWithdrawal);
router.get("/penarikan/history", MidAnggota, getWithdrawalHistory);
router.get("/transactions/:invoiceNumber", MidAnggota, getTransactionDetail);
router.get("/penarikan/detail/:withdrawalId", MidAnggota, getWithdrawalDetail);
router.post("/penarikan/:withdrawal_id/disburse", MidAnggota, disburseWithdrawal); // Tambahan

// Route for Simpanan Config
router.get("/config", MidAnggota, MidRole(['Ketua', 'Bendahara', 'Pengawas', 'Admin', 'admin']), getSimpananConfig);
router.put("/config", MidAnggota, MidRole(['Ketua', 'Bendahara', 'Pengawas', 'Admin', 'admin']), updateSimpananConfig);

export default router;