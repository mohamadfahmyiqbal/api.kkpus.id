import axios from "axios";

/**
 * Base URL Midtrans
 */
const MIDTRANS_BASE_URL =
  process.env.MIDTRANS_IS_PRODUCTION === "true"
    ? "https://api.midtrans.com"
    : "https://api.sandbox.midtrans.com";

/**
 * Basic Auth Header
 * (SERVER KEY, bukan client key)
 */
const getAuthHeader = () => {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  return `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`;
};

/**
 * Trigger payout ke rekening anggota
 */
export const triggerMidtransPayout = async (entity) => {
  const bank = entity.member?.bankAccounts?.[0];

  if (!bank) {
    throw new Error(
      `Anggota (ID: ${entity.member_id}) belum memiliki rekening bank`
    );
  }

  const payload = {
    payouts: [
      {
        beneficiary_name: entity.member.full_name,
        beneficiary_account: bank.bank_account_no,
        beneficiary_bank: bank.bank_name
          .toLowerCase()
          .replace("bank ", "")
          .trim(),
        amount: Number(entity.amount),
        notes: `Penarikan Dana #${entity.id}`,
        reference_no: `WITHDRAW-${entity.id}`,
      },
    ],
  };

  try {
    console.log("🚀 Trigger Midtrans Payout:", payload);

    const response = await axios.post(
      `${MIDTRANS_BASE_URL}/v2/payouts`,
      payload,
      {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );

    const payout = response.data.payouts[0];

    console.log("✅ Payout queued:", payout);

    return {
      payout_id: payout.id,
      payout_status: payout.status,
      raw: payout,
    };
  } catch (error) {
    console.error(
      "❌ Midtrans Payout Error:",
      error.response?.data || error.message
    );
    throw new Error("Gagal memicu payout Midtrans");
  }
};
