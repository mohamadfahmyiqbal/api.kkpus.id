import express from "express";
import authAnggota from "../midlleware/MidAnggota.js";
import { generateInvoice } from "../controller/invoice/generateInvoice.js";

const router = express.Router();

router.post("/generateInvoice", authAnggota, generateInvoice);

export default router;
