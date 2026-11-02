import express from "express";
import multer from "multer";
import { MidAnggota } from "../middleware/MidAnggota.js";
import MidRole from "../middleware/MidRole.js";
import { createRateLimiter } from "../middleware/rateLimitMiddleware.js";
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
import { deleteJualBeli, deleteBatchJualBeli } from "../controllers/jualbeli/deleteJualBeli.js";

const router = express.Router();

const BACKOFFICE_ROLES = ["PENGAWAS", "KETUA", "BENDAHARA"];
const MAX_IMPORT_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const importLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    status: false,
    message: "Terlalu banyak permintaan import. Coba lagi beberapa menit lagi.",
  },
});

const isSpreadsheet = (file) => {
  const allowedMimeTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "application/octet-stream",
  ];
  return (
    /\.(xlsx|xls)$/i.test(file.originalname) &&
    allowedMimeTypes.includes(file.mimetype)
  );
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMPORT_FILE_SIZE, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!isSpreadsheet(file)) {
      return cb(new Error("File harus berformat Excel (.xlsx atau .xls)"));
    }
    cb(null, true);
  },
});

// Bungkus multer agar error ukuran/format file dikembalikan sebagai JSON 400,
// bukan jatuh ke error handler umum sebagai 500.
const uploadSingleFile = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (!error) return next();

    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Ukuran file maksimal 5 MB."
        : error.message || "Gagal memproses file yang diunggah.";

    return res.status(400).json({ success: false, message });
  });
};

/**
 * Endpoint: GET /jualbeli/report
 * Digunakan untuk mengambil laporan agregasi jual beli
 */
router.get("/report", MidAnggota, MidRole(BACKOFFICE_ROLES), getJualBeliReport);

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
 * Hanya petugas backoffice yang boleh mengunduh template dan melakukan import.
 */
router.get(
  "/template-import",
  MidAnggota,
  MidRole(BACKOFFICE_ROLES),
  downloadTemplateJualBeli
);
router.post(
  "/import",
  MidAnggota,
  MidRole(BACKOFFICE_ROLES),
  importLimiter,
  uploadSingleFile,
  importJualBeli
);

/**
 * Import Endpoints - Riwayat Cicilan Jual Beli (Opsi B)
 */
router.get(
  "/template-import-cicilan",
  MidAnggota,
  MidRole(BACKOFFICE_ROLES),
  downloadTemplateCicilanJualBeli
);
router.post(
  "/import-cicilan",
  MidAnggota,
  MidRole(BACKOFFICE_ROLES),
  importLimiter,
  uploadSingleFile,
  importCicilanJualBeli
);

/**
 * Delete Endpoints
 */
router.post(
  "/batch-delete",
  MidAnggota,
  MidRole(BACKOFFICE_ROLES),
  deleteBatchJualBeli
);
router.delete(
  "/:id",
  MidAnggota,
  MidRole(BACKOFFICE_ROLES),
  deleteJualBeli
);

/**
 * Endpoint: GET /transaction/:id
 * Digunakan untuk mengambil detail transaksi
 */
router.get("/:id", MidAnggota, getTransactionDetail);

export default router;
