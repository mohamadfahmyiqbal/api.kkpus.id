import midtransClient from "midtrans-client";

const core = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export const getMidtransTransactionStatus = async (orderId) => {
  try {
    const status = await core.transaction.status(orderId);
    return status;
  } catch (error) {
    console.error("Midtrans status error:", error);
    throw error;
  }
};
