import express from "express";
import { getAnggotaProfile } from "../controllers/core/anggota/getAnggotaProfile.js";
import { MidAnggota } from "../middleware/MidAnggota.js"; 

// ✅ PERBAIKAN: Gunakan curly braces { } untuk named exports
import { submitRegistration } from "../controllers/core/anggota/submitRegistration.js";
import { getRegistrationStatus } from "../controllers/core/anggota/getRegistrationStatus.js";

const router = express.Router();

router.get("/profil", MidAnggota, getAnggotaProfile);

// Endpoint untuk mengirim pendaftaran
router.post("/pendaftaran", MidAnggota, submitRegistration);

// Endpoint untuk mengecek status pendaftaran
router.get("/getRegistrationStatus", MidAnggota, getRegistrationStatus);

export default router;