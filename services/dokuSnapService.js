// 📁 services/dokuSnapService.js
import crypto from "crypto";
import axios from "axios";
import { getDokuConfig } from "./dokuService.js";

/**
 * Helper membersihkan string dari env
 */
const cleanEnv = (val) => {
  if (!val) return "";
  return String(val).trim().replace(/^["']|["']$/g, "");
};

/**
 * Format timestamp ISO 8601 standar SNAP BI: YYYY-MM-DDTHH:mm:ss+07:00
 */
export const getSnapTimestamp = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const padMs = (n) => String(n).padStart(3, "0");

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  // Zona waktu WIB (+07:00)
  const tzOffset = -now.getTimezoneOffset();
  const sign = tzOffset >= 0 ? "+" : "-";
  const offsetHours = pad(Math.floor(Math.abs(tzOffset) / 60));
  const offsetMinutes = pad(Math.abs(tzOffset) % 60);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMinutes}`;
};

/**
 * Mengambil Private Key yang valid untuk RSA signing
 */
export const getSnapPrivateKey = () => {
  const isProd =
    process.env.NODE_ENV === "production" ||
    cleanEnv(process.env.DOKU_IS_PRODUCTION) === "true";

  let keyStr = isProd
    ? cleanEnv(process.env.DOKU_PROD_PRIVATE_KEY || process.env.DOKU_PRIVATE_KEY)
    : cleanEnv(process.env.DOKU_DEV_PRIVATE_KEY || process.env.DOKU_PRIVATE_KEY);

  if (!keyStr) {
    throw new Error("DOKU_DEV_PRIVATE_KEY / DOKU_PRIVATE_KEY belum dikonfigurasi di .env");
  }

  // Handle escape \n dari .env
  keyStr = keyStr.replace(/\\n/g, "\n").trim();

  // Tambahkan PEM wrapper jika belum ada
  if (!keyStr.includes("-----BEGIN")) {
    keyStr = `-----BEGIN PRIVATE KEY-----\n${keyStr}\n-----END PRIVATE KEY-----`;
  }

  return keyStr;
};

/**
 * 1. Generate Signature Asimetris SHA256withRSA untuk Get Token B2B
 * StringToSign = ClientId + "|" + X-TIMESTAMP
 */
export const generateSnapAsymmetricSignature = ({ clientId, timestamp, privateKey }) => {
  const stringToSign = `${clientId}|${timestamp}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(stringToSign);
  return signer.sign(privateKey, "base64");
};

/**
 * 2. Generate Signature Simetris HMAC-SHA512 untuk SNAP Transaction
 * StringToSign = HTTPMethod + ":" + EndpointUrl + ":" + AccessToken + ":" + MinifyHex(SHA256(Body)) + ":" + X-TIMESTAMP
 */
export const generateSnapSymmetricSignature = ({
  httpMethod,
  endpointUrl,
  accessToken,
  body,
  timestamp,
  secretKey,
}) => {
  const minifiedBody = body ? (typeof body === "string" ? body : JSON.stringify(body)) : "";
  const bodyHashHex = crypto.createHash("sha256").update(minifiedBody).digest("hex").toLowerCase();
  const stringToSign = `${httpMethod.toUpperCase()}:${endpointUrl}:${accessToken}:${bodyHashHex}:${timestamp}`;

  return crypto.createHmac("sha512", secretKey).update(stringToSign).digest("base64");
};

// In-memory token cache (valid selama 15 menit)
let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Mengambil Access Token B2B dari DOKU SNAP
 * Endpoint: POST /authorization/v1/access-token/b2b
 */
