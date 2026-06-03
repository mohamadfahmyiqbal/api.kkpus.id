// 📁 controllers/utility/midtransApi.js (KODE FINAL DENGAN JWT REDIRECT)

import "dotenv/config";
import crypto from "crypto";

// 🚨 PENTING: GANTI BARIS INI!
// Pastikan path ini menunjuk ke file helper JWT versi Node.js Anda (Bukan helpers.jsx).
// Contoh: import { jwtEncode } from "../../utility/jwtHelpers.js";
import { jwtEncode } from "../utility/jwtHelpers.js";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_IS_PRODUCTION = process.env.NODE_ENV === "production";
const FRONTEND_URL = process.env.FRONTEND_URL; // Harus disetel ke https://kkpus.id
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
  const billIdKey = bill.bill_id;
  const orderId = `BILL-${billIdKey}-${Date.now()}`;

  // 1. Siapkan Item Details dan Hitung Gross Amount
  const items = bill.items.map((item) => {
    const price = Math.round(parseFloat(item.amount) || 0);

    return {
      id: `ITEM-${billIdKey}-${item.bill_item_id || items.indexOf(item) + 1}`,
      price: price,
      quantity: 1,
      name: item.description,
    };
  });

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

  // ---------------------------------------------
  // ✅ PENGGUNAAN JWT UNTUK REDIRECT CALLBACK
  // ---------------------------------------------

  // pageName sesuai dengan key di globalRoutes.jsx
  const pageName = "invoicePage";
  // returnPage disetel ke 'registrationPage' sesuai contoh token yang Anda berikan.
  const returnPage = "registrationPage";

  const basePayload = {
    page: pageName,
    billId: billIdKey,
    billItemIds: bill.items ? bill.items.map(item => item.bill_item_id) : [],
    return: returnPage,
  };

  // Encode Token untuk Success dan Error
  // Halaman InvoicePage akan membaca status, billId, dan returnPage dari token ini.
  const successToken = jwtEncode({ ...basePayload, status: "success" });
  const errorToken = jwtEncode({ ...basePayload, status: "error" });

  // 🛑 PAYLOAD AKHIR MIDTRANS
  const payload = {
    transaction_details: transactionDetails,
    credit_card: {
      secure: true,
    },
    customer_details: customerDetails,
    item_details: items,
    callbacks: {
      // ✅ KOREKSI FINAL: URL diubah menjadi [FRONTEND_URL]/[TOKEN]
      finish: `${FRONTEND_URL}/${successToken}`,
      error: `${FRONTEND_URL}/${errorToken}`,
    },
    // Hapus field finish_url, unfinish_url, error_url agar tidak konflik
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

    return {
      snapToken: data.token,
      midtransOrderId: orderId,
    };
  } catch (error) {
    console.error("[MidtransAPI] Failed to create Snap transaction:", error);
    throw new Error(`Gagal memproses Midtrans: ${error.message}`);
  }
};

/**
 * Memverifikasi signature key yang dikirim oleh Midtrans.
 * FUNGSI KEAMANAN KRITIS!
 */
export const verifySignatureKey = (notificationBody, signatureKey) => {
  const order_id = notificationBody.order_id;
  const status_code = notificationBody.status_code;
  const gross_amount = notificationBody.gross_amount;

  const stringToHash =
    order_id + status_code + gross_amount + MIDTRANS_SERVER_KEY;

  const generatedSignature = crypto
    .createHash("sha512")
    .update(stringToHash)
    .digest("hex");

  return generatedSignature === signatureKey;
};
