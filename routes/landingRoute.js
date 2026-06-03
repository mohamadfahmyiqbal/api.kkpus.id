import express from "express";
import {
  getServices,
  getStats,
  getAbout,
  getContact,
  submitContactForm,
  getAllContent
} from "../controllers/landing/landingController.js";

const router = express.Router();

/**
 * GET /api/landing/services
 * Mendapatkan daftar layanan unggulan
 */
router.get("/services", getServices);

/**
 * GET /api/landing/stats
 * Mendapatkan statistik koperasi
 */
router.get("/stats", getStats);

/**
 * GET /api/landing/about
 * Mendapatkan informasi tentang kami
 */
router.get("/about", getAbout);

/**
 * GET /api/landing/contact
 * Mendapatkan informasi kontak
 */
router.get("/contact", getContact);

/**
 * POST /api/landing/contact-form
 * Mengirim form kontak dari landing page
 */
router.post("/contact-form", submitContactForm);

/**
 * GET /api/landing/content
 * Mendapatkan semua content landing page dalam satu request
 */
router.get("/content", getAllContent);

export default router;
