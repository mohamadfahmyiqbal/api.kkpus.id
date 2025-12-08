import express from "express";
import { getApprovalByNikAndType } from "../controllers/approval/getApprovalByNikAndType.js";
import { getApprovalList } from "../controllers/approval/getApprovalList.js";
import authAnggota from "../midlleware/MidAnggota.js";
import { getApprovalRequestByNik } from "../controllers/approval/getApprovalRequestByNik.js";
import { getApprovalDetail } from "../controllers/approval/getApprovalDetail.js";
import { manageApproval } from "../controllers/approval/manageApproval.js";

const router = express.Router();

router.post("/getApprovalByNikAndType", authAnggota, getApprovalByNikAndType);
router.post("/getApprovalList", authAnggota, getApprovalList);
router.post("/getApprovalRequestByNik", authAnggota, getApprovalRequestByNik);
router.post("/getApprovalDetail", authAnggota, getApprovalDetail);
router.post("/manageApproval", authAnggota, manageApproval);

export default router;
