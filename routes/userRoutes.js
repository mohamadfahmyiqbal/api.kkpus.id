import express from "express";
import { Register } from "../controller/anggota/CRegister.js";
import { Login } from "../controller/anggota/CLogin.js";
import { Logout } from "../controller/anggota/CLogout.js";
import { FindAnggotaByToken } from "../controller/anggota/CfindAnggotaByToken.js";
import { AnggotaList } from "../controller/anggota/AnggotaList.js";
import { Forgot, verifikasiOTP } from "../controller/anggota/CForgot.js";
import { resetPassword } from "../controller/anggota/CResetPassword.js";
import { DaftarAnggota } from "../controller/anggota/DaftarAnggota.js";
import { uploadFotoKtp } from "../midlleware/uploadFiles.js";
import { CekPendaftaranAnggota } from "../controller/anggota/CekPendaftaranAnggota.js";
import authAnggota from "../midlleware/MidAnggota.js";
import { getAnggotaCategory } from "../controller/anggota/GetAnggotaCategory.js";
import { getDetailAnggotaByToken } from "../controller/anggota/getDetailAnggotaByToken.js";

const router = express.Router();

// Route tanpa autentikasi
router.post("/login", Login);
router.post("/register", Register);
router.post("/forgot", Forgot);
router.post("/verifikasiOTP", verifikasiOTP);
router.post("/resetPassword", resetPassword);

// Route tanpa autentikasi (authAnggota dilepas)
router.post("/logout", authAnggota, Logout);
router.post("/findAnggotaByToken", authAnggota, FindAnggotaByToken);
router.post("/anggotaList", authAnggota, AnggotaList);
router.post("/getAnggotaCategory", authAnggota, getAnggotaCategory);

// Route daftarAnggota: upload file middleware + controller (tanpa auth)
router.post("/daftarAnggota", authAnggota, uploadFotoKtp, DaftarAnggota);
router.post("/cekPendaftaranAnggota", authAnggota, CekPendaftaranAnggota);

export default router;
