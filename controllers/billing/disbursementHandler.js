// controllers/billing/disbursementHandler.js
import db from "../../models/index.js";

export const handleDisbursement = async (req, res) => {
  try {
    const { withdrawal_id, amount, member_id, member_name, bank_details } = req.body;
    
    console.log("📥 Midtrans Disbursement Request:", {
      withdrawal_id,
      amount,
      member_id,
      member_name,
      bank_details
    });

    // Simulasi response Midtrans
    const mockResponse = {
      status: "success",
      transaction_id: `MT${Date.now()}`,
      disbursement_id: `DBS${Date.now()}`,
      amount: amount,
      recipient_account: bank_details?.accountNumber,
      recipient_bank: bank_details?.bank,
      timestamp: new Date().toISOString()
    };

    // Simpan ke database
    await db.MidtransDisbursement.create({
      withdrawal_id,
      member_id,
      amount,
      request_payload: req.body,
      response_data: mockResponse,
      status: "SUCCESS",
      midtrans_transaction_id: mockResponse.transaction_id
    });

    res.json(mockResponse);
  } catch (error) {
    console.error("Midtrans Disbursement Error:", error);
    res.status(500).json({
      status: "failed",
      error: error.message
    });
  }
};