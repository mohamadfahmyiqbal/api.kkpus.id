import express from "express";
import { getApprovalByNikAndType } from "../controller/approval/getApprovalByNikAndType.js";
import { getApprovalList } from "../controller/approval/getApprovalList.js";
import authAnggota from "../midlleware/MidAnggota.js";
import { getApprovalRequestByNik } from "../controller/approval/getApprovalRequestByNik.js";
import { getApprovalDetail } from "../controller/approval/getApprovalDetail.js";
import { manageApproval } from "../controller/approval/manageApproval.js";

const router = express.Router();

router.post("/getApprovalByNikAndType", authAnggota, getApprovalByNikAndType);
router.post("/getApprovalList", authAnggota, getApprovalList);
router.post("/getApprovalRequestByNik", authAnggota, getApprovalRequestByNik);
router.post("/getApprovalDetail", authAnggota, getApprovalDetail);
router.post("/manageApproval", authAnggota, manageApproval);

export default router;
