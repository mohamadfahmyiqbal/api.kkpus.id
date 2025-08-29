import express from "express";
import { getAnggotaPinjamanLunak } from "../controller/pinjaman/getAnggotaPinjamanLunak.js";
import { getSetoranPinjaman } from "../controller/pinjaman/getSetoranPinjaman.js";
import { getMasterPinjaman } from "../controller/pinjaman/getMasterPinjaman.js";
import { getSaldoMasterPinjaman } from "../controller/pinjaman/getSaldoMasterPinjaman.js";
import { setMasterPinjaman } from "../controller/pinjaman/setMasterPinjaman.js";
import { getMasterPinjamanLunak } from "../controller/pinjaman/getMasterPinjamanLunak.js";
import { getLaporanPinjamanLunak } from "../controller/pinjaman/getLaporanPinjamanLunak.js";
import { getJurnalPinjamanLunak } from "../controller/pinjaman/getJurnalPinjamanLunak.js";
import { getNeracaPinjamanLunak } from "../controller/pinjaman/getNeracaPinjamanLunak.js";
import { setPengampunan } from "../controller/pinjaman/setPengampunan.js";

const router = express.Router();

router.post("/getAnggotaPinjamanLunak", getAnggotaPinjamanLunak);
router.post("/getSetoranPinjaman", getSetoranPinjaman);
router.post("/getMasterPinjaman", getMasterPinjaman);
router.post("/getSaldoMasterPinjaman", getSaldoMasterPinjaman);
router.post("/setMasterPinjaman", setMasterPinjaman);
router.post("/getMasterPinjamanLunak", getMasterPinjamanLunak);
router.post("/getLaporanPinjamanLunak", getLaporanPinjamanLunak);
router.post("/getJurnalPinjamanLunak", getJurnalPinjamanLunak);
router.post("/getNeracaPinjamanLunak", getNeracaPinjamanLunak);
router.post("/setPengampunan", setPengampunan);
// router.post("/importAnggotaPinjaman", importAnggotaPinjaman);

export default router;
