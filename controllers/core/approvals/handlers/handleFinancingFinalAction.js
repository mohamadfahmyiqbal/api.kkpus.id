import db from "../../../../models/index.js";
import { sendToUser } from "../../../../utils/socket.js";
import { sendGlobalNotification } from "../../../../services/notificationHelper.js";
import { syncFinancialSummary } from "../../../../services/financialSummarySyncService.js";
import { syncJualBeliReport } from "../../../../services/jualBeliReportSyncService.js";
import moment from "moment";

/**
 * Final action handler for Financing Application approvals (including Arisan).
 */
export const handleFinancingFinalAction = async ({ entity, transaction: t }) => {
  const { FinancingApplication, ArisanParticipant, BillItem, BillType } = db;
  const memberId = entity.member_id;
  const isArisan = entity.category === "Arisan";
  const isPelunasan = typeof entity.category === "string" && entity.category.toLowerCase().includes("pelunasan");

  console.log(`[handleFinancingFinalAction] Creating bills for financing ${entity.financing_id}, member ${memberId}, isArisan: ${isArisan}, isPelunasan: ${isPelunasan}`);

  // 1. Update status to APPROVED
  await FinancingApplication.update(
    { status: "APPROVED", updated_at: new Date() },
    { where: { financing_id: entity.financing_id }, transaction: t }
  );

  // 2. KHUSUS ARISAN: Daftarkan sebagai partisipan arisan jika ada arisan_batch_id
  if (isArisan && entity.arisan_batch_id) {
    const existingParticipant = await ArisanParticipant.findOne({
      where: {
        member_id: memberId,
        arisan_batch_id: entity.arisan_batch_id,
      },
      transaction: t,
    });

    if (!existingParticipant) {
      const participantCount = await ArisanParticipant.count({
        where: { arisan_batch_id: entity.arisan_batch_id },
        transaction: t,
      });

      await ArisanParticipant.create(
        {
          arisan_batch_id: entity.arisan_batch_id,
          member_id: memberId,
          participant_no: participantCount + 1,
          saldo_putang: 0,
          cicilan_target: entity.monthly_installment,
          status: "APPROVED",
        },
        { transaction: t }
      );

      console.log(`[handleFinancingFinalAction] Created ArisanParticipant for member ${memberId} in batch ${entity.arisan_batch_id}`);
    }
  }

  // 3. Get bill types for financing
  const downPaymentBillType = await BillType.findByPk(7, { transaction: t });
  const installmentBillType = await BillType.findByPk(8, { transaction: t });

  console.log(`[handleFinancingFinalAction] Bill types:`, {
    downPaymentBillType: downPaymentBillType?.type_code,
    installmentBillType: installmentBillType?.type_code,
  });

  // 4. Create bill_items for downpayment and installments
  const downPayment = parseFloat(entity.down_payment) || 0;
  const monthlyInstallment = parseFloat(entity.monthly_installment) || 0;
  const months = entity.cooperation_months || 0;

  let billsCreated = 0;

  if (!isPelunasan) {
    if (downPayment > 0) {
      await BillItem.create(
        {
          bill_type_id: 7,
          category_code: downPaymentBillType?.type_code || "TRANSACTION_DOWN_PAYMENT",
          bill_id: null,
          member_id: memberId,
          financing_application_id: entity.financing_id,
          description: isArisan ? "Uang Pangkal/DP Arisan" : `DP / Uang Muka ${entity.category || "Pinjaman"}`,
          amount: downPayment,
          due_date: new Date(),
          status: "UNPAID",
        },
        { transaction: t }
      );
      billsCreated++;
    }

    for (let i = 1; i <= months; i++) {
      const dueDate = moment().add(i, "months").endOf("month").toDate();
      await BillItem.create(
        {
          bill_type_id: 8,
          category_code: installmentBillType?.type_code || "TRANSACTION_INSTALLMENT",
          bill_id: null,
          member_id: memberId,
          financing_application_id: entity.financing_id,
          description: isArisan ? `Setoran Arisan - Bulan ${i}` : `Cicilan ${entity.category || "Pinjaman Lunak"} - Bulan ${i}`,
          amount: monthlyInstallment,
          due_date: dueDate,
          status: "UNPAID",
        },
        { transaction: t }
      );
      billsCreated++;
    }
  }

  console.log(`[handleFinancingFinalAction] Total bills created: ${billsCreated}`);

  // 5. Real-time notification + Global notification & Report Sync
  t.afterCommit(async () => {
    sendToUser(memberId, "bills:update", { trigger: true });

    const title = isArisan ? "Arisan Disetujui!" : "Pembiayaan Disetujui!";
    const content = isArisan
      ? `Selamat! Pengajuan arisan Anda telah disetujui. Silahkan cek tagihan untuk setoran pertama.`
      : `Pembiayaan Anda telah disetujui. ${billsCreated} tagihan telah dibuat.`;

    sendGlobalNotification({
      memberId,
      title,
      content,
      type: "APPROVAL",
      url: isArisan ? "/program" : "/",
    }).catch((err) => console.error("[handleFinancingFinalAction] Financing notification failed:", err.message));

    try {
      await syncJualBeliReport(db.sequelize, memberId);
      await syncFinancialSummary(db.sequelize, memberId);
    } catch (error) {
      console.error("[handleFinancingFinalAction] Failed to sync reports after financing approval:", error.message);
    }
  });
};
