// routes/programRoute.js
import multer from "multer";
import express from "express";
import getProgramPinjaman from "../controllers/program/getProgramPinjaman.js";
import getProgramArisan from "../controllers/program/getProgramArisan.js";
import getProgramOptions from "../controllers/program/getProgramOptions.js";
import getAvailableArisan from "../controllers/program/getAvailableArisan.js";
import getArisanDetail from "../controllers/program/getArisanDetail.js";
import { MidAnggota } from "../middleware/MidAnggota.js";
import getLoanProducts from "../controllers/loan/getLoanProducts.js";
import { addPinjamanModal } from "../controllers/program/pinjamanModalController.js";
import { getBatches, createBatch, updateBatchStatus, updateBatch, deleteBatch } from "../controllers/program/arisanBatchController.js";
import { getParticipantsByBatch, updateParticipantStatus, updateParticipantNo } from "../controllers/program/arisanParticipantController.js";
import { getPaymentsByBatch, recordPayment } from "../controllers/program/arisanPaymentController.js";
import { getDrawsByBatch, conductDraw, updateDrawStatus, uploadTransferProof } from "../controllers/program/arisanDrawController.js";
import { importPinjaman } from "../controllers/program/importPinjaman.js";
import { importArisan } from "../controllers/program/importArisan.js";
import { downloadTemplatePinjaman } from "../controllers/program/downloadTemplatePinjaman.js";
import { downloadTemplateArisan } from "../controllers/program/downloadTemplateArisan.js";

const router = express.Router();
const upload = multer();

// GET /api/program/pinjaman - Protected
router.get("/pinjaman", MidAnggota, getProgramPinjaman);

// POST /api/program/pinjaman/modal - Tambah Modal Pinjaman Lunak
router.post("/pinjaman/modal", MidAnggota, addPinjamanModal);

// GET /api/program/pinjaman/produk - Fallback for loan products
router.get("/pinjaman/produk", getLoanProducts);

// GET /api/program/arisan/available - Get list of available arisan for joining
router.get("/arisan/available", MidAnggota, getAvailableArisan);

// GET /api/program/arisan/detail/:id - Get arisan detail by ID
router.get("/arisan/detail/:id", MidAnggota, getArisanDetail);

// GET /api/program/arisan - Protected
router.get("/arisan", MidAnggota, getProgramArisan);

// GET /api/program/arisan/batches - Protected (Admin/Pengurus)
router.get("/arisan/batches", MidAnggota, getBatches);

// POST /api/program/arisan/batches - Protected
router.post("/arisan/batches", MidAnggota, createBatch);

// PUT /api/program/arisan/batches/:id/status - Protected
router.put("/arisan/batches/:id/status", MidAnggota, updateBatchStatus);

// PUT /api/program/arisan/batches/:id - Protected
router.put("/arisan/batches/:id", MidAnggota, updateBatch);

// DELETE /api/program/arisan/batches/:id - Protected
router.delete("/arisan/batches/:id", MidAnggota, deleteBatch);

// GET /api/program/arisan/batches/:batchId/participants - Protected
router.get("/arisan/batches/:batchId/participants", MidAnggota, getParticipantsByBatch);

// PUT /api/program/arisan/participants/:id/status - Protected
router.put("/arisan/participants/:id/status", MidAnggota, updateParticipantStatus);

// PUT /api/program/arisan/participants/:id/no - Protected
router.put("/arisan/participants/:id/no", MidAnggota, updateParticipantNo);

// GET /api/program/arisan/batches/:batchId/payments - Protected
router.get("/arisan/batches/:batchId/payments", MidAnggota, getPaymentsByBatch);

// POST /api/program/arisan/batches/:batchId/payments - Protected
router.post("/arisan/batches/:batchId/payments", MidAnggota, recordPayment);

// GET /api/program/arisan/batches/:batchId/draws - Protected
router.get("/arisan/batches/:batchId/draws", MidAnggota, getDrawsByBatch);

// POST /api/program/arisan/batches/:batchId/draws - Protected
router.post("/arisan/batches/:batchId/draws", MidAnggota, conductDraw);

// PUT /api/program/arisan/draws/:id/status - Protected
router.put("/arisan/draws/:id/status", MidAnggota, uploadTransferProof, updateDrawStatus);

// GET /api/program/options - Public or Protected?
router.get("/options", getProgramOptions);

// IMPORT ENDPOINTS
router.get("/pinjaman/template-import", downloadTemplatePinjaman);
router.post("/pinjaman/import", upload.single("file"), importPinjaman);

router.get("/arisan/template-import", downloadTemplateArisan);
router.post("/arisan/import", upload.single("file"), importArisan);

export default router;
