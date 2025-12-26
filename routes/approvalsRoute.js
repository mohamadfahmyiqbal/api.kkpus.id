import express from "express";
import { processApproval } from "../controllers/core/approvals/processApproval.js";
import { disburseWithdrawal } from "../controllers/savings/disburseWithdrawal.js"; 
import { MidAnggota } from "../middleware/MidAnggota.js";
import MidRole from "../middleware/MidRole.js";

const router = express.Router();

const FLOW_MEMBER_REG = 'member_registration';
const FLOW_SAVINGS_WD = 'savings_withdrawal';

// Pastikan penulisan :entityId menyambung sempurna
router.put("/pendaftaran/approval/pengawas/:entityId", MidAnggota, MidRole(["Pengawas"]), processApproval(FLOW_MEMBER_REG, 1));
router.put("/pendaftaran/approval/ketua/:entityId", MidAnggota, MidRole(["Ketua"]), processApproval(FLOW_MEMBER_REG, 2));

router.put("/penarikan/approval/pengawas/:entityId", MidAnggota, MidRole(["Pengawas"]), processApproval(FLOW_SAVINGS_WD, 13));
router.put("/penarikan/approval/ketua/:entityId", MidAnggota, MidRole(["Ketua"]), processApproval(FLOW_SAVINGS_WD, 14));

router.post("/penarikan/pembayaran/:withdrawal_id", MidAnggota, MidRole(["Bendahara"]), disburseWithdrawal);

export default router;