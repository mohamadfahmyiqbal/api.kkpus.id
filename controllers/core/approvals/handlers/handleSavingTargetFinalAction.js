import db from "../../../../models/index.js";
import { sendToUser } from "../../../../utils/socket.js";
import { sendGlobalNotification } from "../../../../services/notificationHelper.js";

/**
 * Final action handler for Member Saving Target approvals.
 */
export const handleSavingTargetFinalAction = async ({ entity, transaction: t }) => {
  const { BillType } = db;
  const targetMemberIdForTabungan = entity.member_id;

  // 1. Update status to APPROVED
  await db.MemberSavingTarget.update(
    { status: "APPROVED", updated_at: new Date() },
    { where: { member_saving_target_id: entity.member_saving_target_id }, transaction: t }
  );

  // 2. Ensure BillType exists
  await BillType.findOrCreate({
    where: { type_code: "TABUNGAN_DEPOSIT" },
    defaults: {
      tx_type: "SETORAN",
      category_map: "SAVINGS_TARGET",
      type_name: "Setoran Tabungan",
      period_type: "MONTHLY",
      default_amount: 0,
    },
    transaction: t,
  });

  console.log(`[handleSavingTargetFinalAction] MemberSavingTarget ${entity.member_saving_target_id} approved. No monthly installment bills generated because saving targets are completely flexible.`);

  // 3. Real-time notification & Global notification
  t.afterCommit(() => {
    sendToUser(targetMemberIdForTabungan, "savings:update", { trigger: true });
    sendToUser(targetMemberIdForTabungan, "bills:update", { trigger: true });

    sendGlobalNotification({
      memberId: targetMemberIdForTabungan,
      title: "Pengajuan Tabungan Disetujui!",
      content: `Pengajuan Tabungan Anda telah disetujui.`,
      type: "APPROVAL",
      url: "/",
    }).catch((err) => console.error("[handleSavingTargetFinalAction] Tabungan notification failed:", err.message));
  });
};
