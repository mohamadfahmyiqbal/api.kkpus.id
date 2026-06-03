import express from "express";
import { MidAnggota } from "../middleware/MidAnggota.js";
import { 
  exportMembers,
  exportTransactions,
  exportFinancialReports,
  importMembers,
  importTransactions
} from "../controllers/data/dataController.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only Excel files
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'), false);
    }
  }
});

const router = express.Router();

/**
 * Export members data to Excel
 * Endpoint: GET /api/data/export/members?format=xlsx|csv
 */
router.get("/export/members", authLimiter, MidAnggota, exportMembers);

/**
 * Export transactions data to Excel
 * Endpoint: GET /api/data/export/transactions?format=xlsx&startDate&endDate
 */
router.get("/export/transactions", authLimiter, MidAnggota, exportTransactions);

/**
 * Export financial reports to Excel
 * Endpoint: GET /api/data/export/financial?format=xlsx&period=monthly|yearly
 */
router.get("/export/financial", authLimiter, MidAnggota, exportFinancialReports);

/**
 * Import members data from Excel file
 * Endpoint: POST /api/data/import/members
 */
router.post("/import/members", authLimiter, MidAnggota, upload.single('file'), importMembers);

/**
 * Import transactions data from Excel file
 * Endpoint: POST /api/data/import/transactions
 */
router.post("/import/transactions", authLimiter, MidAnggota, upload.single('file'), importTransactions);

export default router;