export const getDokuSnapAccessToken = async () => {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  const config = getDokuConfig();
  const timestamp = getSnapTimestamp();
  const privateKey = getSnapPrivateKey();
  const signature = generateSnapAsymmetricSignature({
    clientId: config.clientId,
    timestamp,
    privateKey,
  });

  const endpoint = "/authorization/v1/access-token/b2b";
  const url = `${config.baseUrl}${endpoint}`;

  console.log(`[DOKU SNAP] Requesting Access Token B2B to ${url} (Client-Id: ${config.clientId})`);

  try {
    const response = await axios.post(
      url,
      { grantType: "client_credentials" },
      {
        headers: {
          "X-CLIENT-KEY": config.clientId,
          "X-TIMESTAMP": timestamp,
          "X-SIGNATURE": signature,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    const token = response.data?.accessToken;
    const expiresIn = Number(response.data?.expiresIn) || 900; // default 15 menit

    if (!token) {
      throw new Error(`Respon DOKU tidak menyertakan accessToken: ${JSON.stringify(response.data)}`);
    }

    cachedToken = token;
    tokenExpiresAt = Date.now() + expiresIn * 1000;
    console.log(`[DOKU SNAP] Access Token B2B berhasil didapatkan (expires in ${expiresIn}s)`);

    return token;
  } catch (error) {
    const errData = error.response?.data || error.message;
    console.error("[DOKU SNAP Token Error]:", errData);
    const msg = errData?.responseMessage || errData?.error?.message || errData?.message || JSON.stringify(errData);
    throw new Error(`Gagal mendapatkan SNAP Access Token: ${msg}`);
  }
};

/**
 * 3. Inquiry Rekening Bank via SNAP Kirim DOKU untuk mendapatkan sessionId
 * Endpoint: POST /snap/v1.1/emoney/bank-account-inquiry
 */
export const bankAccountInquirySnap = async ({
  partnerReferenceNo,
  beneficiaryBankCode,
  beneficiaryAccountNumber,
  beneficiaryName,
  amount,
  phone,
}) => {
  const config = getDokuConfig();
  const accessToken = await getDokuSnapAccessToken();
  const timestamp = getSnapTimestamp();
  const endpoint = "/snap/v1.1/emoney/bank-account-inquiry";
  const uniqueRef = `INQ-${partnerReferenceNo}-${Date.now().toString().slice(-4)}`;
  const externalId = `EXT-${uniqueRef}`;

  const payload = {
    partnerReferenceNo: String(uniqueRef).slice(0, 64),
    customerNumber: String(phone || "6281234567890").slice(0, 32),
    beneficiaryAccountNumber: String(beneficiaryAccountNumber).slice(0, 32),
    amount: {
      value: `${parseFloat(amount).toFixed(2)}`,
      currency: "IDR",
    },
    additionalInfo: {
      channelCode: "07",
      beneficiaryBankCode: String(beneficiaryBankCode),
      beneficiaryAccountName: beneficiaryName || "Anggota Koperasi",
      beneficiaryName: beneficiaryName || "Anggota Koperasi",
      senderCountryCode: "ID",
    },
  };

  const signature = generateSnapSymmetricSignature({
    httpMethod: "POST",
    endpointUrl: endpoint,
    accessToken,
    body: payload,
    timestamp,
    secretKey: config.secretKey,
  });

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "X-TIMESTAMP": timestamp,
    "X-SIGNATURE": signature,
    "X-PARTNER-ID": config.clientId,
    "X-EXTERNAL-ID": externalId,
    "CHANNEL-ID": "95221",
  };

  console.log(`[DOKU SNAP] Menjalankan Bank Account Inquiry ke ${beneficiaryBankCode} ${beneficiaryAccountNumber}...`);

  try {
    const response = await axios.post(`${config.baseUrl}${endpoint}`, payload, {
      headers,
      timeout: 30000,
    });
    console.log(`[DOKU SNAP Inquiry Success]:`, response.data);
    return response.data;
  } catch (error) {
    const errData = error.response?.data || error.message;
    console.error(`[DOKU SNAP Inquiry Error]:`, errData);
    const msg = errData?.responseMessage || errData?.message || JSON.stringify(errData);
    throw new Error(`Inquiry Rekening SNAP DOKU gagal: ${msg}`);
  }
};

/**
 * Eksekusi Transfer Bank via SNAP Kirim DOKU
 * Endpoint: POST /snap/v1.1/emoney/transfer-bank
 */
export const transferBankSnap = async ({
  partnerReferenceNo,
  beneficiaryBankCode,
  beneficiaryAccountNumber,
  beneficiaryName,
  beneficiaryPhone,
  amount,
  notes,
}) => {
  const config = getDokuConfig();
  const accessToken = await getDokuSnapAccessToken();
  const timestamp = getSnapTimestamp();
  const endpoint = "/snap/v1.1/emoney/transfer-bank";
  const uniqueRef = `${partnerReferenceNo}-${Date.now().toString().slice(-6)}`;
  const externalId = `EXT-${uniqueRef}`;

  // Format nomor HP standar internasional DOKU (misal: 628xxx)
  let cleanPhone = String(beneficiaryPhone || "").replace(/\D/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "62" + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith("62")) {
    cleanPhone = cleanPhone ? "62" + cleanPhone : "6281234567890";
  }

  // 1. Eksekusi Inquiry terlebih dahulu untuk mendapatkan sessionId resmi dari DOKU
  const inquiryRes = await bankAccountInquirySnap({
    partnerReferenceNo,
    beneficiaryBankCode,
    beneficiaryAccountNumber,
    beneficiaryName,
    amount,
    phone: cleanPhone,
  });

  const sessionId = inquiryRes?.sessionId || inquiryRes?.referenceNo;
  if (!sessionId) {
    throw new Error(`Gagal mendapatkan sessionId dari respon inquiry DOKU: ${JSON.stringify(inquiryRes)}`);
  }

  // Ambil nama terverifikasi dari inquiry jika tersedia
  const verifiedAccountName = inquiryRes?.beneficiaryAccountName || beneficiaryName || "Anggota Koperasi";

  // Pecah nama depan & belakang untuk kelengkapan standar Remit DOKU
  const nameParts = String(verifiedAccountName).trim().split(/\s+/);
  const firstName = nameParts[0] || "Anggota";
  const lastName = nameParts.slice(1).join(" ") || firstName;

  const payload = {
    partnerReferenceNo: String(uniqueRef).slice(0, 64),
    customerNumber: String(cleanPhone).slice(0, 32),
    beneficiaryAccountNumber: String(beneficiaryAccountNumber).slice(0, 32),
    beneficiaryBankCode: String(beneficiaryBankCode),
    amount: {
      value: `${parseFloat(amount).toFixed(2)}`,
      currency: "IDR",
    },
    sessionId: String(sessionId).slice(0, 25),
    additionalInfo: {
      channelCode: "07",
      beneficiaryBankCode: String(beneficiaryBankCode),
      beneficiaryAccountName: verifiedAccountName,
      beneficiaryName: verifiedAccountName,
      beneficiaryFirstName: firstName,
      beneficiaryLastName: lastName,
      beneficiaryPhoneNumber: cleanPhone,
      senderCountryCode: "ID",
      notes: notes || `Pencairan Simpanan KKPUS - ${partnerReferenceNo}`,
    },
  };

  const signature = generateSnapSymmetricSignature({
    httpMethod: "POST",
    endpointUrl: endpoint,
    accessToken,
    body: payload,
    timestamp,
    secretKey: config.secretKey,
  });

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "X-TIMESTAMP": timestamp,
    "X-SIGNATURE": signature,
    "X-PARTNER-ID": config.clientId,
    "X-EXTERNAL-ID": externalId,
    "CHANNEL-ID": "95221",
  };

  console.log(`[DOKU SNAP] Mengirim transfer bank ke ${beneficiaryBankCode} ${beneficiaryAccountNumber} sebesar Rp ${amount} (Session: ${sessionId})`);

  try {
    const response = await axios.post(`${config.baseUrl}${endpoint}`, payload, {
      headers,
      timeout: 35000,
    });

    console.log(`[DOKU SNAP Transfer Success]:`, response.data);
    return response.data;
  } catch (error) {
    const errData = error.response?.data || error.message;
    console.error(`[DOKU SNAP Transfer Error]:`, errData);
    const msg = errData?.responseMessage || errData?.message || JSON.stringify(errData);
    throw new Error(`Transfer Bank SNAP DOKU gagal: ${msg}`);
  }
};
