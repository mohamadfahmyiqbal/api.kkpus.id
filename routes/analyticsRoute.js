import express from "express";
import { MidAnggota } from "../middleware/MidAnggota.js";
import { 
  getDashboardAnalytics, 
  getTransactionTrends 
} from "../controllers/analytics/analyticsController.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

/**
 * Get comprehensive dashboard analytics
 * Endpoint: GET /api/analytics/dashboard
 */
router.get("/dashboard", authLimiter, MidAnggota, getDashboardAnalytics);

/**
 * Get transaction trends data
 * Endpoint: GET /api/analytics/trends?period=daily|weekly|monthly
 */
router.get("/trends", authLimiter, MidAnggota, getTransactionTrends);

export default router;
