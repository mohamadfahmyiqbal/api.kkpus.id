import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Konfigurasi Midtrans Iris (Payouts)
 * Pastikan menggunakan API Key dari Dashboard Iris (Creator/Approver Key)
 */
const iris = new midtransClient.Iris({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    // Untuk Iris, SDK tetap menggunakan properti 'serverKey' 
    // tapi isinya WAJIB API KEY IRIS
    serverKey: process.env.MIDTRANS_IRIS_API_KEY 
});

export default iris;