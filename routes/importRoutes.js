import express from "express";
import { importTrans } from "../controller/imporExcel.js";
import { upload } from "../midlleware/uploadMiddleware.js";

const router = express.Router();

router.post("/importTrans", upload.single("file"), importTrans);

export default router;
