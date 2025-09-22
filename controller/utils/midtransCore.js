import "dotenv/config"; // harus paling atas sebelum import midtrans.js
import midtransClient from "midtrans-client";

// Init Core API client
const core = new midtransClient.CoreApi({
  isProduction: false, // ubah true kalau sudah live
  serverKey: process.env.MIDTRANS_SERVER_KEY.replace(/[\r\n]+/g, "").trim(),
  clientKey: process.env.MIDTRANS_CLIENT_KEY.replace(/[\r\n]+/g, "").trim(),
});

export default core;
