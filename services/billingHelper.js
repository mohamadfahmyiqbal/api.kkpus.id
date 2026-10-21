import db from "../models/index.js";

const { BillItem, BillType } = db;

/**
 * Sanitizes item IDs from request (string, array, or undefined)
 */
export const sanitizeIds = (bill_item_ids) => {
  return (Array.isArray(bill_item_ids) ? bill_item_ids : [bill_item_ids])
    .filter((id) => id && String(id).trim() !== "");
};

/**
 * Prepares bill items, amounts, and item details based on tx_category.
 */
export const prepareBillItems = async ({
  tx_category,
  bill_item_ids,
  amount,
  financing_id,
  member,
  dbTransaction,
}) => {
  let total_gross = 0;
  let item_details = [];
  let final_bill_item_ids = [];
  let bill_type_id = null;

  // --- 1. MEMBER_REGISTRATION ---
  if (tx_category === "MEMBER_REGISTRATION") {
    const sanitizedIds = sanitizeIds(bill_item_ids);
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

  // --- 2. DEPOSIT_SUKARELA / SAVINGS_DEPOSIT ---
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

  // --- 3. FINANCING_PAYMENT / FINANCING / DP ---
  else if (
    tx_category === "FINANCING_PAYMENT" ||
    tx_category === "FINANCING" ||
    tx_category === "TRANSACTION_DOWN_PAYMENT" ||
    (Array.isArray(bill_item_ids) &&
      bill_item_ids.some(
        (id) => typeof id === "string" && id.startsWith("dp-")
      ))
  ) {
    const sanitizedIds = sanitizeIds(bill_item_ids);
    const isDP =
      tx_category === "TRANSACTION_DOWN_PAYMENT" ||
      (sanitizedIds.length > 0 && String(sanitizedIds[0]).startsWith("dp-"));

    if (isDP || sanitizedIds.length === 0) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Nominal pembayaran tidak valid.");
      }

      total_gross = parsedAmount;

      let isPelunasan = false;
      const targetFinancingId =
        financing_id ||
        (isDP && sanitizedIds[0] ? String(sanitizedIds[0]).replace(/^dp-/, "") : null);

      if (targetFinancingId) {
        const app = await db.FinancingApplication.findByPk(targetFinancingId, {
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

      // Cari BillItem UNPAID eksisting agar tidak terjadi duplikasi
      let newItem = targetFinancingId
        ? await BillItem.findOne({
            where: {
              member_id: member.member_id,
              financing_application_id: targetFinancingId,
              category_code: typeCode,
              status: "UNPAID",
            },
            transaction: dbTransaction,
          })
        : null;

      if (!newItem) {
        newItem = await BillItem.create(
          {
            member_id: member.member_id,
            bill_type_id: bill_type_id,
            financing_application_id: targetFinancingId || null,
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
      } else {
        if (parseFloat(newItem.amount) !== total_gross) {
          await newItem.update({ amount: total_gross }, { transaction: dbTransaction });
        }
      }

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

  // --- 4. DEFAULT TRANSAKSI LAINNYA ---
  else {
    const sanitizedIds = sanitizeIds(bill_item_ids);
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

  return {
    total_gross,
    item_details,
    final_bill_item_ids,
    bill_type_id,
  };
};

/**
 * Calculates admin fee based on payment type and database configuration or fallback defaults.
 */
export const calculatePaymentFee = async (pType, total_gross, dbTransaction) => {
  let fee = 0;

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

  return fee;
};
