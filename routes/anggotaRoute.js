import express from "express";
// Import middleware untuk otorisasi anggota

// Import controller untuk mengambil data profil
// Asumsi: Logic Get Profile berada di controllers/core/anggota
import { getAnggotaProfile } from "../controllers/core/anggota/getAnggotaProfile.js"; // Asumsi path controller
import { MidAnggota } from "../midlleware/MidAnggota.js";
import submitRegistration from "../controllers/core/anggota/submitRegistration.js";

const router = express.Router();

// --- Rute Anggota Terotentikasi ---

/**
 * Endpoint: GET /profil
 * Digunakan oleh Frontend: UAuth.getProfile() -> GET /api/anggota/profil
 * Fungsi: Mengambil data profil anggota yang sedang login.
 * Memerlukan otorisasi (MidAnggota)
 */
router.get("/anggota/profil", MidAnggota, getAnggotaProfile);
router.post("/anggota/pendaftaran", MidAnggota, submitRegistration);

// Tambahkan rute anggota lainnya di sini (misalnya: update profil)
// router.put('/profil/update', MidAnggota, updateAnggotaProfile);

export default router;
