// src/routes/contentRoute.js
import express from "express";
import { getLandingText } from "../controllers/content/landingText/landingTextController.js";
import { getPublishedArticles } from "../controllers/content/list/getPublishedArticles.js";
// Import controller yang sudah dipisah

const router = express.Router();

// GET /api/content/landing-text (Mapping ke landingTextController)
router.get('/landing-text', getLandingText);

// GET /api/content/articles (Mapping ke articleListController)
router.get('/articles', getPublishedArticles);

export default router;