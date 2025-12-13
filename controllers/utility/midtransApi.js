// 📁 controllers/utility/midtransApi.js (KOREKSI FINAL: Gross Amount Calculation & Return Order ID)

import "dotenv/config";
// ... (Pastikan semua import dan konfigurasi Midtrans Anda sudah benar) ...

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_IS_PRODUCTION = process.env.NODE_ENV === "production";
const FRONTEND_URL = process.env.FRONTEND_URL; // Pastikan ini ada di .env Anda
const MIDTRANS_API_BASE_URL = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1"
  : "https://app.sandbox.midtrans.com/snap/v1";

/**
 * Membuat transaksi baru di Midtrans Snap dan mengembalikan Snap Token dan Order ID.
 * @param {object} bill - Objek Bill dari database (harus sudah include items).
 * @param {object} customer - Objek Member dari database.
 * @returns {Promise<{snapToken: string, midtransOrderId: string}>} Snap Token dan Order ID.
 */
export const createSnapTransaction = async (bill, customer) => {
  // ✅ Menggunakan bill_id (BIGINT) yang benar dari model bills
  const billIdKey = bill.bill_id;
  const orderId = `BILL-${billIdKey}-${Date.now()}`;

  // 1. Siapkan Item Details dan Hitung Gross Amount
  // Asumsi: bill.items sudah ter-eager-load
  const items = bill.items.map((item) => {
    // ✅ Pastikan harga diubah ke integer (Rupiah penuh)
    const price = Math.round(parseFloat(item.amount) || 0);

    return {
      id: `ITEM-${billIdKey}-${item.bill_item_id || items.indexOf(item) + 1}`,
      price: price,
      quantity: 1,
      name: item.description,
    };
  });

  // ✅ Hitung Gross Amount dari hasil penjumlahan items
  const grossAmount = items.reduce((sum, item) => sum + item.price, 0);

  if (grossAmount <= 0) {
    throw new Error("Gross amount harus lebih besar dari nol. Cek bill.items.");
  }

  // 2. Siapkan Detail Transaksi
  const transactionDetails = {
    order_id: orderId,
    gross_amount: grossAmount,
  };

  const customerDetails = {
    first_name: customer.full_name,
    email: customer.email || "no-email@example.com",
    phone: customer.phone_number || "08123456789",
  };

  const payload = {
    transaction_details: transactionDetails,
    credit_card: {
      secure: true,
    },
    customer_details: customerDetails,
    item_details: items,
    callbacks: {
      // ✅ Menggunakan FRONTEND_URL dan memisahkan finish/error
      finish: `${FRONTEND_URL}/payment-status/finish/${billIdKey}`,
      error: `${FRONTEND_URL}/payment-status/error/${billIdKey}`,
    },
    // ... parameter Midtrans lainnya
  };

  // 3. Panggil Midtrans API
  try {
    const response = await fetch(`${MIDTRANS_API_BASE_URL}/transactions`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64"),
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.status !== 201) {
      console.error("Midtrans API Error:", data);
      throw new Error(
        data.error_messages
          ? `Midtrans Error: ${data.error_messages.join(", ")}`
          : "Gagal memanggil Midtrans API"
      );
    }

    // ✅ Mengembalikan Snap Token DAN Order ID
    return {
      snapToken: data.token,
      midtransOrderId: orderId,
    };
  } catch (error) {
    console.error("[MidtransAPI] Failed to create Snap transaction:", error);
    throw new Error(`Gagal memproses Midtrans: ${error.message}`);
  }
};
