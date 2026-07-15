import express from "express";
import { MidAnggota } from "../middleware/MidAnggota.js";
import MidRole from "../middleware/MidRole.js";
import { applySavingsTarget } from "../controllers/savings/applySavingsTarget.js";
import { getSavingsTargetDetail } from "../controllers/savings/getSavingsTargetDetail.js";
import { getSavingsTargetCheck } from "../controllers/savings/getSavingsTargetCheck.js";
import { requestTabunganWithdrawal } from "../controllers/savings/requestTabunganWithdrawal.js";
import getTabunganBills from "../controllers/savings/getTabunganBills.js";
import { getAdminTabungan } from "../controllers/savings/getAdminTabungan.js";
import { getTabunganPrograms, createTabunganProgram, updateTabunganProgram, deleteTabunganProgram, getAvailablePrograms } from "../controllers/savings/manageAdminTabungan.js";
import { importTabungan } from "../controllers/savings/importTabungan.js";
import { downloadTemplateTabungan } from "../controllers/savings/downloadTemplateTabungan.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.get("/programs", MidAnggota, getAvailablePrograms);
router.post("/pengajuan", MidAnggota, applySavingsTarget);
router.get("/pengajuan/detail/:id", MidAnggota, getSavingsTargetDetail);
router.get("/pengajuan/check", MidAnggota, getSavingsTargetCheck);
router.post("/pengajuan/:id/withdraw", MidAnggota, requestTabunganWithdrawal);
router.get("/pengajuan/:id/tagihan", MidAnggota, getTabunganBills);

// Endpoint untuk Admin Backoffice TabunganPage
import { getAdminTabunganBills } from "../controllers/savings/getAdminTabunganBills.js";
import { getAdminTabunganTransactions } from "../controllers/savings/getAdminTabunganTransactions.js";

router.get("/admin", MidAnggota, MidRole(['Ketua', 'Bendahara', 'Pengawas']), getAdminTabungan);
router.get("/admin/transactions", MidAnggota, MidRole(['Ketua', 'Bendahara', 'Pengawas']), getAdminTabunganTransactions);
router.get("/admin/pengajuan/:id/tagihan", MidAnggota, MidRole(['Ketua', 'Bendahara', 'Pengawas']), getAdminTabunganBills);

// Endpoint untuk Master Program Tabungan
router.get("/admin/programs", MidAnggota, MidRole(['Ketua', 'Bendahara', 'Pengawas']), getTabunganPrograms);
router.post("/admin/programs", MidAnggota, MidRole(['Ketua', 'Bendahara', 'Pengawas']), createTabunganProgram);
router.put("/admin/programs/:id", MidAnggota, MidRole(['Ketua', 'Bendahara', 'Pengawas']), updateTabunganProgram);
router.delete("/admin/programs/:id", MidAnggota, MidRole(['Ketua', 'Bendahara', 'Pengawas']), deleteTabunganProgram);

router.get("/admin/template-import", downloadTemplateTabungan);
router.post("/admin/import", upload.single("file"), importTabungan);

export default router;
