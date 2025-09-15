import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: false, // set true kalau sudah live
  // serverKey: process.env.MIDTRANS_SERVER_KEY,
  // clientKey: process.env.MIDTRANS_CLIENT_KEY,
  clientKey: "Mid-client-1UWKlkYfZ4OiE2I3",
  serverKey: "Mid-server-tPgh9u6SjOHXV0ZuA26-f-xW",
});

export default snap;
