import express from "express";
import authAnggota from "../midlleware/MidAnggota.js";
import { findTransByJenis } from "../controller/transaksi/findTransByJenis.js";

const router = express.Router();

router.post("/findTransByJenis", authAnggota, findTransByJenis);

export default router;
