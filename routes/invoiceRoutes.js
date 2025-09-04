import express from "express";
import authAnggota from "../midlleware/MidAnggota.js";
import { generateInvoice } from "../controller/invoice/generateInvoice.js";

const router = express.Router();

router.post("/generateInvoice", generateInvoice);

export default router;
