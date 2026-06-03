import express from "express";
import createFinancingApplication from "../controllers/financing/createFinancingApplication.js";
import applyArisan from "../controllers/financing/applyArisan.js";
import getFinancingHistory from "../controllers/financing/getFinancingHistory.js";
import getFinancingDetail from "../controllers/financing/getFinancingDetail.js";
import getFinancingOptions from "../controllers/financing/getFinancingOptions.js";
import getFinancingTerms from "../controllers/financing/getFinancingTerms.js";
import getLoanProducts from "../controllers/loan/getLoanProducts.js";
import { MidAnggota } from "../middleware/MidAnggota.js";
import {
  uploadEvidence,
  handleEvidenceUpload,
  downloadEvidence,
  deleteEvidence,
} from "../controllers/financing/uploadEvidence.js";

const router = express.Router();

// Public route - no authentication required for loan products
router.get("/loan-products", getLoanProducts);

// Routes that require authentication
router.get("/history", MidAnggota, getFinancingHistory);
router.post("/apply", MidAnggota, createFinancingApplication);
router.post("/apply-arisan", MidAnggota, applyArisan);
router.get("/detail/:id", MidAnggota, getFinancingDetail);
router.get("/options", MidAnggota, getFinancingOptions);
router.get("/terms", MidAnggota, getFinancingTerms);

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
