import express from "express";
import { MidAnggota } from "../middleware/MidAnggota.js";
import MidRole from "../middleware/MidRole.js";
import { processApproval } from "../controllers/core/approvals/processApproval.js";
import { disburseWithdrawal } from "../controllers/savings/disburseWithdrawal.js";
import { verifyApprovalChain } from "../middleware/verifyApprovalChain.js";

const router = express.Router();

console.log("[approvalsRoute] Router initialized");

const REG = "members";
const WD = "savings_withdrawal";
const FIN = "financing_applications";

router.post("/process/:entityRef/:entityId", 
  MidAnggota, 
  MidRole(['PENGAWAS', 'KETUA']), 
  (req, res, next) => {
    const { entityRef } = req.params;
    return processApproval(entityRef)(req, res, next);
  }
);

router.put("/pendaftaran/approve/:entityId", MidAnggota, MidRole(["PENGAWAS", "KETUA"]), processApproval(REG));
router.put("/penarikan/approve/:entityId", MidAnggota, MidRole(["PENGAWAS", "KETUA", "BENDAHARA"]), verifyApprovalChain(WD), processApproval(WD));
router.post("/penarikan/pembayaran/:entityId", MidAnggota, MidRole(["BENDAHARA"]), disburseWithdrawal);
router.put("/financing/approve/:entityId", MidAnggota, MidRole(["PENGAWAS", "KETUA", "BENDAHARA"]), verifyApprovalChain(FIN), processApproval(FIN));
router.put("/tabungan/approve/:entityId", MidAnggota, MidRole(["PENGAWAS", "KETUA", "BENDAHARA"]), verifyApprovalChain("member_saving_targets"), processApproval("member_saving_targets"));

export default router;