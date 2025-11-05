import express from "express";
import { sendEmail } from "../controller/utils/sendMail.js";
import authAnggota from "../midlleware/MidAnggota.js";
import { getMenuUtama } from "../controller/utils/getMenuUtama.js";
import { getAllTagihanByUser } from "../controller/transaksi/getAllTagihanByUser.js";
import { getAllTagihanDetail } from "../controller/transaksi/getAllTagihanDetail.js";

const router = express.Router();

// Optimized: Use descriptive route and consistent naming
router.post("/send-email", sendEmail);
router.post("/getMenuUtama", authAnggota, getMenuUtama);
router.post("/getAllTagihanByUser", authAnggota, getAllTagihanByUser);
router.post("/getAllTagihanDetail", authAnggota, getAllTagihanDetail);

export default router;
