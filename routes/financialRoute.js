// src/routes/financialRoute.js
import express from "express";
import { MidAnggota } from "../middleware/MidAnggota.js";
// Pastikan path controller ini sesuai dengan struktur folder Anda
import { getFinancialSummary } from "../controllers/content/financial/getFinancialSummary.js";
import getFinancingHistory from "../controllers/financing/getFinancingHistory.js";
import createFinancingApplication from "../controllers/financing/createFinancingApplication.js";
import getFinancingDetail from "../controllers/financing/getFinancingDetail.js";
import getFinancingOptions from "../controllers/financing/getFinancingOptions.js";
import getFinancingTerms from "../controllers/financing/getFinancingTerms.js";
import { getPelunasanBillItems } from "../controllers/financing/getPelunasanBillItems.js";
import getPinjamanReport from "../controllers/financing/getPinjamanReport.js";
import createPinjamanHutang from "../controllers/financing/createPinjamanHutang.js";
import createPinjamanAktivaTetap from "../controllers/financing/createPinjamanAktivaTetap.js";
import getArisanReport from "../controllers/financing/getArisanReport.js";

const router = express.Router();

/**
 * Endpoint: GET /financial/summary
 * Digunakan oleh: FinancialSection.jsx
 */
router.get("/summary", MidAnggota, getFinancialSummary);

/**
 * Endpoint: GET /financial/history
 * Digunakan oleh: TransaksiDashboardPage.jsx
 */
router.get("/history", MidAnggota, getFinancingHistory);

/**
 * Endpoint: GET /financial/report/pinjaman
 */
router.get("/report/pinjaman", MidAnggota, getPinjamanReport);

/**
 * Endpoint: GET /financial/report/arisan
 */
router.get("/report/arisan", MidAnggota, getArisanReport);

/**
 * Endpoint: POST /financial/apply
 * Digunakan oleh: FormPengajuanTransaksi.jsx
 */
router.post("/apply", MidAnggota, createFinancingApplication);

/**
 * Endpoint: GET /financial/detail/:id
 * Digunakan oleh: TransactionDetailPage.jsx
 */
router.get("/detail/:id", MidAnggota, getFinancingDetail);

/**
 * Endpoint: GET /financial/options
 * Digunakan oleh: FormPengajuanTransaksi.jsx
 * Public endpoint - tidak perlu autentikasi
 */
router.get("/options", getFinancingOptions);

/**
 * Endpoint: GET /financial/terms
 * Digunakan oleh: FormPengajuanTransaksi.jsx
 * Public endpoint - tidak perlu autentikasi
 */
router.get("/terms", getFinancingTerms);

router.get("/pelunasan-items/:id", MidAnggota, getPelunasanBillItems);

/**
 * Endpoint: POST /financial/hutang/create
 */
router.post("/hutang/create", MidAnggota, createPinjamanHutang);

/**
 * Endpoint: POST /financial/aktiva-tetap/create
 */
router.post("/aktiva-tetap/create", MidAnggota, createPinjamanAktivaTetap);

export default router;
