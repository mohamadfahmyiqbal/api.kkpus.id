// 📁 src/utility/jwtHelpers.js (Helper JWT untuk Backend Node.js)

import { Buffer } from "node:buffer";
// import { Buffer } from 'buffer'; // Atau hanya ini, tergantung versi Node Anda

/**
 * Meng-encode object ke Base64 URL Safe string (Node.js version).
 * Sama seperti yang dilakukan helpers.jsx.
 * @param {object} obj
 * @returns {string} Base64 URL Safe string
 */
const encodeBase64UrlSafe = (obj) => {
  // 1. Stringify object
  const jsonString = JSON.stringify(obj);

  // 2. Encode to Base64
  const base64 = Buffer.from(jsonString, "utf8").toString("base64");

  // 3. Make it URL Safe (ganti +, / dan hapus =)
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
};

/**
 * Meng-encode object ke JWT sederhana (tanpa tanda tangan).
 * Mirip dengan jwtEncode di frontend, menggunakan Buffer.
 * @param {object} payload - Payload yang akan di-encode.
 * @returns {string} Token JWT sederhana (Header.Payload.)
 */
export const jwtEncode = (payload) => {
  const header = { alg: "none", typ: "JWT" };

  // Encode Header dan Payload
  const encodedHeader = encodeBase64UrlSafe(header);
  const encodedPayload = encodeBase64UrlSafe(payload);

  // Format JWT sederhana: Header.Payload.
  return `${encodedHeader}.${encodedPayload}.`;
};

// Anda bisa menambahkan fungsi decode jika diperlukan di backend.
