import express from "express";
import multer from "multer";
import { getAnggotaProfile } from "../controllers/core/anggota/getAnggotaProfile.js";
import { updateAnggotaProfile } from "../controllers/core/anggota/updateAnggotaProfile.js";
import { MidAnggota } from "../middleware/MidAnggota.js";
import { submitRegistration } from "../controllers/core/anggota/submitRegistration.js";
import { getRegistrationStatus } from "../controllers/core/anggota/getRegistrationStatus.js";
import {
  submitTermination,
  getTerminationStatus,
} from "../controllers/core/anggota/submitTermination.js";
import { getAllMembers } from "../controllers/core/anggota/getAllMembers.js";
import { importAnggota } from "../controllers/core/anggota/importAnggota.js";
import { downloadTemplateAnggota } from "../controllers/core/anggota/downloadTemplateAnggota.js";

const router = express.Router();
const upload = multer();

router.get("/profil", MidAnggota, getAnggotaProfile);
router.put("/profil", MidAnggota, updateAnggotaProfile);
router.post("/pendaftaran", MidAnggota, submitRegistration);
router.get("/getRegistrationStatus", MidAnggota, getRegistrationStatus);
router.post("/berhenti-keanggotaan", MidAnggota, submitTermination);
router.get("/berhenti-keanggotaan/status", MidAnggota, getTerminationStatus);

// API untuk Backoffice
router.get("/all", getAllMembers);
router.get("/template-import", downloadTemplateAnggota);
router.post("/import", upload.single("file"), importAnggota);

export default router;
