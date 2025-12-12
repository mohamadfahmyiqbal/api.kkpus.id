// 📁 utils/midtransApi.js
import crypto from 'crypto';
import 'dotenv/config'; // Pastikan dotenv sudah terinstal dan di-load

// Konfigurasi Midtrans (diambil dari .env)
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || 'YOUR_MIDTRANS_SERVER_KEY';
const MIDTRANS_IS_PRODUCTION = process.env.NODE_ENV === 'production';
const MIDTRANS_API_BASE_URL = MIDTRANS_IS_PRODUCTION
 ? "https://app.midtrans.com/snap/v1"
 : "https://app.sandbox.midtrans.com/snap/v1";

// Helper untuk membuat Signature (opsional, tergantung kebutuhan verifikasi Anda)
// const generateSignature = (orderId, statusCode, grossAmount) => { ... }

/**
 * Membuat transaksi baru di Midtrans Snap dan mengembalikan Snap Token.
 * @param {object} bill - Objek Bill dari database.
 * @param {object} customer - Objek Member dari database.
 * @returns {Promise<string>} Snap Token dari Midtrans.
 */
export const createSnapTransaction = async (bill, customer) => {
 const orderId = `BILL-${bill.id}-${Date.now()}`;
 const transactionDetails = {
  order_id: orderId,
  gross_amount: bill.total_amount,
 };

 const customerDetails = {
  first_name: customer.full_name,
  email: customer.email,
  phone: customer.phone_number,
  // Alamat lain-lain bisa ditambahkan
 };

 // Items detail (gunakan item dari BillItem jika diperlukan, di sini kita sederhanakan)
 const items = bill.items.map(item => ({
  id: `ITEM-${item.description.replace(/\s/g, '-')}`,
  price: parseInt(item.amount),
  quantity: 1,
  name: item.description,
 }));

 // Tambahkan Simpanan Pokok & Wajib sebagai item utama jika ini tagihan awal
 if (bill.bill_type === 'INITIAL_REGISTRATION') {
  // ... Logika untuk menambahkan item detail
 }

 const payload = {
  transaction_details: transactionDetails,
  credit_card: {
   secure: true
  },
  customer_details: customerDetails,
  item_details: items,
  callbacks: {
   finish: `${process.env.FRONTEND_URL}/payment-status/finish/${bill.id}`,
   finish: `${process.env.FRONTEND_URL}/payment-status/error/${bill.id}`,
  }
  // ... parameter Midtrans lainnya
 };

 try {
  const response = await fetch(`${MIDTRANS_API_BASE_URL}/transactions`, {
   method: 'POST',
   headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64')
   },
   body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (response.status !== 201) {
   console.error("Midtrans API Error:", data);
   throw new Error(data.error_messages ? data.error_messages.join(', ') : 'Gagal memanggil Midtrans API');
  }

  // Return the Snap Token
  return data.token;

 } catch (error) {
  console.error("[MidtransAPI] Failed to create Snap transaction:", error);
  throw new Error(`Gagal memproses Midtrans: ${error.message}`);
 }
};