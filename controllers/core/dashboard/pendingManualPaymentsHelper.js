// PATH: controllers/core/dashboard/pendingManualPaymentsHelper.js

import db from "../../../models/index.js";
import { formatRp } from "./dashboardStatsHelper.js";

/**
 * Mengambil transaksi manual yang berstatus PENDING_VERIFICATION atau memiliki bukti transfer
 */
export const fetchPendingManualPayments = async () => {
  const pendingManualPayments = await db.Transaction.findAll({
    where: {
      [db.Sequelize.Op.or]: [
        { status: ["PENDING_VERIFICATION", "pending_verification"] },
        {
          payment_type: "manual_transfer",
          status: ["PENDING", "pending", "PENDING_VERIFICATION", "pending_verification"],
        },
        {
          proof_of_transfer: { [db.Sequelize.Op.ne]: null },
          status: { [db.Sequelize.Op.notIn]: ["SUCCESS", "PAID", "COMPLETED", "REJECTED", "FAILED", "CANCELED", "EXPIRED"] },
        },
      ],
    },
    include: [
      {
        model: db.Member,
        as: "member",
        attributes: ["member_id", "member_no", "full_name", "email", "phone_number"],
      },
      {
        model: db.Bill,
        as: "bill",
        include: [
          {
            model: db.BillItem,
            as: "items",
            include: [
              {
                model: db.FinancingApplication,
                as: "financingApplication",
                attributes: ["financing_id", "category", "purpose", "status"],
              },
            ],
          },
        ],
      },
    ],
    order: [["created_at", "DESC"]],
    limit: 100,
  });

  console.log(
    "[dashboardPendingHelper] pendingManualPayments found:",
    pendingManualPayments.map((p) => ({
      id: p.transaction_id,
      cat: p.tx_category,
      status: p.status,
      proof: !!p.proof_of_transfer,
      member: p.member?.full_name,
      item: p.bill?.items?.[0]?.description,
      finCat: p.bill?.items?.[0]?.financingApplication?.category,
    }))
  );

  return pendingManualPayments;
};

/**
 * Format payload object untuk transaksi manual agar seragam dengan data approval
 */
export const mapManualTx = (tx, itemLabel) => ({
  id: tx.transaction_id,
  transaction_id: tx.transaction_id,
  member_id: tx.member_id,
  name: tx.member?.full_name || tx.sender_name || "Unknown",
  full_name: tx.member?.full_name || tx.sender_name || "Unknown",
  item: itemLabel,
  amount: formatRp(tx.amount),
  date: tx.created_at,
  is_manual_payment: true,
  tx_category: tx.tx_category,
  payment_method: tx.payment_method,
  proof_of_transfer: tx.proof_of_transfer,
  sender_bank: tx.sender_bank,
  sender_name: tx.sender_name,
  sender_account_no: tx.sender_account_no,
  final_status: tx.status || "PENDING_VERIFICATION",
  currentStep: { step_name: "Verifikasi Bendahara" },
});

/**
 * Mengelompokkan transaksi manual ke dalam masing-masing kategori dashboard
 */
export const categorizeManualPayments = (
  pendingManualPayments = [],
  programCategories = []
) => {
  const registration = [];
  const simpanan = [];
  const jualBeli = [];
  const program = [];
  const tabungan = [];
  const investasi = [];

  for (const tx of pendingManualPayments) {
    const cat = (tx.tx_category || "").toUpperCase();
    const billItem = tx.bill?.items?.[0];
    const billCat = (billItem?.category_code || "").toUpperCase();
    const billDesc = (
      billItem?.description ||
      tx.bill?.description ||
      ""
    ).toUpperCase();
    const finApp = billItem?.financingApplication;
    const finCat = (finApp?.category || "").trim();

    // 1. Keanggotaan / Pendaftaran
    if (
      cat === "MEMBER_REGISTRATION" ||
      cat.includes("REGISTRAS") ||
      cat.includes("MEMBER") ||
      billCat.includes("REGISTRAS") ||
      billDesc.includes("PENDAFTARAN")
    ) {
      registration.push(
        mapManualTx(tx, "Setoran Simpanan Pokok & Wajib (Pendaftaran)")
      );
      continue;
    }

    // 2. Tabungan
    if (
      cat.includes("TABUNGAN") ||
      billCat.includes("TAB_") ||
      billCat.includes("TABUNGAN") ||
      billDesc.includes("TABUNGAN")
    ) {
      tabungan.push(
        mapManualTx(tx, billItem?.description || "Setoran Tabungan")
      );
      continue;
    }

    // 3. Investasi (Sukuk / Pendanaan Syariah)
    if (
      cat.includes("INVESTASI") ||
      cat.includes("SUKUK") ||
      cat.includes("PENDANAAN") ||
      billCat.includes("SUKUK") ||
      finCat === "Pendanaan Syariah UMKM"
    ) {
      investasi.push(
        mapManualTx(
          tx,
          billItem?.description || "Setoran Investasi / Pendanaan"
        )
      );
      continue;
    }

    // 4. Program Pembiayaan (Pinjaman Lunak, Arisan, dll)
    const isProgramLoan =
      (finCat && programCategories.includes(finCat)) ||
      cat === "PROGRAM_PEMBIAYAAN" ||
      cat === "PINJAMAN_LUNAK" ||
      cat === "ARISAN" ||
      cat === "SETORAN_ARISAN" ||
      cat === "SETORAN_PINJAMAN" ||
      billDesc.includes("ARISAN") ||
      billDesc.includes("PINJAMAN LUNAK");

    if (isProgramLoan) {
      program.push(
        mapManualTx(
          tx,
          billItem?.description || `Setoran ${finCat || "Program Pembiayaan"}`
        )
      );
      continue;
    }

    // 5. Jual Beli (DP, Cicilan Kendaraan / Barang / dll)
    const isJualBeli =
      cat === "JUAL_BELI" ||
      cat === "SETORAN_JUAL_BELI" ||
      billCat === "TRANSACTION_DOWN_PAYMENT" ||
      billCat === "DP_PEMBIAYAAN" ||
      billDesc.includes("JUAL BELI") ||
      billDesc.includes("KENDARAAN") ||
      billDesc.includes("ELEKTRONIK") ||
      billDesc.includes("UANG TANDA KESERIUSAN") ||
      Boolean(finApp) ||
      cat === "FINANCING" ||
      cat === "FINANCING_PAYMENT" ||
      billCat === "TRANSACTION_INSTALLMENT";

    if (isJualBeli) {
      jualBeli.push(
        mapManualTx(
          tx,
          billItem?.description || `Setoran ${finCat || "Jual Beli"}`
        )
      );
      continue;
    }

    // 6. Simpanan (Sukarela, Wajib, Pokok)
    simpanan.push(
      mapManualTx(
        tx,
        billItem?.description ||
          tx.bill?.description ||
          `Setoran ${tx.tx_category?.replace(/_/g, " ") || "Simpanan"}`
      )
    );
  }

  return {
    registration,
    simpanan,
    jualBeli,
    program,
    tabungan,
    investasi,
  };
};
