// 📁 controllers/utility/midtransDisbursement.js
import axios from "axios";
import db from "../../models/index.js";

/**
 * Fungsi untuk menembak API Iris Midtrans
 */
export const initiateMidtransDisbursement = async (data, transaction) => {
  const { withdrawalId, amount, memberId, memberName, bankAccount } = data;
  
  // Ambil Config dari ENV
  const IRIS_API_KEY = process.env.MIDTRANS_IRIS_API_KEY;
  const IRIS_BASE_URL = process.env.MIDTRANS_IRIS_URL; // misal: https://app.sandbox.midtrans.com/iris/api/v1
  
  const authHeader = Buffer.from(`${IRIS_API_KEY}:`).toString("base64");

  try {
    const payload = {
      disbursements: [
        {
          amount: amount.toString(),
          beneficiary_name: memberName,
          beneficiary_account: bankAccount.accountNumber,
          beneficiary_bank: bankAccount.bank,
          remark: `Penarikan Dana KKPUS - WD-${withdrawalId}`,
        }
      ]
    };

    // 1. Simpan Log Request ke tabel midtrans_disbursements
    const log = await db.MidtransDisbursement.create({
      withdrawal_id: withdrawalId,
      member_id: memberId,
      amount: amount,
      request_payload: JSON.stringify(payload),
      status: 'PENDING_EXTERNAL'
    }, { transaction });

    // 2. Kirim ke Midtrans Iris
    const response = await axios.post(`${IRIS_BASE_URL}/disbursements`, payload, {
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "X-Idempotency-Key": `WD-${withdrawalId}`, // Mencegah double transfer jika terjadi retry
        "Content-Type": "application/json"
      }
    });

    // 3. Update Log dengan response
    await log.update({
      response_data: JSON.stringify(response.data),
      status: 'SUCCESS_SENT',
      midtrans_transaction_id: response.data.disbursements[0].reference_no
    }, { transaction });

    return {
      status: "success",
      transaction_id: response.data.disbursements[0].reference_no
    };

  } catch (error) {
    console.error("IRIS_API_ERROR:", error.response?.data || error.message);
    
    // Log error jika terjadi kegagalan API
    await db.MidtransDisbursement.create({
      withdrawal_id: withdrawalId,
      member_id: memberId,
      amount: amount,
      error_message: error.response?.data ? JSON.stringify(error.response.data) : error.message,
      status: 'FAILED'
    }, { transaction });

    throw new Error(`Gagal mengirim permintaan ke Midtrans Iris: ${error.message}`);
  }
};