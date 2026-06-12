// 📁 routes/midtrans.js
import express from 'express';
import { handleDisbursement } from '../controllers/billing/disbursementHandler.js'; // Tambahkan .js

const router = express.Router();
router.post('/disburse', handleDisbursement);

export default router;