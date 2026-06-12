import express from "express";
import { MidAnggota } from "../middleware/MidAnggota.js";
import { applySavingsTarget } from "../controllers/savings/applySavingsTarget.js";
import { getSavingsTargetDetail } from "../controllers/savings/getSavingsTargetDetail.js";
import { getSavingsTargetCheck } from "../controllers/savings/getSavingsTargetCheck.js";
import getTabunganBills from "../controllers/savings/getTabunganBills.js";

const router = express.Router();

router.post("/pengajuan", MidAnggota, applySavingsTarget);
router.get("/pengajuan/detail/:id", MidAnggota, getSavingsTargetDetail);
router.get("/pengajuan/check", MidAnggota, getSavingsTargetCheck);
router.get("/pengajuan/:id/tagihan", MidAnggota, getTabunganBills);

export default router;
