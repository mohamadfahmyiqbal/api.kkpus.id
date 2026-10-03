// 📁 services/dokuDisbursementService.js
import axios from "axios";
import db from "../models/index.js";
import { dokuRequest, getDokuConfig } from "./dokuService.js";
import { transferBankSnap } from "./dokuSnapService.js";

/**
 * Normalisasi kode bank lokal ke format standar DOKU Cash Out / Transfer Bank
 */
export const normalizeBankCode = (bankName) => {
  if (!bankName) return "BCA";
  const name = bankName.toUpperCase().trim();

  if (name.includes("BCA")) return "BCA";
  if (name.includes("MANDIRI")) return "MANDIRI";
  if (name.includes("BRI")) return "BRI";
  if (name.includes("BNI")) return "BNI";
  if (name.includes("CIMB")) return "CIMB";
  if (name.includes("PERMATA")) return "PERMATA";
  if (name.includes("DANAMON")) return "DANAMON";
  if (name.includes("BSI") || name.includes("SYARIAH INDONESIA")) return "BSI";
  if (name.includes("BTN")) return "BTN";
  if (name.includes("BTPN") || name.includes("JENIUS")) return "BTPN";
  if (name.includes("JAGO")) return "JAGO";
  if (name.includes("MEGA")) return "MEGA";
  if (name.includes("PANIN")) return "PANIN";

  return name;
};

/**
 * Eksekusi transfer dana keluar (Disbursement / Cash Out) via DOKU
 * @param {Object} data
 * @param {string} data.withdrawalId
 * @param {number} data.amount
 * @param {string} data.memberId
 * @param {string} data.memberName
 * @param {Object} data.bankAccount - { bank, accountNumber, accountHolder }
 * @param {Object} transaction - Sequelize transaction (optional)
 */
export const initiateDokuDisbursement = async (data, transaction) => {
  const { withdrawalId, amount, memberId, memberName, bankAccount } = data;
  const config = getDokuConfig();

  const formattedBankCode = normalizeBankCode(bankAccount.bank);
  const targetAccountNumber = String(bankAccount.accountNumber || "").replace(/\D/g, "");

  const payload = {
    order: {
      invoice_number: `WD-${withdrawalId}`,
      amount: Math.round(Number(amount)),
    },
    beneficiary: {
      account_number: targetAccountNumber,
      bank_code: formattedBankCode,
      name: bankAccount.accountHolder || memberName || "Anggota Koperasi",
    },
    description: `Pencairan Simpanan KKPUS - WD-${withdrawalId}`,
  };

  // 1. Catat log pengiriman ke database (menggunakan tabel MidtransDisbursement / log disbursement)
  let log = null;
  if (db.MidtransDisbursement) {
    try {
      log = await db.MidtransDisbursement.create(
        {
          withdrawal_id: withdrawalId,
          member_id: memberId,
          amount: amount,
          request_payload: payload,
          status: "PENDING",
        },
        { transaction }
      );
    } catch (err) {
      console.warn("[DOKU Disbursement] Gagal mencatat initial log:", err.message);
    }
  }

  try {
    console.log(`[DOKU Disbursement] Mengirim transfer WD-${withdrawalId} sebesar Rp ${amount} ke ${formattedBankCode} ${targetAccountNumber}`);

    // Eksekusi via modul resmi SNAP Kirim DOKU
    const snapResult = await transferBankSnap({
      partnerReferenceNo: `WD-${withdrawalId}`,
      beneficiaryBankCode: formattedBankCode,
      beneficiaryAccountNumber: targetAccountNumber,
      beneficiaryName: bankAccount.accountHolder || memberName || "Anggota Koperasi",
      amount,
      notes: `Pencairan Simpanan KKPUS - WD-${withdrawalId}`,
    });

    const isSuccess =
      snapResult?.responseCode === "2000000" ||
      snapResult?.responseCode === "2005400" ||
      snapResult?.status === "SUCCESS" ||
      !snapResult?.responseCode;

    const transactionId =
      snapResult?.referenceNo ||
      snapResult?.partnerReferenceNo ||
      snapResult?.transaction_id ||
      `DOKU-WD-${withdrawalId}`;

    if (log) {
      await log.update(
        {
          response_data: snapResult,
          status: isSuccess ? "SUCCESS" : "PENDING",
          midtrans_transaction_id: transactionId,
        },
        { transaction }
      );
    }

    return {
      status: "success",
      transaction_id: transactionId,
      raw: snapResult,
    };
  } catch (error) {
    console.error("[DOKU Disbursement Error]:", error.message);

    if (log) {
      await log.update(
        {
          error_message: error.message,
          status: "FAILED",
        },
        { transaction }
      );
    }

    throw new Error(`Transfer DOKU gagal: ${error.message}`);
  }
};
