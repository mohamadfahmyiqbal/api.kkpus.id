import express from "express";
import { MidAnggota } from "../middleware/MidAnggota.js"; // Perbaikan path: middleware
import { getSavingsHistory } from "../controllers/savings/getSavingsHistory.js";
import requestWithdrawal from "../controllers/savings/requestWithdrawal.js";

const router = express.Router();

router.get("/riwayat", MidAnggota, getSavingsHistory);
router.post("/penarikan/request", MidAnggota, requestWithdrawal);

export default router;