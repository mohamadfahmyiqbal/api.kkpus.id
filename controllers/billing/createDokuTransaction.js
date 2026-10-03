// 📁 controllers/billing/createDokuTransaction.js
import db from "../../models/index.js";
import { v4 as uuidv4 } from "uuid";
import { jwtEncode } from "../../utils/jwtHelpers.js";
import {
  createVirtualAccount,
  createQrisPayment,
  createCheckoutPayment,
} from "../../services/dokuService.js";

const { Bill, BillItem, BillType, Transaction, Member } = db;

export const createDokuTransaction = async (req, res) => {
  let dbTransaction;
  try {
    if (!req.userId) {
      return res.status(401).json({ status: false, message: "Autentikasi gagal." });
    }

    const { bill_item_ids, tx_category, amount, payment_type } = req.body;

    if (!payment_type) {
      return res.status(400).json({ status: false, message: "Metode pembayaran harus dipilih." });
    }
    dbTransaction = await db.sequelize.transaction();

    // 1. Validasi Profil Anggota
    const member = await Member.findByPk(req.userId, {
      transaction: dbTransaction,
    });
    if (!member) throw new Error("Data profil anggota tidak ditemukan.");

    let total_gross = 0;
    let item_details = [];
    let final_bill_item_ids = [];
    let bill_type_id = null;

    // --- LOGIKA A: MEMBER_REGISTRATION ---
    if (tx_category === "MEMBER_REGISTRATION") {
      const sanitizedIds = (Array.isArray(bill_item_ids) ? bill_item_ids : [bill_item_ids])
        .filter((id) => id && String(id).trim() !== "");

      if (sanitizedIds.length === 0) throw new Error("Item tagihan tidak dipilih.");

      const existingItems = await BillItem.findAll({
        where: {
          bill_item_id: sanitizedIds,
          member_id: member.member_id,
          status: "UNPAID",
        },
        transaction: dbTransaction,
      });

      if (existingItems.length !== sanitizedIds.length) {
        throw new Error("Sebagian tagihan sudah dibayar atau tidak ditemukan.");
      }

      bill_type_id = existingItems[0].bill_type_id;
      item_details = existingItems.map((item) => {
        const amt = parseFloat(item.amount);
        total_gross += amt;
        return {
          id: `ITEM-${item.bill_item_id}`,
          price: amt,
          quantity: 1,
          name: item.description.substring(0, 50),
        };
      });
      final_bill_item_ids = sanitizedIds;
    }

    // --- LOGIKA B: DEPOSIT_SUKARELA / SAVINGS_DEPOSIT ---
    else if (tx_category === "DEPOSIT_SUKARELA" || tx_category === "SAVINGS_DEPOSIT") {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount < 10000) {
        throw new Error("Nominal deposit minimal Rp 10.000.");
      }

      total_gross = parsedAmount;
      const typeSukarela = await BillType.findOne({
        where: { type_code: "SUKARELA" },
        transaction: dbTransaction,
      });
      bill_type_id = typeSukarela?.bill_type_id || 99;

      const newItem = await BillItem.create(
        {
          member_id: member.member_id,
          bill_type_id: bill_type_id,
          amount: total_gross,
          status: "UNPAID",
          description: "Simpanan Sukarela",
          category_code: "SUKARELA",
          due_date: new Date(),
        },
        { transaction: dbTransaction }
      );

      final_bill_item_ids = [newItem.bill_item_id];
      item_details = [
        {
          id: `ITEM-${newItem.bill_item_id}`,
          price: total_gross,
          quantity: 1,
          name: "Deposit Sukarela",
        },
      ];
    }

    // --- LOGIKA C: FINANCING_PAYMENT ---
    else if (tx_category === "FINANCING_PAYMENT") {
      const sanitizedIds = (Array.isArray(bill_item_ids) ? bill_item_ids : [bill_item_ids])
        .filter((id) => id && String(id).trim() !== "");

      const isDP = sanitizedIds.length > 0 && String(sanitizedIds[0]).startsWith("dp-");
      const { financing_id } = req.body;

      if (isDP || sanitizedIds.length === 0) {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
          throw new Error("Nominal pembayaran tidak valid.");
        }

        total_gross = parsedAmount;

        let isPelunasan = false;
        if (financing_id) {
          const app = await db.FinancingApplication.findByPk(financing_id, {
            transaction: dbTransaction,
          });
          if (app && app.category && app.category.toLowerCase().includes("pelunasan")) {
            isPelunasan = true;
          }
        }

        const typeCode = isPelunasan ? "TRANSACTION_INSTALLMENT" : "TRANSACTION_DOWN_PAYMENT";
        const typeDP = await BillType.findOne({
          where: { type_code: typeCode },
          transaction: dbTransaction,
        });
        bill_type_id = typeDP?.bill_type_id || 99;

        const newItem = await BillItem.create(
          {
            member_id: member.member_id,
            bill_type_id: bill_type_id,
            financing_application_id: financing_id || null,
            amount: total_gross,
            status: "UNPAID",
            description: isPelunasan
              ? "Pembayaran Pelunasan Pembiayaan"
              : "Down Payment Pembiayaan",
            category_code: typeCode,
            due_date: new Date(),
          },
          { transaction: dbTransaction }
        );

        final_bill_item_ids = [newItem.bill_item_id];
        item_details = [
          {
            id: `ITEM-${newItem.bill_item_id}`,
            price: total_gross,
            quantity: 1,
            name: isPelunasan ? "Pelunasan Pembiayaan" : "Down Payment Pembiayaan",
          },
        ];
      } else {
        if (sanitizedIds.length === 0) throw new Error("Item tagihan tidak dipilih.");

        const existingItems = await BillItem.findAll({
          where: {
            bill_item_id: sanitizedIds,
            member_id: member.member_id,
            status: "UNPAID",
          },
          transaction: dbTransaction,
        });

        if (existingItems.length !== sanitizedIds.length) {
          throw new Error("Sebagian tagihan cicilan sudah dibayar atau tidak ditemukan.");
        }

        bill_type_id = existingItems[0].bill_type_id;
        item_details = existingItems.map((item) => {
          const amt = parseFloat(item.amount);
          total_gross += amt;
          return {
            id: `ITEM-${item.bill_item_id}`,
            price: amt,
            quantity: 1,
            name: item.description.substring(0, 50),
          };
        });
        final_bill_item_ids = sanitizedIds;
      }
    }

    // --- LOGIKA D: DEFAULT TRANSAKSI LAINNYA ---
    else {
      const sanitizedIds = (Array.isArray(bill_item_ids) ? bill_item_ids : [bill_item_ids])
        .filter((id) => id && String(id).trim() !== "");

      if (sanitizedIds.length === 0) throw new Error("Item tagihan tidak dipilih.");

      const existingItems = await BillItem.findAll({
        where: {
          bill_item_id: sanitizedIds,
          member_id: member.member_id,
          status: "UNPAID",
        },
        transaction: dbTransaction,
      });

      if (existingItems.length !== sanitizedIds.length) {
        throw new Error("Sebagian tagihan sudah dibayar atau tidak ditemukan.");
      }

      bill_type_id = existingItems[0].bill_type_id;
      item_details = existingItems.map((item) => {
        const amt = parseFloat(item.amount);
        total_gross += amt;
        return {
          id: `ITEM-${item.bill_item_id}`,
          price: amt,
          quantity: 1,
          name: item.description.substring(0, 50),
        };
      });
      final_bill_item_ids = sanitizedIds;
    }

    // 2. HITUNG BIAYA ADMIN BERDASARKAN METODE
    let fee = 0;
    const pType = payment_type.toLowerCase();

    // Cek fee dari payment_fee_configs jika ada
    const feeConfig = await db.PaymentFeeConfig.findOne({
      where: { payment_type: pType },
      transaction: dbTransaction,
    });

    if (feeConfig) {
      const flat = parseFloat(feeConfig.flat_fee || 0);
      const pct = parseFloat(feeConfig.percentage_fee || 0);
      if (feeConfig.fee_type === "FLAT") fee = flat;
      else if (feeConfig.fee_type === "PERCENTAGE") fee = Math.round(total_gross * (pct / 100));
      else if (feeConfig.fee_type === "FLAT_AND_PERCENTAGE") fee = Math.round(flat + total_gross * (pct / 100));
    } else {
      // Fallback fee standar
      if (["bca", "bni", "bri", "cimb", "permata", "mandiri"].includes(pType)) {
        fee = 4440;
      } else if (pType === "qris") {
        fee = Math.round(total_gross * 0.007);
      } else if (["gopay", "shopeepay", "ovo", "dana"].includes(pType)) {
        fee = Math.round(total_gross * 0.02);
      } else if (["indomaret", "alfamart"].includes(pType)) {
        fee = 5550;
      } else if (pType === "credit_card") {
        fee = Math.round(total_gross * 0.029) + 2000;
      }
    }

    total_gross += fee;

    // 3. BUAT HEADER TAGIHAN (BILLS)
    const newBillHeader = await Bill.create(
      {
        bill_id: uuidv4(),
        member_id: member.member_id,
        member_no: member.member_no,
        bill_type_id: bill_type_id,
        amount: total_gross,
        status: "pending",
        description: `${tx_category} #${member.member_no}`,
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      { transaction: dbTransaction }
    );

    const generatedBillId = newBillHeader.bill_id;

    // Ikat BillItem ke header
    await BillItem.update(
      { bill_id: generatedBillId },
      { where: { bill_item_id: final_bill_item_ids }, transaction: dbTransaction }
    );

    // 4. SIMPAN TRANSAKSI KE DATABASE LOKAL
    const order_id = `BILL-${generatedBillId.substring(0, 8)}-${Date.now()}`;
    const localTx = await Transaction.create(
      {
        member_id: member.member_id,
        bill_id: generatedBillId,
        midtrans_order_id: order_id, // Kolom order_id di db
        amount: total_gross,
        status: "PENDING",
        tx_type: "SETORAN",
        tx_category: tx_category,
        payment_type: "doku",
        payment_method: pType,
        is_ledger_recorded: false,
      },
      { transaction: dbTransaction }
    );

    // 5. REQUEST KE DOKU API
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
    const pageName = "invoicePage";
    const returnPage = tx_category === "MEMBER_REGISTRATION" ? "registrationPage" : "billingPage";
    const successToken = jwtEncode({
      page: pageName,
      billId: generatedBillId,
      return: returnPage,
      status: "success",
    });

    let dokuResponse = null;
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

    // 6. COMMIT DB TRANSAKSI
    await dbTransaction.commit();

    return res.status(200).json({
      status: true,
      data: {
        midtransResponse: paymentInstruction, // Tetap gunakan properti ini agar kompatibel dengan state frontend
        billId: generatedBillId,
        orderId: order_id,
        dokuData: paymentInstruction,
      },
    });
  } catch (error) {
    if (dbTransaction) await dbTransaction.rollback();
    console.error("CREATE_DOKU_ERROR:", error);
    return res.status(400).json({
      status: false,
      message: error.message || "Gagal membuat transaksi DOKU.",
    });
  }
};
