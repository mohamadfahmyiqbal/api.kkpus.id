import express from "express";
const router = express.Router();
import { subscribeToPush, testPushNotification, getVapidPublicKey } from "../controllers/notification/pushController.js";

// Endpoint untuk mendapatkan VAPID public key
router.get("/vapid-public-key", getVapidPublicKey);

// Endpoint untuk menyimpan token subscription dari browser
router.post("/subscribe", subscribeToPush);

// Endpoint untuk mengetes apakah push bisa terkirim ke member tersebut
router.post("/test-push", testPushNotification);

export default router;