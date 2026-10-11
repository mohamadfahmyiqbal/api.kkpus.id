// 📁 services/dokuDisbursementService.js
import axios from "axios";
import db from "../models/index.js";
import { dokuRequest, getDokuConfig } from "./dokuService.js";
import { transferBankSnap } from "./dokuSnapService.js";

/**
 * Normalisasi kode bank lokal ke format standar DOKU Cash Out / Transfer Bank
 */
const BANK_CODE_MAP = {
  // Bank BUMN & Swasta Besar
  "BCA": "014",
  "BANK CENTRAL ASIA": "014",
  "MANDIRI": "008",
  "BANK MANDIRI": "008",
  "BRI": "002",
  "BANK RAKYAT INDONESIA": "002",
  "BNI": "009",
  "BANK NEGARA INDONESIA": "009",
  "CIMB": "022",
  "CIMB NIAGA": "022",
  "PERMATA": "013",
  "BANK PERMATA": "013",
  "DANAMON": "011",
  "BANK DANAMON": "011",
  "BSI": "451",
  "BANK SYARIAH INDONESIA": "451",
  "BTN": "200",
  "BANK TABUNGAN NEGARA": "200",
  "BTPN": "213",
  "JENIUS": "213",
  "BANK BTPN": "213",
  "JAGO": "542",
  "BANK JAGO": "542",
  "MEGA": "426",
  "BANK MEGA": "426",
  "PANIN": "019",
  "BANK PANIN": "019",
  "OCBC": "028",
  "OCBC NISP": "028",
  "MAYBANK": "016",
  "SINARMAS": "153",
  "BANK SINARMAS": "153",
  "BSI": "451",
  "NEO": "490",
  "BANK NEO COMMERCE": "490",
  "SEABANK": "535",
  "ALLO": "567",
  "ALLO BANK": "567",
  "BJB": "110",
  "BANK JABAR": "110",
  "DKI": "111",
  "BANK DKI": "111",
  "JATENG": "113",
  "JATIM": "114",
};

export const normalizeBankCode = (bankName) => {
  if (!bankName) return "014";
  const raw = String(bankName).trim();

  // 1. Jika user sudah memasukkan kode 3 digit angka (contoh: "008", "014")
  if (/^\d{3}$/.test(raw)) {
    return raw;
  }

  // 2. Normalisasi string
  const clean = raw.toUpperCase().replace(/^BANK\s+/, "").trim();

  // 3. Cocokkan langsung dari kamus
  if (BANK_CODE_MAP[clean]) return BANK_CODE_MAP[clean];
  if (BANK_CODE_MAP[raw.toUpperCase()]) return BANK_CODE_MAP[raw.toUpperCase()];

  // 4. Pattern matching parsial
  for (const [key, code] of Object.entries(BANK_CODE_MAP)) {
    if (clean.includes(key) || key.includes(clean)) {
      return code;
    }
  }

  return "014"; // Default fallback
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
