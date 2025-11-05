import express from "express";
import authAnggota from "../midlleware/MidAnggota.js";
import { getSimpananCategory } from "../controller/simpanan/getSimpananCategory.js";
import { getDataSimpanan } from "../controller/simpanan/getDataSimpanan.js";
import { getCardSimpanan } from "../controller/simpanan/getCardSimpanan.js";
import { reqPencairanSimpanan } from "../controller/simpanan/reqPencairanSimpanan.js";

const router = express.Router();

router.post("/getSimpananCategory", authAnggota, getSimpananCategory);
router.post("/getCardSimpanan", authAnggota, getCardSimpanan);
router.post("/getDataSimpanan", authAnggota, getDataSimpanan);
router.post("/reqPencairanSimpanan", authAnggota, reqPencairanSimpanan);

export default router;
