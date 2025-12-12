// 📁 routes/approvalsRoute.js (KODE REVISI UNTUK REUSABILITY)

import express from "express";
// Import Controller Generik
import { processApproval } from "../controllers/core/approvals/processApproval.js";

// Import Middlewares
import { MidAnggota } from "../midlleware/MidAnggota.js";
import MidRole from "../midlleware/MidRole.js";

const router = express.Router();

// --- KONSTANTA FLOW SPESIFIK ---
// MEMBER REGISTRATION FLOW
const FLOW_MEMBER_REG = 'member_registration'; 
const STEP_PENGWAS = 1;
const STEP_KETUA = 2;

// FINANCING APPLICATION FLOW (Contoh skenario lain)
const FLOW_FINANCING_APP = 'FINANCING_APPLICATION';
const STEP_SPV_KREDIT = 3;
const STEP_DIREKTUR = 4;

// 1. ROUTE: Approval Pendaftaran oleh Pengawas (Step 1)
router.put(
 "/anggota/approval/pengawas/:entityId", // entityId = registration_id
 MidAnggota,
 MidRole(["Pengawas"]),
 processApproval(FLOW_MEMBER_REG, STEP_PENGWAS) // <-- Call Generik Handler
);

// 2. ROUTE: Approval Pendaftaran oleh Ketua (Step 2 - Final)
router.put(
 "/anggota/approval/ketua/:entityId", // entityId = registration_id
 MidAnggota,
 MidRole(["Ketua"]),
 processApproval(FLOW_MEMBER_REG, STEP_KETUA) // <-- Call Generik Handler
);

// 3. ROUTE: Approval Pembiayaan oleh SPV Kredit (Contoh 1)
router.put(
 "/pembiayaan/approval/spv_kredit/:entityId", // entityId = financing_id
 MidAnggota,
 MidRole(["SupervisorKredit"]),
 processApproval(FLOW_FINANCING_APP, STEP_SPV_KREDIT)
);

// 4. ROUTE: Approval Pembiayaan oleh Direktur (Contoh 2 - Final)
router.put(
 "/pembiayaan/approval/direktur/:entityId", // entityId = financing_id
 MidAnggota,
 MidRole(["Direktur"]),
 processApproval(FLOW_FINANCING_APP, STEP_DIREKTUR)
);


export default router;