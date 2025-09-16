import express from "express";
import {
  getAllBatch,
  getLaporanArisanGabungan,
} from "../controller/CArisan.js";

const router = express.Router();

router.post("/getAllBatch", getAllBatch);
router.post("/getLaporanArisanGabungan", getLaporanArisanGabungan);

export default router;
