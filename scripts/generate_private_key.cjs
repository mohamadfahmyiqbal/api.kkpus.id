const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

const privateKeyPem = privateKey;

// Write to credentials/private_key.pem
const filePath = path.join(__dirname, "..", "credentials", "private_key.pem");
fs.writeFileSync(filePath, privateKeyPem);
console.log(`✅ Private key generated and saved to ${filePath}`);
