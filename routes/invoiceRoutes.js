import express from "express";
import authAnggota from "../midlleware/MidAnggota.js";
import { generateInvoice } from "../controller/invoice/generateInvoice.js";
import { payInvoice } from "../controller/invoice/payInvoice.js";
import { midtransCallback } from "../controller/invoice/midtransCallback.js";
import { getPaymentFees } from "../controller/invoice/getPaymentFees.js";

const router = express.Router();

<<<<<<< HEAD
router.post("/generateInvoice", generateInvoice);
=======
router.post("/generateInvoice", authAnggota, generateInvoice);
router.post("/payInvoice", authAnggota, payInvoice);
router.post("/getPaymentFees", authAnggota, getPaymentFees);
router.post("/midtransCallback", midtransCallback);
>>>>>>> 53307aa (160925)

export default router;
