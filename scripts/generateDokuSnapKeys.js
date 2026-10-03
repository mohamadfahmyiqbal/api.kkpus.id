// 📁 scripts/generateDokuSnapKeys.js
import crypto from "crypto";

console.log("Generating 2048-bit RSA Key Pair for DOKU SNAP...\n");

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

// Format single-line public key untuk dashboard DOKU (tanpa header/footer PEM)
const cleanPublicKey = publicKey
  .replace(/-----BEGIN PUBLIC KEY-----/g, "")
  .replace(/-----END PUBLIC KEY-----/g, "")
  .replace(/\r?\n|\r/g, "")
  .trim();

// Format single-line private key dengan escape newline untuk .env
const envFormattedPrivateKey = privateKey.replace(/\r?\n/g, "\\n");

console.log("===============================================================================");
console.log("1. PUBLIC KEY UNTUK DASHBOARD DOKU (Copy dan paste ke DOKU Dashboard):");
console.log("===============================================================================");
console.log(cleanPublicKey);
console.log("\n");

console.log("===============================================================================");
console.log("2. PRIVATE KEY UNTUK DITAMBAHKAN KE FILE .env (DOKU_DEV_PRIVATE_KEY):");
console.log("===============================================================================");
console.log(`DOKU_DEV_PRIVATE_KEY="${envFormattedPrivateKey}"`);
console.log("\n===============================================================================");
console.log("Langkah selanjutnya:");
console.log("1. Masukkan DOKU_DEV_PRIVATE_KEY ke file .env di server Anda.");
console.log("2. Buka DOKU Dashboard Sandbox > Settings/Integrations > Public Key.");
console.log("3. Paste isi PUBLIC KEY di atas ke kolom Public Key DOKU lalu simpan.");
console.log("===============================================================================\n");
