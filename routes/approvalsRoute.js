import express from "express";
import { MidAnggota } from "../middleware/MidAnggota.js";
import MidRole from "../middleware/MidRole.js";
import { processApproval } from "../controllers/core/approvals/processApproval.js";
import { disburseWithdrawal } from "../controllers/savings/disburseWithdrawal.js";
import { verifyApprovalChain } from "../middleware/verifyApprovalChain.js";
import approveSukukOrder from "../controllers/financing/approveSukukOrder.js";
import { getPendingMemberApprovals } from "../controllers/core/approvals/getPendingMemberApprovals.js";

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

// Get pending approvals for members
router.get("/pendaftaran/pending", MidAnggota, MidRole(), getPendingMemberApprovals);

router.put("/pendaftaran/approve/:entityId", MidAnggota, MidRole(["PENGAWAS", "KETUA"]), processApproval(REG));
router.put("/penarikan/approve/:entityId", MidAnggota, MidRole(["PENGAWAS", "KETUA", "BENDAHARA"]), verifyApprovalChain(WD), processApproval(WD));
router.post("/penarikan/pembayaran/:entityId", MidAnggota, MidRole(["BENDAHARA"]), disburseWithdrawal);
router.put("/financing/approve/:entityId", MidAnggota, MidRole(["PENGAWAS", "KETUA", "BENDAHARA"]), verifyApprovalChain(FIN), processApproval(FIN));
router.put("/tabungan/approve/:entityId", MidAnggota, MidRole(["PENGAWAS", "KETUA", "BENDAHARA"]), verifyApprovalChain("member_saving_targets"), processApproval("member_saving_targets"));

// Custom sukuk order approval bypassing ApprovalFlow
router.put("/sukuk/approve/:entityId", MidAnggota, MidRole(["PENGAWAS", "KETUA", "BENDAHARA"]), approveSukukOrder);

export default router;