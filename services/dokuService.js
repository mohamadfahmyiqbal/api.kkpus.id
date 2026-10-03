// 📁 services/dokuService.js
import crypto from "crypto";
import axios from "axios";

/**
 * Helper untuk membersihkan tanda kutip ganda jika ada di string env
 */
const cleanEnv = (val) => {
  if (!val) return "";
  return String(val).trim().replace(/^["']|["']$/g, "");
};

/**
 * Mengambil konfigurasi DOKU secara dinamis per request (DEV vs PROD)
 */
export const getDokuConfig = () => {
  const isProd =
    process.env.NODE_ENV === "production" ||
    cleanEnv(process.env.DOKU_IS_PRODUCTION) === "true";

  const clientId = isProd
    ? cleanEnv(process.env.DOKU_PROD_CLIENT_ID || process.env.DOKU_PROD_API_KEY || process.env.DOKU_API_KEY)
    : cleanEnv(process.env.DOKU_DEV_CLIENT_ID || process.env.DOKU_DEV_API_KEY || process.env.DOKU_API_KEY);

  const apiKey = isProd
    ? cleanEnv(process.env.DOKU_PROD_API_KEY || process.env.DOKU_API_KEY)
    : cleanEnv(process.env.DOKU_DEV_API_KEY || process.env.DOKU_API_KEY);

  const secretKey = isProd
    ? cleanEnv(process.env.DOKU_PROD_SECRET_KEY || process.env.DOKU_SECRET_KEY)
    : cleanEnv(process.env.DOKU_DEV_SECRET_KEY || process.env.DOKU_SECRET_KEY);

  const publicKey = isProd
    ? cleanEnv(process.env.DOKU_PROD_PUBLIC_KEY || process.env.DOKU_PUBLIC_KEY)
    : cleanEnv(process.env.DOKU_DEV_PUBLIC_KEY || process.env.DOKU_PUBLIC_KEY);

  const baseUrl = isProd
    ? "https://api.doku.com"
    : "https://api-sandbox.doku.com";

  return {
    isProd,
    clientId,
    apiKey,
    secretKey,
    publicKey,
    baseUrl,
  };
};

/**
 * Generate Digest dari Body (SHA256 Base64)
 */
export const generateDigest = (body) => {
  const jsonBody = typeof body === "string" ? body : JSON.stringify(body);
  return crypto.createHash("sha256").update(jsonBody).digest("base64");
};

/**
 * Generate Signature DOKU Jokul API
 * Component:
 * Client-Id + "\n" +
 * Request-Id + "\n" +
 * Request-Timestamp + "\n" +
 * Request-Target + "\n" +
 * Digest
 */
export const generateSignature = ({
  clientId,
  requestId,
  requestTimestamp,
  requestTarget,
  digest,
  secretKey,
}) => {
  const config = getDokuConfig();
  const cId = clientId || config.apiKey;
  const sKey = secretKey || config.secretKey;

  let signatureComponent = `Client-Id:${cId}\nRequest-Id:${requestId}\nRequest-Timestamp:${requestTimestamp}\nRequest-Target:${requestTarget}`;
  if (digest) {
    signatureComponent += `\nDigest:${digest}`;
  }

  const hmac = crypto.createHmac("sha256", sKey);
  hmac.update(signatureComponent);
  return "HMACSHA256=" + hmac.digest("base64");
};

/**
 * Helper untuk request ke DOKU API
 */
export const dokuRequest = async ({ endpoint, method = "POST", data = null }) => {
  const config = getDokuConfig();
  const requestId = crypto.randomUUID();
  const requestTimestamp = new Date().toISOString().slice(0, 19) + "Z";
  const requestTarget = endpoint;

  let digest = "";
  if (data && (method.toUpperCase() === "POST" || method.toUpperCase() === "PUT")) {
    digest = generateDigest(data);
  }

  const signature = generateSignature({
    clientId: config.clientId,
    requestId,
    requestTimestamp,
    requestTarget,
    digest: digest || undefined,
    secretKey: config.secretKey,
  });

  const headers = {
    "Client-Id": config.clientId,
    "Request-Id": requestId,
    "Request-Timestamp": requestTimestamp,
    "Signature": signature,
    "Content-Type": "application/json",
  };

  if (digest) {
    headers["Digest"] = digest;
  }

  console.log(`[DOKU Request] ${method} ${config.baseUrl}${endpoint} using Client-Id: ${config.clientId}`);

  try {
    const response = await axios({
      url: `${config.baseUrl}${endpoint}`,
      method,
      headers,
      data,
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    const errData = error.response?.data || error.message;
    console.error(`[DOKU API Error] ${method} ${endpoint}:`, errData);

    let errorMsg = "";
    if (typeof errData === "string") {
      errorMsg = errData;
    } else if (errData && typeof errData === "object") {
      errorMsg =
        errData.error?.message ||
        errData.message ||
        (Array.isArray(errData.errors) ? errData.errors.map(e => e.message || JSON.stringify(e)).join(", ") : null) ||
        JSON.stringify(errData);
    }

    throw new Error(errorMsg || `DOKU API Error (${error.response?.status || 500})`);
  }
};

/**
 * Generate DOKU Virtual Account (Direct API)
 * Bank: bca, bni, bri, mandiri, permata, cimb, dsb.
 */
export const createVirtualAccount = async ({
  invoiceNumber,
  amount,
  customerName,
  customerEmail,
  bank,
  reusableStatus = false,
  expiredTime = 1440, // 24 jam dalam menit
}) => {
  const normalizedBank = bank.toLowerCase();

  // Endpoint direct VA DOKU
  let endpoint = `/${normalizedBank}-virtual-account/v2/payment-code`;
  if (normalizedBank === "mandiri") {
    endpoint = `/mandiri-virtual-account/v2/payment-code`;
  }

  const payload = {
    order: {
      invoice_number: invoiceNumber,
      amount: Math.round(amount),
    },
    virtual_account_info: {
      expired_time: expiredTime,
      reusable_status: reusableStatus,
      info1: "Koperasi PUS",
      info2: "Pembayaran Tagihan",
      info3: "Terima Kasih",
    },
    customer: {
      name: customerName || "Anggota Koperasi",
      email: customerEmail || "anggota@kkpus.id",
    },
  };

  const response = await dokuRequest({
    endpoint,
    method: "POST",
    data: payload,
  });

  return {
    va_number: response.virtual_account_info?.virtual_account_number,
    how_to_pay_page: response.virtual_account_info?.how_to_pay_page,
    how_to_pay_api: response.virtual_account_info?.how_to_pay_api,
    expired_date: response.virtual_account_info?.expired_date,
    raw: response,
  };
};

/**
 * Generate DOKU QRIS (Direct API)
 */
export const createQrisPayment = async ({
  invoiceNumber,
  amount,
  customerName,
  customerEmail,
  expiredTime = 1440, // menit
}) => {
  const endpoint = "/qris-virtual-account/v2/generate-qr-code";
  const payload = {
    order: {
      invoice_number: invoiceNumber,
      amount: Math.round(amount),
    },
    qris_info: {
      expired_time: expiredTime,
    },
    customer: {
      name: customerName || "Anggota Koperasi",
      email: customerEmail || "anggota@kkpus.id",
    },
  };

  const response = await dokuRequest({
    endpoint,
    method: "POST",
    data: payload,
  });

  return {
    qr_string: response.qris_info?.qr_string,
    qr_image_url: response.qris_info?.qr_image_url,
    expired_date: response.qris_info?.expired_date,
    raw: response,
  };
};

/**
 * Generate DOKU Checkout URL (Fallback jika payment method lain dipilih seperti e-wallet/kartu kredit)
 */
export const createCheckoutPayment = async ({
  invoiceNumber,
  amount,
  customerName,
  customerEmail,
  callbackUrl,
  paymentMethodTypes = [],
}) => {
  const endpoint = "/checkout/v1/payment";
  const payload = {
    order: {
      amount: Math.round(amount),
      invoice_number: invoiceNumber,
      currency: "IDR",
      callback_url: callbackUrl,
    },
    payment: {
      payment_due_date: 1440,
    },
    customer: {
      name: customerName || "Anggota Koperasi",
      email: customerEmail || "anggota@kkpus.id",
    },
  };

  // Hanya sertakan jika secara spesifik diaktifkan
  if (paymentMethodTypes && paymentMethodTypes.length > 0) {
    payload.payment.payment_method_types = paymentMethodTypes;
  }

  const response = await dokuRequest({
    endpoint,
    method: "POST",
    data: payload,
  });

  return {
    payment_url: response.response?.payment?.url,
    raw: response,
  };
};

/**
 * Verifikasi signature webhook DOKU
 */
export const verifyDokuSignature = (headers, body, requestTarget = "/webhooks/doku/notification") => {
  const config = getDokuConfig();
  const clientId = headers["client-id"];
  const requestId = headers["request-id"];
  const requestTimestamp = headers["request-timestamp"];
  const receivedSignature = headers["signature"];

  if (!receivedSignature) return false;

  const digest = generateDigest(body);
  const expectedSignature = generateSignature({
    clientId,
    requestId,
    requestTimestamp,
    requestTarget,
    digest,
    secretKey: config.secretKey,
  });

  return receivedSignature === expectedSignature;
};

/**
 * Cek status transaksi via API DOKU (Order Check Status)
 */
export const checkDokuTransactionStatus = async (invoiceNumber) => {
  const endpoint = `/orders/v1/status/${invoiceNumber}`;
  try {
    const response = await dokuRequest({
      endpoint,
      method: "GET",
    });
    return response;
  } catch (err) {
    console.error(`[checkDokuTransactionStatus] Error for ${invoiceNumber}:`, err.message);
    return null;
  }
};
