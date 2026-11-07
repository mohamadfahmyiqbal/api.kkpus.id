// 📁 utils/jwtHelpers.js (Helper JWT untuk Backend Node.js)

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
 * Meng-encode object ke JWT dengan signing (secure).
 * Digunakan untuk validasi frontend server-side.
 * @param {object} payload - Payload yang akan di-encode.
 * @param {string} secret - JWT signing secret key.
 * @returns {string} Signed JWT token.
 */
export const jwtEncode = (payload, secret) => {
  const header = {
    alg: "HS512", // HMAC SHA-512
    typ: "JWT"
  };

  // Encode Header
  const encodedHeader = encodeBase64UrlSafe(header);
  
  // Encode Payload
  const encodedPayload = encodeBase64UrlSafe(payload);

  // Sign the token with HMAC SHA-512
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = Buffer.from(
    require('crypto')
      .createHmac('sha512', secret)
      .update(signingInput)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  );

  // Format JWT: Header.Payload.Signature
  return `${signingInput}.${signature.toString('utf8')}`;
};

// Anda bisa menambahkan fungsi decode jika diperlukan di backend.
