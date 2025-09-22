import "dotenv/config"; // harus paling atas sebelum import midtrans.js

import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: false, // Sandbox mode
  serverKey: process.env.MIDTRANS_SERVER_KEY.replace(/[\r\n]+/g, "").trim(),
  // clientKey di backend TIDAK perlu
});

export default snap;
