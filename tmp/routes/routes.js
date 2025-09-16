import express from "express";
import userRoutes from "./userRoutes.js";
import pinjamanRoutes from "./pinjamanRoutes.js";
import utilRoutes from "./utilsRoutes.js";
import approvalRoutes from "./approvalRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import invoiceRoutes from "./invoiceRoutes.js";
import {
  perbaikanPinjamanAnggota,
  perbaikanPinjamanTrans,
} from "../controller/pinjaman/perbaikan.js";
// import importRoutes from "./importRoutes.js";

const router = express.Router();

// Optimized and clean route registration
router.post("/perbaikanPinjamanAnggota", perbaikanPinjamanAnggota);
router.post("/perbaikanPinjamanTrans", perbaikanPinjamanTrans);

router.use(userRoutes);
router.use(notificationRoutes);
router.use(approvalRoutes);
router.use(pinjamanRoutes);
router.use(utilRoutes);
router.use(invoiceRoutes);
// router.use(importRoutes);

export default router;
