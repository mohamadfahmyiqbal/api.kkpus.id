import midtransClient from "midtrans-client";

const core = new midtransClient.CoreApi({
  isProduction: process.env.NODE_ENV === "production",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

/**
 * Maps payment_type to Midtrans parameters and fee.
 */
export const buildMidtransPayload = (payment_type, total_gross, FRONTEND_URL, successToken) => {
  const pType = payment_type.toLowerCase();
  let midtrans_payment_type = "";
  let payment_params = {};
  let fee = 0;

  switch (pType) {
    case "bca":
    case "bni":
    case "bri":
    case "cimb":
    case "permata":
      midtrans_payment_type = "bank_transfer";
      fee = 4440;
      payment_params = {
        bank_transfer: {
          bank: pType,
        },
      };
      break;

    case "mandiri":
      midtrans_payment_type = "echannel";
      fee = 4440;
      payment_params = {
        echannel: {
          bill_info1: "Pembayaran",
          bill_info2: "Tagihan Koperasi",
        },
      };
      break;

    case "gopay":
      midtrans_payment_type = "gopay";
      fee = Math.round(total_gross * 0.02);
      payment_params = {
        gopay: {
          enable_callback: true,
          callback_url: `${FRONTEND_URL}/${successToken}`,
        },
      };
      break;

    case "shopeepay":
      midtrans_payment_type = "shopeepay";
      fee = Math.round(total_gross * 0.02);
      payment_params = {
        shopeepay: {
          callback_url: `${FRONTEND_URL}/${successToken}`,
        },
      };
      break;

    case "qris":
      midtrans_payment_type = "qris";
      fee = Math.round(total_gross * 0.007);
      break;

    case "indomaret":
    case "alfamart":
      midtrans_payment_type = "cstore";
      fee = 5550;
      payment_params = {
        cstore: {
          store: pType,
          message: "Tagihan Koperasi",
        },
      };
      break;

    case "credit_card":
      midtrans_payment_type = "credit_card";
      fee = Math.round(total_gross * 0.029) + 2000;
      payment_params = {
        credit_card: {
          secure: true,
        },
      };
      break;

    default:
      throw new Error("Metode pembayaran tidak didukung.");
  }

  return { midtrans_payment_type, payment_params, fee };
};

/**
 * Dispatches charge request to Midtrans Core API.
 */
export const requestMidtransCharge = async ({
  order_id,
  total_gross,
  item_details,
  member,
  payment_type,
  FRONTEND_URL,
  successToken,
}) => {
  const { midtrans_payment_type, payment_params, fee } = buildMidtransPayload(
    payment_type,
    total_gross,
    FRONTEND_URL,
    successToken
  );

  let final_gross = total_gross;
  const items = [...item_details];

  if (fee > 0) {
    final_gross += fee;
    items.push({
      id: "FEE-1",
      price: fee,
      quantity: 1,
      name: "Biaya Transaksi / Layanan",
    });
  }

  const midtransTx = await core.charge({
    payment_type: midtrans_payment_type,
    transaction_details: { order_id, gross_amount: final_gross },
    item_details: items,
    customer_details: {
      first_name: member.full_name,
      email: member.email || "no-email@example.com",
    },
    ...payment_params,
    custom_field1: "koperasi_digital",
  });

  return { midtransTx, final_gross, fee };
};
