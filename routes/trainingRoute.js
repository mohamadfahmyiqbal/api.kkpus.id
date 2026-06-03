import express from "express";
import { MidAnggota } from "../middleware/MidAnggota.js";
import { getCurriculums } from "../controllers/training/getCurriculums.js";
import { getMaterials, getMaterialDetail } from "../controllers/training/getMaterials.js";
import { saveNote } from "../controllers/training/saveNote.js";
import { submitEvaluation } from "../controllers/training/submitEvaluation.js";
import { getRankings, getMyRanking } from "../controllers/training/getRankings.js";

const router = express.Router();

/**
 * Endpoint: GET /training/curriculums
 * Digunakan untuk mengambil daftar kurikulum
 */
router.get("/curriculums", MidAnggota, getCurriculums);

/**
 * Endpoint: GET /training/curriculums/:curriculum_id/materials
 * Digunakan untuk mengambil daftar materi berdasarkan kurikulum
 */
router.get("/curriculums/:curriculum_id/materials", MidAnggota, getMaterials);

/**
 * Endpoint: GET /training/materials/:material_id
 * Digunakan untuk mengambil detail materi
 */
router.get("/materials/:material_id", MidAnggota, getMaterialDetail);

/**
 * Endpoint: POST /training/notes
 * Digunakan untuk menyimpan catatan materi
 */
router.post("/notes", MidAnggota, saveNote);

/**
 * Endpoint: POST /training/evaluations
 * Digunakan untuk submit evaluasi
 */
router.post("/evaluations", MidAnggota, submitEvaluation);

/**
 * Endpoint: GET /training/rankings
 * Digunakan untuk mengambil daftar peringkat
 */
router.get("/rankings", MidAnggota, getRankings);

/**
 * Endpoint: GET /training/my-ranking
 * Digunakan untuk mengambil peringkat sendiri
 */
router.get("/my-ranking", MidAnggota, getMyRanking);

export default router;
