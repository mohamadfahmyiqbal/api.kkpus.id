import express from "express";
import { getAnggotaProfile } from "../controllers/core/anggota/getAnggotaProfile.js";
import { MidAnggota } from "../middleware/MidAnggota.js"; // Perbaiki: middleware
import submitRegistration from "../controllers/core/anggota/submitRegistration.js";
import getRegistrationStatus from "../controllers/core/anggota/getRegistrationStatus.js";

const router = express.Router();

router.get("/profil", MidAnggota, getAnggotaProfile);
router.post("/pendaftaran", MidAnggota, submitRegistration);
router.get("/getRegistrationStatus", MidAnggota, getRegistrationStatus);
export default router;