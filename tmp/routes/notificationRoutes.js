import express from "express";
import { getNotification } from "../controller/notification/getNotification.js";
import { getNotificationByNik } from "../controller/notification/getNotificationByNik.js";
import authAnggota from "../midlleware/MidAnggota.js";
import { manageNotification } from "../controller/notification/manageNotification.js";

const router = express.Router();

router.post("/getNotification", authAnggota, getNotification);
router.post("/getNotificationByNik", authAnggota, getNotificationByNik);
router.post("/manageNotification", authAnggota, manageNotification);
export default router;
