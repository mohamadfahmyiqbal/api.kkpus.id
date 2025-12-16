// 📁 src/routes/webhookRoute.js

import express from "express";
import { midtransNotification } from "../controllers/billing/midtransNotification.js";

const router = express.Router();

// Rute ini 100% publik
router.post("/midtrans/notification", midtransNotification);
// 🛑 TAMBAH RUTE GET INI (OPSIONAL, HANYA UNTUK KEBERSIHAN)
router.get("/midtrans/notification", (req, res) => {
  // Mengembalikan 405 Method Not Allowed
  return res.status(405).json({
    success: false,
    message:
      "Method Not Allowed. This endpoint only accepts POST requests for Midtrans notifications.",
  });
});
export default router;
