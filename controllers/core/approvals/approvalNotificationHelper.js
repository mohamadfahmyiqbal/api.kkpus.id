// PATH: controllers/core/approvals/approvalNotificationHelper.js

import db from "../../../models/index.js";
import { sendGlobalNotification } from "../../../services/notificationHelper.js";
import { sendToUser } from "../../../utils/socket.js";

const logDebug = (label, data = {}) => {
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[APPROVAL][${label}]`, data);
  }
};

export const notifyApprovalResult = async ({
  entity,
  entityRef,
  entityId,
  config,
  currentStep,
  nextStep,
  action,
  notes,
  isLastStep,
  approverId,
  updateData,
  finalStatusValue,
}) => {
  const targetMemberId = entity[config.memberField];
  const statusField = config.statusField || "status";
  const currentStatus = updateData[statusField] || entity[statusField];

  if (!targetMemberId) return;

  try {
    const entityLabel = entityRef.replace(/_/g, " ");
    const stepLabel = currentStep?.step_name || "";

    let title;
    let content;

    if (currentStatus === "APPROVED") {
      title = `Pengajuan ${entityLabel} Disetujui`;
      content = isLastStep
        ? "Pengajuan telah disetujui sepenuhnya."
        : `Langkah "${stepLabel}" disetujui. Menunggu verifikasi berikutnya.`;
    } else if (currentStatus === "REJECTED") {
      title = `Pengajuan ${entityLabel} Ditolak`;
      content = notes
        ? `Pengajuan ditolak. Alasan: ${notes}`
        : `Pengajuan ${entityLabel} ditolak oleh verifikator.`;
    } else {
      title = `Update Persetujuan ${entityLabel}`;
      content = stepLabel
        ? `Langkah "${stepLabel}" disetujui. Menunggu verifikasi berikutnya.`
        : "Langkah disetujui, menunggu verifikasi berikutnya.";
    }

    logDebug("NOTIFICATION", { targetMemberId, title, status: currentStatus });

    // 1. Kirim Socket.io (Real-time UI Update)
    const socketEvent = entityRef === "members"
      ? "member_registration:update"
      : (entityRef === "savings_withdrawal" || entityRef === "tabungan_withdrawals")
      ? "withdrawals:update"
      : `${entityRef}:update`;

    const socketPayload = {
      entityId,
      entityRef,
      financingId: entityId,
      financing_id: entityId,
      status: currentStatus,
      current_step_id: updateData.current_step_id,
      step_name: stepLabel,
      trigger: true,
      approval_step_id: currentStep.approval_step_id,
      step_order: currentStep.step_order,
      role_name: currentStep.verifierRole?.role_name || "",
      note: notes,
      ...(entityRef === "members" && {
        final_status: finalStatusValue === "APPROVED" ? "APPROVED" :
                     finalStatusValue === "REJECTED" ? "REJECTED" : "PENDING",
        is_approved_pengawas: currentStep?.step_order === 1 ? action === "approve" : entity.is_approved_pengawas,
        is_approved_ketua: currentStep?.step_order === 2 ? action === "approve" : entity.is_approved_ketua,
      }),
    };

    sendToUser(targetMemberId, socketEvent, socketPayload);
    if (approverId && approverId !== targetMemberId) {
      sendToUser(approverId, socketEvent, socketPayload);
    }

    // Compatibility events
    if (entityRef === "members") {
      sendToUser(targetMemberId, "REGISTRATION_UPDATED", socketPayload);
      if (approverId && approverId !== targetMemberId) sendToUser(approverId, "REGISTRATION_UPDATED", socketPayload);
    } else if (entityRef === "transactions") {
      sendToUser(targetMemberId, "TRANSACTION_UPDATED", socketPayload);
      if (approverId && approverId !== targetMemberId) sendToUser(approverId, "TRANSACTION_UPDATED", socketPayload);
    } else {
      sendToUser(targetMemberId, `${entityRef.toUpperCase()}_UPDATED`, socketPayload);
      if (approverId && approverId !== targetMemberId) sendToUser(approverId, `${entityRef.toUpperCase()}_UPDATED`, socketPayload);
    }

    // 2. Kirim Global Notification (Simpan ke DB + Push + Socket Bell - Non-blocking)
    sendGlobalNotification({
      memberId: targetMemberId,
      title,
      content,
      type: "APPROVAL",
      url: entityRef === "members" ? "/registration-status" : "/",
    }).catch((e) => console.error("[processApproval] Global Notification error:", e.message));

    // 3. Notifikasi ke Approver Berikutnya (Non-blocking)
    if (action === "approve" && nextStep) {
      db.MemberRoleAssignment.findAll({
        where: { role_id: nextStep.role_id },
      }).then((nextApprovers) => {
        db.Member.findByPk(targetMemberId, { attributes: ["full_name"] }).then((applicant) => {
          const applicantName = applicant?.full_name || "Seorang Anggota";
          Promise.allSettled(
            nextApprovers.map((approver) =>
              sendGlobalNotification({
                memberId: approver.member_id,
                title: `Persetujuan ${entityLabel}`,
                content: `Menunggu verifikasi Anda: Pengajuan ${entityLabel} dari ${applicantName}.`,
                type: "APPROVAL_REQUIRED",
                url: "/approvals",
              })
            )
          );
        });
      }).catch((e) => console.error("[processApproval] Next approver notification error:", e.message));
    }
  } catch (e) {
    console.error("[processApproval] Notification emission error:", e.message);
  }
};
