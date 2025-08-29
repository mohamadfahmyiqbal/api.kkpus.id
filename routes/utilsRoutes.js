import express from "express";
import { sendEmail } from "../controller/utils/sendMail.js";

const router = express.Router();

// Optimized: Use descriptive route and consistent naming
router.post("/send-email", sendEmail);

export default router;
