import express from "express";
import createFinancingApplication from "../controllers/financing/createFinancingApplication.js";
import applyArisan from "../controllers/financing/applyArisan.js";
import getFinancingHistory from "../controllers/financing/getFinancingHistory.js";
import getFinancingDetail from "../controllers/financing/getFinancingDetail.js";
import getPinjamanReport from "../controllers/financing/getPinjamanReport.js";
import getFinancingOptions from "../controllers/financing/getFinancingOptions.js";
import getFinancingTerms from "../controllers/financing/getFinancingTerms.js";
import getLoanProducts from "../controllers/loan/getLoanProducts.js";
import getSukukCatalog from "../controllers/financing/getSukukCatalog.js";
import getSukukPortfolio from "../controllers/financing/getSukukPortfolio.js";
import getSukukDetail from "../controllers/financing/getSukukDetail.js";
import getInvestasiReport from "../controllers/financing/getInvestasiReport.js";
import getPendanaanReport from "../controllers/financing/getPendanaanReport.js";
import getSukukMembers from "../controllers/financing/getSukukMembers.js";
import createSukukOrder from "../controllers/financing/createSukukOrder.js";
import getSukukOrderDetail from "../controllers/financing/getSukukOrderDetail.js";
import createSukukIssue from "../controllers/financing/createSukukIssue.js";
import updateSukukIssue from "../controllers/financing/updateSukukIssue.js";
import deleteSukukIssue from "../controllers/financing/deleteSukukIssue.js";
import getAllSukukIssues from "../controllers/financing/getAllSukukIssues.js";
import requestSukukWithdrawal from "../controllers/financing/requestSukukWithdrawal.js";
import { uploadProofMiddleware, uploadSukukWithdrawalProof } from "../controllers/financing/uploadSukukWithdrawalProof.js";
import { MidAnggota } from "../middleware/MidAnggota.js";
import {
  uploadEvidence,
  handleEvidenceUpload,
  downloadEvidence,
  deleteEvidence,
} from "../controllers/financing/uploadEvidence.js";
import { importPendanaan } from "../controllers/financing/importPendanaan.js";
import { downloadTemplatePendanaan } from "../controllers/financing/downloadTemplatePendanaan.js";
import { importInvestasi } from "../controllers/financing/importInvestasi.js";
import { downloadTemplateInvestasi } from "../controllers/financing/downloadTemplateInvestasi.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

// Public route - no authentication required for loan products
router.get("/loan-products", getLoanProducts);

// Routes that require authentication
router.get("/report/pinjaman", MidAnggota, getPinjamanReport);
router.get("/report/pendanaan", MidAnggota, getPendanaanReport);
router.get("/history", MidAnggota, getFinancingHistory);
router.post("/apply", MidAnggota, createFinancingApplication);
router.post("/apply-arisan", MidAnggota, applyArisan);
router.get("/detail/:id", MidAnggota, getFinancingDetail);
router.get("/options", MidAnggota, getFinancingOptions);
router.get("/terms", MidAnggota, getFinancingTerms);

// Sukuk Routes
router.get("/sukuk/issue/all", MidAnggota, getAllSukukIssues);
router.post("/sukuk/issue", MidAnggota, createSukukIssue);
router.put("/sukuk/issue/:id", MidAnggota, updateSukukIssue);
router.delete("/sukuk/issue/:id", MidAnggota, deleteSukukIssue);

router.get("/sukuk/catalog", MidAnggota, getSukukCatalog);
router.get("/sukuk/portfolio", MidAnggota, getSukukPortfolio);
router.get("/sukuk/detail/:id", MidAnggota, getSukukDetail);
router.get("/sukuk/members/:id", MidAnggota, getSukukMembers);
router.post("/sukuk/order", MidAnggota, createSukukOrder);
router.get("/sukuk/order/:id", MidAnggota, getSukukOrderDetail);
router.get("/sukuk/report", MidAnggota, getInvestasiReport);
router.post("/sukuk/withdraw/:orderId", MidAnggota, requestSukukWithdrawal);
router.post("/sukuk/withdraw/:orderId/proof", MidAnggota, uploadProofMiddleware, uploadSukukWithdrawalProof);

// Investasi Import Endpoints
router.get("/investasi/template-import", downloadTemplateInvestasi);
router.post("/investasi/import", upload.single("file"), importInvestasi);

// Pendanaan Syariah Import Endpoints
router.get("/pendanaan/template-import", downloadTemplatePendanaan);
router.post("/pendanaan/import", upload.single("file"), importPendanaan);

// File Evidence Routes (require authentication)
router.post(
  "/evidence/:financingId",
  MidAnggota,
  uploadEvidence,
  handleEvidenceUpload,
);
router.get("/evidence/:financingId/download", MidAnggota, downloadEvidence);
router.delete("/evidence/:financingId", MidAnggota, deleteEvidence);

/**
 * Note: Pastikan Anda membuat controller khusus untuk download receipt
 * jika logika filestream berbeda dengan getDetail.
 */
router.get("/receipt/:id", MidAnggota, getFinancingDetail);

export default router;
