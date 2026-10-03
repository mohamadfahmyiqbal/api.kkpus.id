import db from "../../../../models/index.js";
import { sendGlobalNotification } from "../../../../services/notificationHelper.js";

/**
 * Final action handler for Membership Exit Requests (MembershipTermination).
 */
export const handleExitRequestFinalAction = async ({ entity, transaction: t }) => {
  const termMemberId = entity.member_id;

  // 1. Update status to WAITING_CONFIRMATION
  await db.MembershipTermination.update(
    { status: "WAITING_CONFIRMATION", updated_at: new Date() },
    { where: { termination_id: entity.termination_id }, transaction: t }
  );

  console.log(`[handleExitRequestFinalAction] MembershipTermination ${entity.termination_id} approved by Bendahara. Status set to WAITING_CONFIRMATION.`);

  // 2. Global notification
  t.afterCommit(() => {
    sendGlobalNotification({
      memberId: termMemberId,
      title: "Dana Berhenti Keanggotaan Telah Ditransfer!",
      content: `Pencairan dana telah dilakukan oleh Bendahara. Silakan konfirmasi penerimaan dana untuk menyelesaikan proses berhenti keanggotaan.`,
      type: "APPROVAL",
      url: "/",
    }).catch((err) => console.error("[handleExitRequestFinalAction] exit_requests notification failed:", err.message));
  });
};
