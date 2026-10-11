import {
  createVirtualAccount,
  createQrisPayment,
  createCheckoutPayment,
} from "./dokuService.js";

/**
 * Handles communication with DOKU payment gateway (VA, QRIS, Checkout).
 */
export const requestDokuPayment = async ({
  pType,
  order_id,
  total_gross,
  member,
  successToken,
  FRONTEND_URL,
  localTx,
  dbTransaction,
}) => {
  let paymentInstruction = {};

  // A. DIRECT VIRTUAL ACCOUNT (BCA, BNI, BRI, MANDIRI, PERMATA, CIMB)
  if (["bca", "bni", "bri", "mandiri", "permata", "cimb"].includes(pType)) {
    try {
      const vaData = await createVirtualAccount({
        invoiceNumber: order_id,
        amount: total_gross,
        customerName: member.full_name,
        customerEmail: member.email,
        bank: pType,
      });

      paymentInstruction = {
        payment_type: "bank_transfer",
        provider: "doku",
        bank: pType.toUpperCase(),
        va_numbers: [
          {
            bank: pType.toLowerCase(),
            va_number: vaData.va_number,
          },
        ],
        gross_amount: total_gross,
        how_to_pay_page: vaData.how_to_pay_page,
        how_to_pay_api: vaData.how_to_pay_api,
      };

      await localTx.update(
        {
          va_number: vaData.va_number,
          bank_name: pType.toUpperCase(),
        },
        { transaction: dbTransaction }
      );
    } catch (vaErr) {
      console.warn(`[Direct VA] Failed direct ${pType.toUpperCase()} VA (${vaErr.message}), falling back to DOKU Checkout...`);
      const checkoutData = await createCheckoutPayment({
        invoiceNumber: order_id,
        amount: total_gross,
        customerName: member.full_name,
        customerEmail: member.email,
        callbackUrl: `${FRONTEND_URL}/${successToken}`,
      });

      paymentInstruction = {
        payment_type: "checkout",
        provider: "doku",
        payment_url: checkoutData.payment_url,
        gross_amount: total_gross,
      };
    }
  }

  // B. QRIS DIRECT DOKU API
  else if (pType === "qris") {
    try {
      const qrisData = await createQrisPayment({
        invoiceNumber: order_id,
        amount: total_gross,
        customerName: member.full_name,
        customerEmail: member.email,
      });

      paymentInstruction = {
        payment_type: "qris",
        provider: "doku",
        qr_string: qrisData.qr_string,
        qr_image_url: qrisData.qr_image_url,
        expired_date: qrisData.expired_date,
        gross_amount: total_gross,
        actions: [
          {
            name: "generate-qr-code",
            url: qrisData.qr_image_url,
          },
        ],
      };
    } catch (qrisErr) {
      console.warn("[Direct QRIS] Failed generating direct QRIS, falling back to DOKU Checkout:", qrisErr.message);
      const checkoutData = await createCheckoutPayment({
        invoiceNumber: order_id,
        amount: total_gross,
        customerName: member.full_name,
        customerEmail: member.email,
        callbackUrl: `${FRONTEND_URL}/${successToken}`,
        paymentMethodTypes: ["QRIS"],
      });

      paymentInstruction = {
        payment_type: "checkout",
        provider: "doku",
        payment_url: checkoutData.payment_url,
        gross_amount: total_gross,
      };
    }
  }

  // C. E-WALLET / LAINNYA -> VIA DOKU CHECKOUT URL
  else {
    const checkoutData = await createCheckoutPayment({
      invoiceNumber: order_id,
      amount: total_gross,
      customerName: member.full_name,
      customerEmail: member.email,
      callbackUrl: `${FRONTEND_URL}/${successToken}`,
    });

    paymentInstruction = {
      payment_type: "checkout",
      provider: "doku",
      payment_url: checkoutData.payment_url,
      gross_amount: total_gross,
    };
  }

  return paymentInstruction;
};
