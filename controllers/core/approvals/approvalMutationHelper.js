// PATH: controllers/core/approvals/approvalMutationHelper.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../../../models/index.js";

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.join(path.dirname(__filename), "..", "..", "..");

export const saveBase64File = (base64File, identifier, prefix) => {
  if (!base64File?.includes("base64,")) throw new Error(`Data file tidak valid.`);
  const parts = base64File.match(/^data:(image\/(jpeg|png|jpg)|application\/pdf);base64,(.*)$/);
  if (!parts) throw new Error(`Format file harus JPG, PNG, atau PDF.`);

  const mimeType = parts[1];
  const fileBuffer = Buffer.from(parts[3], "base64");
  
  let extension = mimeType.split("/")[1];
  if (extension === "jpeg") extension = "jpg";

  const uploadDir = path.join(rootDir, "uploads", "transfers");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filename = `${identifier}_${prefix}_${Date.now()}.${extension}`;
  const filePath = path.join(uploadDir, filename);

  fs.writeFileSync(filePath, fileBuffer);
  return `uploads/transfers/${filename}`;
};

export const prepareEntityUpdateData = async ({
  entity,
  entityRef,
  entityId,
  reqBody,
  transaction
}) => {
  const { amount, transfer_proof, operational_cost, discount } = reqBody;
  const updateData = { updatedAt: new Date() };

  // Handle upload bukti transfer / pelunasan
  if (
    transfer_proof &&
    ["savings_withdrawal", "tabungan_withdrawals", "financing_applications", "exit_requests"].includes(entityRef)
  ) {
    try {
      const prefix = (entityRef === "savings_withdrawal" || entityRef === "tabungan_withdrawals")
        ? "wd"
        : (entityRef === "exit_requests" ? "term" : "fin");
      const savedPath = saveBase64File(transfer_proof, entityId, prefix);

      if (entityRef === "exit_requests") {
        updateData.payment_proof_path = savedPath;
        entity.payment_proof_path = savedPath;
      } else {
        updateData.transfer_proof_path = savedPath;
        entity.transfer_proof_path = savedPath;
      }
    } catch (e) {
      console.error("Failed to save transfer proof", e);
      throw new Error("Gagal menyimpan bukti transfer: " + e.message);
    }
  }

  // Khusus untuk withdrawal
  if (entityRef === "savings_withdrawal" || entityRef === "tabungan_withdrawals") {
    if (amount !== undefined) {
      updateData.amount = amount;
      entity.amount = amount;
    }
  }

  // Khusus untuk financing_applications
  if (entityRef === "financing_applications" && (operational_cost !== undefined || discount !== undefined)) {
    const opCost = Number(operational_cost) || 0;
    const discountAmount = Number(discount) || 0;
    const itemPrice = Number(entity.item_price) || 0;
    const marginPercent = Number(entity.margin_percent) || 0;
    const dp = Number(entity.down_payment) || 0;
    const tenor = parseInt(entity.cooperation_months) || 1;

    // (harga barang + operasional - dp)
    const newPokok = Math.max(0, itemPrice + opCost - dp);
    // * margin
    const newKeuntungan = newPokok * (marginPercent / 100);
    // Total Hutang
    let newTotalTagihan = newPokok + newKeuntungan;
    if (discountAmount > 0) {
      newTotalTagihan = Math.max(0, newTotalTagihan - discountAmount);
    }
    // / tenor
    const newCicilan = Math.ceil(newTotalTagihan / tenor);

    updateData.operational_cost = opCost;
    updateData.amount_requested = newPokok;
    updateData.margin_amount = newKeuntungan;
    updateData.total_tagihan = newTotalTagihan;
    updateData.monthly_installment = newCicilan;
    updateData.discount = discountAmount;

    entity.operational_cost = opCost;
    entity.amount_requested = newPokok;
    entity.margin_amount = newKeuntungan;
    entity.total_tagihan = newTotalTagihan;
    entity.monthly_installment = newCicilan;
    entity.discount = discountAmount;

    // Apply discount to original transaction if this is a Pelunasan
    if (entity.keterangan && entity.keterangan.startsWith("PELUNASAN_REF:")) {
      const originalId = entity.keterangan.split(":")[1];
      if (originalId) {
        await db.FinancingApplication.update(
          { discount: discountAmount },
          { where: { financing_id: originalId }, transaction }
        );
      }
    }
  }

  return updateData;
};
